/**
 * Mux service: direct uploads, asset/playback IDs, and optional signed playback tokens.
 * Requires MUX_TOKEN_ID and MUX_TOKEN_SECRET. Webhook and signed playback are optional.
 */
import Mux from "@mux/mux-node";
import { prisma } from "@/server/db/prisma";
import { getMuxConfigFresh, isMuxApiConfigured } from "./config";

let muxClient: Mux | null = null;

function getMux(): Mux {
  if (!muxClient) {
    const config = getMuxConfigFresh();
    if (!config.tokenId || !config.tokenSecret)
      throw new Error("Mux API not configured: set MUX_TOKEN_ID and MUX_TOKEN_SECRET");
    muxClient = new Mux({
      tokenId: config.tokenId,
      tokenSecret: config.tokenSecret,
    });
  }
  return muxClient;
}

export type CreateDirectUploadResult = {
  uploadId: string;
  url: string;
};

/**
 * Create a direct upload URL for a lesson. Creates a VideoUpload record (CREATED)
 * and passes lessonId in passthrough so the webhook can update it and create LessonVideo.
 */
export async function createDirectUpload(lessonId: string): Promise<CreateDirectUploadResult> {
  const mux = getMux();
  const config = getMuxConfigFresh();
  const upload = await mux.video.uploads.create({
    cors_origin: config.uploadCorsOrigin,
    new_asset_settings: {
      playback_policy: ["public"],
      passthrough: lessonId,
    },
  });

  if (!upload?.id || !upload?.url) {
    throw new Error("Mux upload create failed: missing id or url");
  }

  await prisma.videoUpload.create({
    data: {
      lessonId,
      muxUploadId: upload.id,
      passthrough: lessonId,
      status: "CREATED",
    },
  });

  return {
    uploadId: upload.id,
    url: upload.url,
  };
}

/**
 * Fetch asset by ID and return the first playback ID (for HLS).
 */
export async function getPlaybackIdForAsset(assetId: string): Promise<string | null> {
  const mux = getMux();
  const asset = await mux.video.assets.retrieve(assetId);
  const playbackIds = asset?.playback_ids;
  if (!playbackIds?.length) return null;
  return playbackIds[0].id ?? null;
}

/**
 * Create LessonVideo when we have asset id and playback id (e.g. from webhook).
 */
export async function linkVideoToLesson(
  lessonId: string,
  muxAssetId: string,
  muxPlaybackId: string
): Promise<void> {
  await prisma.lessonVideo.upsert({
    where: { lessonId },
    create: { lessonId, muxAssetId, muxPlaybackId },
    update: { muxAssetId, muxPlaybackId },
  });
}

/**
 * Mark the VideoUpload for this lesson as READY and set assetId (from webhook).
 */
export async function markVideoUploadReady(
  lessonId: string,
  assetId: string
): Promise<void> {
  await prisma.videoUpload.updateMany({
    where: { lessonId, status: "CREATED" },
    data: { assetId, status: "READY" },
  });
}

/**
 * Sync video for a lesson from Mux (for when webhook is not reachable, e.g. localhost).
 * Finds the latest upload for the lesson, checks Mux upload status; when asset is ready,
 * links LessonVideo and returns { linked: true }.
 */
export async function syncLessonVideoFromMux(lessonId: string): Promise<{
  linked: boolean;
  status: string;
  playbackId?: string;
}> {
  const mux = getMux();

  const videoUpload = await prisma.videoUpload.findFirst({
    where: { lessonId, muxUploadId: { not: { startsWith: "PENDING_" } } },
    orderBy: { createdAt: "desc" },
  });
  if (!videoUpload) {
    return { linked: false, status: "no_upload" };
  }

  const upload = await mux.video.uploads.retrieve(videoUpload.muxUploadId);
  const raw = upload as { status?: string; asset_id?: string; assetId?: string };
  const status = raw?.status ?? "unknown";
  const assetId = raw?.asset_id ?? raw?.assetId ?? null;

  if (!assetId || (status !== "asset_created" && status !== "ready")) {
    return { linked: false, status: status === "waiting" ? "processing" : status };
  }

  const playbackId = await getPlaybackIdForAsset(assetId);
  if (!playbackId) {
    return { linked: false, status: "asset_not_ready" };
  }

  await linkVideoToLesson(lessonId, assetId, playbackId);
  await prisma.videoUpload.updateMany({
    where: { id: videoUpload.id },
    data: { assetId, status: "READY" },
  });

  return { linked: true, status: "ready", playbackId };
}
