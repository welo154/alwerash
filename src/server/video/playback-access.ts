import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { hasActiveSubscription } from "@/server/subscription/access.service";

export type PlaybackViewer = {
  userId: string | null;
  email?: string | null;
  roles: string[];
};

/**
 * First published module (same ordering as getFreeLessonIds): all of its
 * published lessons are intentional free previews.
 */
export function isFirstModuleFreePreview(params: {
  lessonPublished: boolean;
  coursePublished: boolean;
  trackPublished: boolean;
  lessonModuleId: string;
  firstModuleId: string | undefined;
}): boolean {
  return (
    params.lessonPublished &&
    params.coursePublished &&
    params.trackPublished &&
    Boolean(params.firstModuleId) &&
    params.lessonModuleId === params.firstModuleId
  );
}

/**
 * Throws AppError 401/403/404. Does not redirect.
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
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      published: true,
      video: { select: { muxPlaybackId: true } },
      module: {
        select: {
          id: true,
          course: {
            select: {
              published: true,
              track: { select: { published: true } },
              modules: {
                orderBy: [{ order: "asc" }, { createdAt: "asc" }],
                take: 1,
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  if (!lesson) throw new AppError("NOT_FOUND", 404, "Lesson not found");
  if (!lesson.video?.muxPlaybackId) {
    throw new AppError("NOT_FOUND", 404, "Video not ready");
  }

  const roles = viewer.roles ?? [];
  const isAdmin = roles.includes("ADMIN");
  const isInstructor = roles.includes("INSTRUCTOR");
  const isPrivileged = isAdmin || isInstructor;

  const coursePublished = lesson.module.course.published;
  const trackPublished = lesson.module.course.track?.published ?? true;
  const firstModuleId = lesson.module.course.modules[0]?.id;
  const isFreePreview = isFirstModuleFreePreview({
    lessonPublished: lesson.published,
    coursePublished,
    trackPublished,
    lessonModuleId: lesson.module.id,
    firstModuleId,
  });

  if (!lesson.published && !isPrivileged) {
    throw new AppError("FORBIDDEN", 403, "Forbidden");
  }
  if ((!coursePublished || !trackPublished) && !isPrivileged) {
    throw new AppError("FORBIDDEN", 403, "Forbidden");
  }

  if (isFreePreview || isPrivileged) {
    return {
      lessonId: lesson.id,
      title: lesson.title,
      muxPlaybackId: lesson.video.muxPlaybackId,
      isFreePreview,
    };
  }

  if (!viewer.userId) {
    throw new AppError("UNAUTHORIZED", 401, "Unauthorized");
  }

  const hasAccess = await hasActiveSubscription(viewer.userId);
  if (!hasAccess) {
    throw new AppError("FORBIDDEN", 403, "Subscription required");
  }

  return {
    lessonId: lesson.id,
    title: lesson.title,
    muxPlaybackId: lesson.video.muxPlaybackId,
    isFreePreview: false,
  };
}
