// file: src/server/video/video.service.ts
import crypto from "crypto";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { mux, playbackTTL, playbackUrl, uploadCorsOrigin } from "./mux";

function parseLessonIdFromPassthrough(passthrough?: string | null): string | null {
  if (!passthrough) return null;
  const m = passthrough.match(/^lesson:([^:]+):upload:/);
  return m?.[1] ?? null;
}

function parseCourseIdFromPassthrough(passthrough?: string | null): string | null {
  if (!passthrough) return null;
  const m = passthrough.match(/^course:(.+)$/);
  return m?.[1] ?? null;
}

export async function adminCreateMuxDirectUploadForLesson(lessonId: string) {
  // Ensure lesson exists (avoid orphan uploads)
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true } });
  if (!lesson) throw new AppError("NOT_FOUND", 404, "Lesson not found");

  // Create a local upload record first (unique placeholder; updated after Mux response)
  const pendingUploadId = `PENDING_${crypto.randomUUID()}`;
  const local = await prisma.videoUpload.create({
    data: {
      lessonId,
      muxUploadId: pendingUploadId,
      status: "CREATED",
    },
  });

  const passthrough = `lesson:${lessonId}:upload:${local.id}`;

  // Create Mux direct upload (signed playback policy)
  const upload = await mux.video.uploads.create({
    cors_origin: uploadCorsOrigin(),
    new_asset_settings: {
      passthrough,
      playback_policy: ["signed"],
    },
  });

  if (!upload?.id || !upload?.url) {
    throw new AppError("INTERNAL", 500, "Mux upload create failed");
  }

  // Update local record with real Mux upload ID + passthrough
  await prisma.videoUpload.update({
    where: { id: local.id },
    data: { muxUploadId: upload.id, passthrough },
  });

  return { uploadId: upload.id, url: upload.url, passthrough };
}

export async function getSignedPlaybackForLesson(params: {
  lessonId: string;
  viewer: { userId: string; email?: string | null; roles: string[] };
}) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    select: {
      id: true,
      title: true,
      published: true,
      video: { select: { muxPlaybackId: true } },
      module: {
        select: {
          course: {
            select: {
              published: true,
              track: { select: { published: true } },
            },
          },
        },
      },
    },
  });

  if (!lesson) throw new AppError("NOT_FOUND", 404, "Lesson not found");
  if (!lesson.video?.muxPlaybackId) throw new AppError("NOT_FOUND", 404, "Video not ready");

  const isPrivileged = params.viewer.roles.includes("ADMIN") || params.viewer.roles.includes("INSTRUCTOR");

  // Unpublished lesson: only ADMIN/INSTRUCTOR
  if (!lesson.published && !isPrivileged) throw new AppError("FORBIDDEN", 403, "Forbidden");

  // If parent course/track unpublished: also restrict (track may be null)
  const trackPublished = lesson.module.course.track?.published ?? true;
  if ((!lesson.module.course.published || !trackPublished) && !isPrivileged) {
    throw new AppError("FORBIDDEN", 403, "Forbidden");
  }

  // Sign playback (Mux JWT with keyId/keySecret)
  const token = await mux.jwt.signPlaybackId(lesson.video.muxPlaybackId, {
    keyId: process.env.MUX_SIGNING_KEY_ID!,
    keySecret: process.env.MUX_PRIVATE_KEY!,
    expiration: playbackTTL(),
  });

  const url = playbackUrl(lesson.video.muxPlaybackId, token);
  const watermarkText = `${params.viewer.email ?? "user"} • ${params.viewer.userId} • ${new Date().toISOString()}`;
  return { lessonId: lesson.id, title: lesson.title, playbackUrl: url, watermarkText };
}

export async function handleMuxWebhook(event: {
  id?: string;
  type?: string;
  data?: Record<string, unknown>;
}) {
  const muxEventId: string | undefined = event?.id;
  const type: string | undefined = event?.type;
  const data = event?.data as Record<string, unknown> | undefined;

  if (!muxEventId || !type) throw new AppError("BAD_REQUEST", 400, "Invalid webhook payload");

  // Idempotency
  const existing = await prisma.videoEvent.findUnique({ where: { muxEventId } });
  if (existing?.status === "PROCESSED") return { ok: true };

  await prisma.videoEvent.upsert({
    where: { muxEventId },
    update: {},
    create: { muxEventId, type, payload: event as object },
  });

  try {
    if (type === "video.upload.asset_created") {
      const uploadId = data?.id as string | undefined;
      const assetId = data?.asset_id as string | undefined;

      if (uploadId && assetId) {
        await prisma.videoUpload.updateMany({
          where: { muxUploadId: uploadId },
          data: { assetId, status: "ASSET_CREATED" },
        });
        await prisma.courseIntroVideoUpload.updateMany({
          where: { muxUploadId: uploadId },
          data: { assetId, status: "ASSET_CREATED" },
        });
      }
    }

    if (type === "video.asset.ready") {
      const assetId = data?.id as string | undefined;
      const passthrough = data?.passthrough as string | undefined;
      let playbackId = (data?.playback_ids as { id?: string }[] | undefined)?.[0]?.id;

      if (!assetId) throw new AppError("BAD_REQUEST", 400, "Missing asset id");
      if (!playbackId) {
        const asset = await mux.video.assets.retrieve(assetId);
        playbackId = (asset?.playback_ids?.[0] as { id?: string } | undefined)?.id ?? undefined;
      }
      if (!playbackId) throw new AppError("BAD_REQUEST", 400, "Missing playback id");

      // Course intro video: passthrough "course:courseId"
      const courseId = parseCourseIdFromPassthrough(passthrough);
      if (courseId) {
        await prisma.$transaction(async (tx) => {
          await tx.course.update({
            where: { id: courseId },
            data: { introVideoMuxPlaybackId: playbackId },
          });
          await tx.courseIntroVideoUpload.updateMany({
            where: { courseId, assetId },
            data: { status: "READY" },
          });
        });
      } else {
        // Lesson video
        let lessonId = parseLessonIdFromPassthrough(passthrough);
        if (!lessonId) {
          const up = await prisma.videoUpload.findFirst({
            where: { assetId },
            select: { lessonId: true },
            orderBy: { createdAt: "desc" },
          });
          lessonId = up?.lessonId ?? null;
        }
        if (!lessonId) throw new AppError("BAD_REQUEST", 400, "Could not map asset to lesson");

        await prisma.$transaction(async (tx) => {
          await tx.lessonVideo.upsert({
            where: { lessonId: lessonId! },
            update: { muxAssetId: assetId, muxPlaybackId: playbackId },
            create: { lessonId: lessonId!, muxAssetId: assetId, muxPlaybackId: playbackId },
          });

          await tx.videoUpload.updateMany({
            where: { lessonId: lessonId!, assetId },
            data: { status: "READY" },
          });
        });
      }
    }

    if (type === "video.asset.errored") {
      const assetId = data?.id as string | undefined;
      if (assetId) {
        await prisma.videoUpload.updateMany({
          where: { assetId },
          data: { status: "ERRORED" },
        });
      }
    }

    await prisma.videoEvent.update({
      where: { muxEventId },
      data: { status: "PROCESSED", processedAt: new Date() },
    });

    return { ok: true };
  } catch (e) {
    await prisma.videoEvent.update({
      where: { muxEventId },
      data: { status: "FAILED", processedAt: new Date() },
    });
    throw e;
  }
}
