// file: src/server/video/video.service.ts
import crypto from "crypto";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { mux, playbackTTL, playbackTTLSeconds, playbackUrl, uploadCorsOrigin } from "./mux";
import { isSignedPlaybackConfigured } from "@/server/mux/config";
import { pickMuxPlaybackId } from "@/server/mux/playback-id";
import { assertCanAccessLessonPlayback } from "./playback-access";
import { viewerWatermarkMarker } from "./watermark";
import { assertActiveDeviceSession } from "@/server/auth/device-session";

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
  viewer: {
    userId: string | null;
    email?: string | null;
    roles: string[];
    deviceSessionId?: string | null;
  };
}) {
  const access = await assertCanAccessLessonPlayback(params.lessonId, params.viewer);

  // Enforce the device limit at the point tokens are minted. Mux cannot check who
  // is asking, so this is where "one phone and one computer" becomes real for
  // video: a displaced device stops receiving fresh tokens and playback halts at
  // the next refresh.
  if (params.viewer.userId) {
    await assertActiveDeviceSession(params.viewer.userId, params.viewer.deviceSessionId);
  }

  if (!isSignedPlaybackConfigured()) {
    throw new AppError(
      "UNAVAILABLE",
      503,
      "Signed playback is not configured (MUX_SIGNING_KEY_ID / MUX_PRIVATE_KEY)"
    );
  }

  const ttlSeconds = playbackTTLSeconds();
  const token = await mux.jwt.signPlaybackId(access.muxPlaybackId, {
    keyId: process.env.MUX_SIGNING_KEY_ID!,
    keySecret: process.env.MUX_PRIVATE_KEY!,
    // Restrict to video delivery so the same token cannot fetch thumbnails,
    // storyboards, or gifs for this asset.
    type: "video",
    expiration: playbackTTL(),
  });

  const url = playbackUrl(access.muxPlaybackId, token);

  // Opaque marker only: never send the viewer's email or user id to the browser.
  const watermarkText = params.viewer.userId
    ? viewerWatermarkMarker(params.viewer.userId)
    : null;

  return {
    lessonId: access.lessonId,
    title: access.title,
    playbackUrl: url,
    token,
    /** Epoch millis. Lets the player roll the token before Mux rejects it. */
    expiresAt: Date.now() + ttlSeconds * 1000,
    watermarkText,
    isFreePreview: access.isFreePreview,
  };
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
      let playbackId = pickMuxPlaybackId(
        data?.playback_ids as { id?: string; policy?: string }[] | undefined
      );

      if (!assetId) throw new AppError("BAD_REQUEST", 400, "Missing asset id");
      if (!playbackId) {
        const asset = await mux.video.assets.retrieve(assetId);
        playbackId = pickMuxPlaybackId(asset?.playback_ids);
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
