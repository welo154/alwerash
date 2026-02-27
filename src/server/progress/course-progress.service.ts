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
 * Get set of lesson IDs the user has completed (completedAt != null) for lessons in this course.
 */
export async function getCompletedLessonIdsForCourse(
  userId: string,
  orderedLessonIds: string[]
): Promise<Set<string>> {
  return getCompletedLessonIds(userId, orderedLessonIds);
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
 * Module is unlocked when the previous module's last lesson is completed (or it's the first module).
 */
export function isModuleUnlocked(
  orderedLessonIds: string[],
  completedLessonIds: Set<string>,
  moduleLessonIds: string[]
): boolean {
  if (moduleLessonIds.length === 0) return true;
  const firstInModule = moduleLessonIds[0]!;
  const index = orderedLessonIds.indexOf(firstInModule);
  if (index <= 0) return true;
  const previousId = orderedLessonIds[index - 1]!;
  return completedLessonIds.has(previousId);
}

/**
 * Lesson is unlocked if it's the first in course order, or the previous lesson is completed.
 */
export function isLessonUnlocked(
  orderedLessonIds: string[],
  completedLessonIds: Set<string>,
  lessonId: string
): { unlocked: boolean; previousLessonId: string | null } {
  const index = orderedLessonIds.indexOf(lessonId);
  if (index < 0) return { unlocked: false, previousLessonId: null };
  if (index === 0) return { unlocked: true, previousLessonId: null };
  const previousId = orderedLessonIds[index - 1] ?? null;
  const unlocked = previousId !== null && completedLessonIds.has(previousId);
  return { unlocked, previousLessonId: previousId };
}

/**
 * Build a Set of lesson IDs that are unlocked for this user (for course page UI).
 */
export function getUnlockedLessonIds(
  orderedLessonIds: string[],
  completedLessonIds: Set<string>
): Set<string> {
  const unlocked = new Set<string>();
  for (let i = 0; i < orderedLessonIds.length; i++) {
    const lessonId = orderedLessonIds[i]!;
    if (i === 0) {
      unlocked.add(lessonId);
    } else {
      const prevId = orderedLessonIds[i - 1]!;
      if (completedLessonIds.has(prevId)) unlocked.add(lessonId);
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
