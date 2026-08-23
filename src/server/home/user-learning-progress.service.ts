/**
 * Aggregate learning progress for home / profile activity cards:
 * completed published lessons ÷ total published lessons across courses the user has started.
 */
import { prisma } from "@/server/db/prisma";
import { getCourseProgress } from "@/server/learning/progress.service";

export async function getUserAggregateLearningProgressPercent(
  userId: string
): Promise<number> {
  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId },
    select: {
      lesson: {
        select: {
          module: {
            select: {
              course: { select: { id: true, published: true } },
            },
          },
        },
      },
    },
  });

  const courseIds = new Set<string>();
  for (const row of progressRows) {
    const course = row.lesson.module.course;
    if (course.published) courseIds.add(course.id);
  }

  if (courseIds.size === 0) return 0;

  const summaries = await Promise.all(
    [...courseIds].map((courseId) => getCourseProgress(userId, courseId))
  );

  let completedCount = 0;
  let totalCount = 0;
  for (const summary of summaries) {
    if (!summary || summary.totalCount === 0) continue;
    completedCount += summary.completedCount;
    totalCount += summary.totalCount;
  }

  if (totalCount === 0) return 0;
  return Math.min(100, Math.round((completedCount / totalCount) * 100));
}
