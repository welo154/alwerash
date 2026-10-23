/**
 * Playback authorization adapter.
 *
 * The access rules now live in `@/server/authz/lesson-access` so playback,
 * progress, and assignment paths share one decision point. This module stays
 * as the playback-facing entry point.
 */
import { AppError } from "@/server/lib/errors";
import {
  authorizeLessonAccess,
  isFirstModuleFreePreview,
  type LessonAccessViewer,
} from "@/server/authz/lesson-access";

export type PlaybackViewer = LessonAccessViewer;

export { isFirstModuleFreePreview };

/**
 * Throws AppError 401/403/404. Does not redirect.
 * Guarantees a non-null `muxPlaybackId` on success.
 */
export async function assertCanAccessLessonPlayback(
  lessonId: string,
  viewer: PlaybackViewer
): Promise<{
  lessonId: string;
  title: string;
  muxPlaybackId: string;
  isFreePreview: boolean;
}> {
  const grant = await authorizeLessonAccess({
    lessonId,
    action: "PLAY_VIDEO",
    viewer,
  });

  if (!grant.muxPlaybackId) {
    // authorizeLessonAccess already rejects PLAY_VIDEO without a playback ID;
    // this keeps the non-null contract explicit for callers.
    throw new AppError("NOT_FOUND", 404, "Video not ready");
  }

  return {
    lessonId: grant.lessonId,
    title: grant.title,
    muxPlaybackId: grant.muxPlaybackId,
    isFreePreview: grant.isFreePreview,
  };
}
