"use server";

import { auth } from "@/auth";
import { markLessonComplete } from "@/server/progress/course-progress.service";
import { getCourseProgress } from "@/server/learning/progress.service";

export async function completeLessonAndGetProgress(
  lessonId: string,
  courseId: string
): Promise<{ progressPercent: number; completedCount: number; totalCount: number } | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  await markLessonComplete(userId, lessonId);
  const progress = await getCourseProgress(userId, courseId);
  if (!progress) return null;

  return {
    progressPercent: progress.progressPercent,
    completedCount: progress.completedCount,
    totalCount: progress.totalCount,
  };
}
