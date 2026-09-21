"use server";

import { auth } from "@/auth";
import { authorizeLessonAccess } from "@/server/authz/lesson-access";
import { markLessonComplete } from "@/server/progress/course-progress.service";
import { getCourseProgress } from "@/server/learning/progress.service";

export async function completeLessonAndGetProgress(
  lessonId: string,
  courseId: string
): Promise<{ progressPercent: number; completedCount: number; totalCount: number } | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  // Server actions are publicly callable POST endpoints, so the entitlement
  // check has to happen here and not only on the page that renders the button.
  try {
    await authorizeLessonAccess({
      lessonId,
      action: "WRITE_PROGRESS",
      viewer: {
        userId,
        email: session.user.email ?? null,
        roles: session.user.roles ?? [],
      },
    });
  } catch {
    return null;
  }

  await markLessonComplete(userId, lessonId);
  const progress = await getCourseProgress(userId, courseId);
  if (!progress) return null;

  return {
    progressPercent: progress.progressPercent,
    completedCount: progress.completedCount,
    totalCount: progress.totalCount,
  };
}
