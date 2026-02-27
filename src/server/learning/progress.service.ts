/**
 * Week 4 — Progress tracking: save position, compute completion (90% or last 30s), course %.
 */
import { prisma } from "@/server/db/prisma";

const COMPLETION_THRESHOLD_PERCENT = 0.9;
const COMPLETION_LAST_SECONDS = 30;

function shouldMarkCompleted(
  positionSeconds: number,
  durationSeconds: number
): boolean {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return false;
  const p = Math.max(0, positionSeconds);
  const d = durationSeconds;
  return p >= d * COMPLETION_THRESHOLD_PERCENT || p >= Math.max(0, d - COMPLETION_LAST_SECONDS);
}

export type LessonProgressRecord = {
  lessonId: string;
  lastPositionSeconds: number;
  completedAt: Date | null;
};

/**
 * Get progress for a single lesson (for resume and UI).
 */
export async function getLessonProgress(
  userId: string,
  lessonId: string
): Promise<LessonProgressRecord | null> {
  const row = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
    select: {
      lessonId: true,
      lastPositionSeconds: true,
      completedAt: true,
    },
  });
  if (!row) return null;
  return {
    lessonId: row.lessonId,
    lastPositionSeconds: row.lastPositionSeconds,
    completedAt: row.completedAt,
  };
}

/**
 * Save position and optionally mark completed when threshold is met (90% or last 30s).
 */
export async function saveLessonProgress(
  userId: string,
  lessonId: string,
  positionSeconds: number,
  durationSeconds?: number
): Promise<LessonProgressRecord> {
  const now = new Date();
  const completed =
    durationSeconds !== undefined &&
    shouldMarkCompleted(positionSeconds, durationSeconds);

  const updated = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: {
      userId,
      lessonId,
      lastPositionSeconds: Math.round(Math.max(0, positionSeconds)),
      completedAt: completed ? now : null,
    },
    update: {
      lastPositionSeconds: Math.round(Math.max(0, positionSeconds)),
      ...(completed ? { completedAt: now, updatedAt: now } : {}),
    },
    select: {
      lessonId: true,
      lastPositionSeconds: true,
      completedAt: true,
    },
  });

  return {
    lessonId: updated.lessonId,
    lastPositionSeconds: updated.lastPositionSeconds,
    completedAt: updated.completedAt,
  };
}

export type ModuleProgressRecord = {
  moduleId: string;
  title: string;
  completedCount: number;
  totalCount: number;
  percent: number;
};

export type CourseProgressRecord = {
  courseId: string;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  modules: ModuleProgressRecord[];
};

/**
 * Get course progress: completed lessons / total published lessons, and per-module breakdown.
 */
export async function getCourseProgress(
  userId: string,
  courseId: string
): Promise<CourseProgressRecord | null> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      modules: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          lessons: {
            where: { published: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
            select: { id: true },
          },
        },
      },
    },
  });
  if (!course) return null;

  const allLessonIds: string[] = [];
  const moduleLessonIds = course.modules.map((m) => {
    const ids = m.lessons.map((l) => l.id);
    allLessonIds.push(...ids);
    return { moduleId: m.id, title: m.title, lessonIds: ids };
  });

  if (allLessonIds.length === 0) {
    return {
      courseId: course.id,
      completedCount: 0,
      totalCount: 0,
      progressPercent: 100,
      modules: course.modules.map((m) => ({
        moduleId: m.id,
        title: m.title,
        completedCount: 0,
        totalCount: 0,
        percent: 100,
      })),
    };
  }

  const completedRows = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      completedAt: { not: null },
    },
    select: { lessonId: true },
  });
  const completedSet = new Set(completedRows.map((r) => r.lessonId));

  const modules: ModuleProgressRecord[] = moduleLessonIds.map(
    ({ moduleId, title, lessonIds }) => {
      const totalCount = lessonIds.length;
      const completedCount = lessonIds.filter((id) => completedSet.has(id)).length;
      const percent = totalCount === 0 ? 100 : (completedCount / totalCount) * 100;
      return {
        moduleId,
        title,
        completedCount,
        totalCount,
        percent: Math.round(percent * 100) / 100,
      };
    }
  );

  const totalCount = allLessonIds.length;
  const completedCount = completedSet.size;
  const progressPercent =
    totalCount === 0 ? 100 : (completedCount / totalCount) * 100;

  return {
    courseId: course.id,
    completedCount,
    totalCount,
    progressPercent: Math.round(progressPercent * 100) / 100,
    modules,
  };
}
