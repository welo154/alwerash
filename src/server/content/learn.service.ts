/**
 * Content for subscribed users: course list and course with lessons/videos for learning.
 */
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import {
  getCompletedLessonIds,
  isCourseCompleted,
  getUnlockedCourseIdsInTrack,
} from "@/server/progress/course-progress.service";

export async function listCoursesForLearning() {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      summary: true,
      coverImage: true,
      track: { select: { title: true, slug: true } },
    },
  });
}

export type CourseForLearningWithProgress = {
  id: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  track: { title: string; slug: string } | null;
  trackId: string | null;
  order: number;
  unlocked: boolean;
  completed: boolean;
};

/**
 * List published courses in track order with unlock and completion state for the user.
 * Course 2 in a track is unlocked only when course 1 is completed; same for lessons/modules.
 */
export async function listCoursesForLearningWithProgress(
  userId: string
): Promise<CourseForLearningWithProgress[]> {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: [
      { track: { order: "asc" } },
      { order: "asc" },
      { createdAt: "asc" },
    ],
    select: {
      id: true,
      title: true,
      summary: true,
      coverImage: true,
      order: true,
      trackId: true,
      track: { select: { title: true, slug: true } },
      modules: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          order: true,
          lessons: {
            where: { published: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
            select: { id: true },
          },
        },
      },
    },
  });

  if (courses.length === 0) return [];

  const allLessonIds = new Set<string>();
  const courseToOrderedLessonIds = new Map<string, string[]>();
  for (const c of courses) {
    const ordered: string[] = [];
    for (const m of c.modules) {
      for (const l of m.lessons) {
        ordered.push(l.id);
        allLessonIds.add(l.id);
      }
    }
    courseToOrderedLessonIds.set(c.id, ordered);
  }

  const completedLessonIds = await getCompletedLessonIds(
    userId,
    Array.from(allLessonIds)
  );

  const completedCourseIds = new Set<string>();
  for (const c of courses) {
    const ordered = courseToOrderedLessonIds.get(c.id) ?? [];
    if (isCourseCompleted(ordered, completedLessonIds)) {
      completedCourseIds.add(c.id);
    }
  }

  // Group by track (trackId; null = no track)
  const trackToOrderedCourseIds = new Map<string | null, string[]>();
  for (const c of courses) {
    const key = c.trackId ?? null;
    if (!trackToOrderedCourseIds.has(key)) {
      trackToOrderedCourseIds.set(key, []);
    }
    trackToOrderedCourseIds.get(key)!.push(c.id);
  }

  const unlockedCourseIds = new Set<string>();
  for (const [, orderedCourseIds] of trackToOrderedCourseIds) {
    const unlocked = getUnlockedCourseIdsInTrack(
      orderedCourseIds,
      completedCourseIds
    );
    for (const id of unlocked) unlockedCourseIds.add(id);
  }

  return courses.map((c) => ({
    id: c.id,
    title: c.title,
    summary: c.summary,
    coverImage: c.coverImage,
    track: c.track,
    trackId: c.trackId,
    order: c.order,
    unlocked: unlockedCourseIds.has(c.id),
    completed: completedCourseIds.has(c.id),
  }));
}

/**
 * Check if a course is unlocked for the user (first in track or previous course in track completed).
 */
export async function isCourseUnlockedForUser(
  userId: string,
  courseId: string
): Promise<boolean> {
  const course = await prisma.course.findUnique({
    where: { id: courseId, published: true },
    select: {
      id: true,
      trackId: true,
      order: true,
      modules: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          lessons: {
            where: { published: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
            select: { id: true },
          },
        },
      },
    },
  });
  if (!course) return false;
  if (!course.trackId) return true; // No track = always unlocked

  const coursesInTrack = await prisma.course.findMany({
    where: { trackId: course.trackId, published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      modules: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          lessons: {
            where: { published: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
            select: { id: true },
          },
        },
      },
    },
  });

  const allLessonIds: string[] = [];
  const orderedCourseIds = coursesInTrack.map((c) => c.id);
  for (const c of coursesInTrack) {
    for (const m of c.modules) {
      for (const l of m.lessons) {
        allLessonIds.push(l.id);
      }
    }
  }
  const completedLessonIds = await getCompletedLessonIds(userId, allLessonIds);

  const completedCourseIds = new Set<string>();
  for (const c of coursesInTrack) {
    const ordered: string[] = [];
    for (const m of c.modules) {
      for (const l of m.lessons) ordered.push(l.id);
    }
    if (isCourseCompleted(ordered, completedLessonIds)) {
      completedCourseIds.add(c.id);
    }
  }

  const unlocked = getUnlockedCourseIdsInTrack(
    orderedCourseIds,
    completedCourseIds
  );
  return unlocked.has(courseId);
}

/**
 * Get course with modules and lessons including video playback IDs for the learning page.
 */
export async function getCourseForLearning(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      summary: true,
      coverImage: true,
      published: true,
      track: { select: { published: true, slug: true, title: true } },
      modules: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          order: true,
          lessons: {
            where: { published: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
            select: {
              id: true,
              title: true,
              type: true,
              order: true,
              video: {
                select: { muxPlaybackId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!course || !course.published) throw new AppError("NOT_FOUND", 404, "Course not found");
  if (course.track && !course.track.published) throw new AppError("NOT_FOUND", 404, "Course not found");

  // Normalize for client: ensure arrays and serializable types (enum -> string)
  const modules = (course.modules ?? []).map((m) => ({
    id: m.id,
    title: m.title,
    order: m.order,
    lessons: (m.lessons ?? []).map((l) => ({
      id: l.id,
      title: l.title,
      type: String(l.type),
      order: l.order,
      video: l.video ? { muxPlaybackId: l.video.muxPlaybackId } : null,
    })),
  }));

  return {
    id: course.id,
    title: course.title,
    summary: course.summary,
    coverImage: course.coverImage,
    published: course.published,
    track: course.track,
    modules,
  };
}

/**
 * Get a single lesson for the learn flow. Verifies lesson belongs to course and is published.
 */
export async function getLessonForLearning(lessonId: string, courseId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId, published: true },
    select: {
      id: true,
      title: true,
      type: true,
      order: true,
      moduleId: true,
      video: { select: { muxPlaybackId: true } },
      module: {
        select: {
          id: true,
          title: true,
          order: true,
          courseId: true,
          course: {
            select: {
              id: true,
              title: true,
              published: true,
              track: { select: { published: true } },
            },
          },
        },
      },
    },
  });

  if (!lesson || lesson.module.courseId !== courseId) throw new AppError("NOT_FOUND", 404, "Lesson not found");
  if (!lesson.module.course.published) throw new AppError("NOT_FOUND", 404, "Course not found");
  if (lesson.module.course.track && !lesson.module.course.track.published) throw new AppError("NOT_FOUND", 404, "Course not found");

  return lesson;
}
