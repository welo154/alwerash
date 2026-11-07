/**
 * Week 4: Progress tracking – sequential gating.
 * You cannot access lesson N until lesson N-1 is completed (course order).
 * Module 2 is effectively locked until all lessons in module 1 are completed.
 */
import { prisma } from "@/server/db/prisma";

export type CourseWithOrderedLessons = {
  id: string;
  modules: Array<{
    id: string;
    title: string;
    order: number;
    lessons: Array<{ id: string; title: string; type: string; order: number }>;
  }>;
};

/**
 * Returns lesson IDs in course order: module 1 lessons, then module 2, etc.
 */
export function getOrderedLessonIds(course: CourseWithOrderedLessons): string[] {
  const ids: string[] = [];
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      ids.push(lesson.id);
    }
  }
  return ids;
}

/**
 * Get set of lesson IDs the user has completed (completedAt != null) from a given list.
 */
export async function getCompletedLessonIds(
  userId: string,
  lessonIds: string[]
): Promise<Set<string>> {
  if (lessonIds.length === 0) return new Set();
  const rows = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: lessonIds },
      completedAt: { not: null },
    },
    select: { lessonId: true },
  });
  return new Set(rows.map((r) => r.lessonId));
}

/**
 * Course is completed when all its lessons (in order) are completed.
 */
export function isCourseCompleted(
  orderedLessonIds: string[],
  completedLessonIds: Set<string>
): boolean {
  if (orderedLessonIds.length === 0) return true;
  return orderedLessonIds.every((id) => completedLessonIds.has(id));
}

/**
 * Given courses in track order and a set of completed course IDs,
 * return the set of course IDs that are unlocked (first in track, or previous course completed).
 */
export function getUnlockedCourseIdsInTrack(
  orderedCourseIds: string[],
  completedCourseIds: Set<string>
): Set<string> {
  const unlocked = new Set<string>();
  for (let i = 0; i < orderedCourseIds.length; i++) {
    const courseId = orderedCourseIds[i]!;
    if (i === 0) {
      unlocked.add(courseId);
    } else {
      const prevId = orderedCourseIds[i - 1]!;
      if (completedCourseIds.has(prevId)) unlocked.add(courseId);
    }
  }
  return unlocked;
}

/**
 * Mark a lesson as completed for the user (sets completedAt).
 * Used by "Mark as complete" button; full progress (e.g. video %) can be added later.
 */
export async function markLessonComplete(userId: string, lessonId: string): Promise<void> {
  const now = new Date();
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    create: {
      userId,
      lessonId,
      completedAt: now,
    },
    update: {
      completedAt: now,
      updatedAt: now,
    },
  });
}
