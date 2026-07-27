export type CourseModuleForAccess = {
  id: string;
  title: string;
  lessons: { id: string; title: string; type: string }[];
};

/** First curriculum section (module) — fully free for trial on the public course page. */
export function getFreeTrialModule<T extends { title: string }>(modules: T[]): T | undefined {
  return modules[0];
}

/** All lessons in the first section are free; section 2+ stay locked. */
export function getFreeLessonIds(modules: CourseModuleForAccess[]): string[] {
  const firstSection = getFreeTrialModule(modules);
  if (!firstSection) return [];
  return firstSection.lessons.map((lesson) => lesson.id);
}

export function isFreeLesson(lessonId: string, modules: CourseModuleForAccess[]): boolean {
  return getFreeLessonIds(modules).includes(lessonId);
}

export type CourseViewerAccess = {
  isLoggedIn: boolean;
  hasSubscription: boolean;
};

/** Public marketing course page — curriculum + free intro only. */
export function publicCoursePath(courseId: string): string {
  return `/course/${encodeURIComponent(courseId)}`;
}

/** Private full-course experience — subscribed users only. */
export function privateCoursePath(courseId: string): string {
  return `/course-access/${encodeURIComponent(courseId)}`;
}

/** Free intro lesson stays on the public course page — never a nested route. */
export function publicPreviewLessonPath(courseId: string, _lessonId?: string): string {
  return publicCoursePath(courseId);
}

/**
 * Where to send a user who clicks a locked lesson.
 * - Not logged in → login, then private course page
 * - Logged in, no sub → subscription page, then private course page
 * - Subscribed → private course page
 */
export function getLockedLessonRedirect(
  courseId: string,
  access: CourseViewerAccess,
  _lessonId?: string
): string {
  const destination = privateCoursePath(courseId);

  if (!access.isLoggedIn) {
    return `/login?next=${encodeURIComponent(destination)}`;
  }
  if (!access.hasSubscription) {
    return `/subscription?message=subscribe&next=${encodeURIComponent(destination)}`;
  }
  return destination;
}
