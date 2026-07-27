import { privateCoursePath } from "@/lib/course-access";

/** Whether a published lesson can be opened in the course player. */
export function isLessonLearnable(lesson: {
  type: string;
  video?: { muxPlaybackId: string } | null;
}): boolean {
  if (lesson.type === "VIDEO") {
    return Boolean(lesson.video?.muxPlaybackId);
  }
  if (lesson.type === "ARTICLE" || lesson.type === "RESOURCE") {
    return true;
  }
  return false;
}

/** Href into the private full-course page (optionally anchored to a lesson). */
export function lessonLearnHref(
  courseId: string,
  lesson: { id: string; type: string; video?: { muxPlaybackId: string } | null }
): string | undefined {
  if (!isLessonLearnable(lesson)) return undefined;
  return `${privateCoursePath(courseId)}#${encodeURIComponent(lesson.id)}`;
}
