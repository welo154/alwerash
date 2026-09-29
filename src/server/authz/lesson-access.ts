/**
 * Central server-side authorization for lesson resources.
 *
 * Every protected lesson path (playback tokens, progress writes, assignment and
 * attachment reads) must resolve access through `authorizeLessonAccess` so the
 * rules live in exactly one place.
 *
 * Trust rules:
 * - Identity comes from the server session only. Never from the request body.
 * - The lesson's parent course is loaded from the database, never from the client.
 * - Instructors are scoped to courses they are assigned to via CourseInstructor.
 * - Failure denies access; there is no fallback to public content.
 */
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { hasActiveSubscription } from "@/server/subscription/access.service";

export type LessonAction =
  /** Read lesson shell data (title, type, ordering). */
  | "VIEW_METADATA"
  /** Read paid body content: article text, attachments, assignment data. */
  | "VIEW_CONTENT"
  /** Mint a signed video playback token. */
  | "PLAY_VIDEO"
  /** Persist progress for this lesson. */
  | "WRITE_PROGRESS";

export type LessonAccessReason =
  | "FREE_PREVIEW"
  | "ADMIN"
  | "COURSE_INSTRUCTOR"
  | "SUBSCRIPTION";

export type LessonAccessViewer = {
  userId: string | null;
  email?: string | null;
  roles: string[];
};

export type LessonAccessGrant = {
  lessonId: string;
  courseId: string;
  title: string;
  /** Present only when the lesson has a ready video. */
  muxPlaybackId: string | null;
  isFreePreview: boolean;
  reason: LessonAccessReason;
};

/**
 * First published module (lowest `order`, `createdAt` as tiebreaker) is the
 * intentional free preview. Kept as a named helper so catalog code and
 * authorization cannot drift apart.
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
 * Resolve whether `viewer` may perform `action` on `lessonId`.
 * Throws AppError 401/403/404. Never redirects, so it is safe in API routes.
 */
export async function authorizeLessonAccess(params: {
  lessonId: string;
  action: LessonAction;
  viewer: LessonAccessViewer;
}): Promise<LessonAccessGrant> {
  const { lessonId, action, viewer } = params;
  const viewerUserId = viewer.userId;

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
              id: true,
              published: true,
              track: { select: { published: true } },
              modules: {
                orderBy: [{ order: "asc" }, { createdAt: "asc" }],
                take: 1,
                select: { id: true },
              },
              // Scoped instructor assignment: empty when the viewer is a guest.
              instructors: {
                where: { instructorId: viewerUserId ?? "" },
                take: 1,
                select: { instructorId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!lesson) throw new AppError("NOT_FOUND", 404, "Lesson not found");

  const course = lesson.module.course;
  const roles = viewer.roles ?? [];
  const isAdmin = roles.includes("ADMIN");
  const isAssignedInstructor =
    Boolean(viewerUserId) &&
    roles.includes("INSTRUCTOR") &&
    course.instructors.length > 0;
  const isPrivileged = isAdmin || isAssignedInstructor;

  const coursePublished = course.published;
  const trackPublished = course.track?.published ?? true;
  const isFreePreview = isFirstModuleFreePreview({
    lessonPublished: lesson.published,
    coursePublished,
    trackPublished,
    lessonModuleId: lesson.module.id,
    firstModuleId: course.modules[0]?.id,
  });

  // Unpublished content is visible only to admins and the course's own instructors.
  if (!lesson.published && !isPrivileged) {
    throw new AppError("FORBIDDEN", 403, "Forbidden");
  }
  if ((!coursePublished || !trackPublished) && !isPrivileged) {
    throw new AppError("FORBIDDEN", 403, "Forbidden");
  }

  const grant = (reason: LessonAccessReason): LessonAccessGrant => {
    if (action === "PLAY_VIDEO" && !lesson.video?.muxPlaybackId) {
      throw new AppError("NOT_FOUND", 404, "Video not ready");
    }
    return {
      lessonId: lesson.id,
      courseId: course.id,
      title: lesson.title,
      muxPlaybackId: lesson.video?.muxPlaybackId ?? null,
      isFreePreview,
      reason,
    };
  };

  if (isAdmin) return grant("ADMIN");
  if (isAssignedInstructor) return grant("COURSE_INSTRUCTOR");
  if (isFreePreview) return grant("FREE_PREVIEW");

  if (!viewerUserId) {
    throw new AppError("UNAUTHORIZED", 401, "Unauthorized");
  }

  // Entitlement is read fresh from the database on every decision so revoked
  // and expired access takes effect immediately.
  const hasAccess = await hasActiveSubscription(viewerUserId);
  if (!hasAccess) {
    throw new AppError("FORBIDDEN", 403, "Subscription required");
  }

  return grant("SUBSCRIPTION");
}
