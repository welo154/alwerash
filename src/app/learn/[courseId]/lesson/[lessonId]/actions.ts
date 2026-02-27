"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { markLessonComplete } from "@/server/progress/course-progress.service";

export async function completeLesson(lessonId: string, courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?next=" + encodeURIComponent(`/learn/${courseId}/lesson/${lessonId}`));
  }
  await markLessonComplete(session.user.id, lessonId);
  redirect(`/learn/${courseId}`);
}
