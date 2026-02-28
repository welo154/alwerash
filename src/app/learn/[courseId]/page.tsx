import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { getCourseForLearning, isCourseUnlockedForUser } from "@/server/content/learn.service";
import { AppError } from "@/server/lib/errors";
import {
  getOrderedLessonIds,
  getCompletedLessonIdsForCourse,
} from "@/server/progress/course-progress.service";
import { CourseCurriculum } from "./CourseCurriculum";
import { CourseProgressBar } from "@/components/learning/CourseProgressBar";

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await requireSubscription();
  const userId = session.user.id;
  const { courseId } = await params;

  let course;
  try {
    course = await getCourseForLearning(courseId);
  } catch (e) {
    if (e instanceof AppError && e.status === 404) notFound();
    throw e;
  }

  const courseUnlocked = await isCourseUnlockedForUser(userId, courseId);
  if (!courseUnlocked) {
    redirect("/learn?message=complete_previous_course");
  }

  const modules = course.modules ?? [];
  const orderedLessonIds = getOrderedLessonIds(course);
  const completedLessonIds = await getCompletedLessonIdsForCourse(
    userId,
    orderedLessonIds
  );
  // All lessons are enterable (no sequential lock); progress tracking still applies.
  const unlockedLessonIds = orderedLessonIds;

  const lessonCount = modules.reduce(
    (acc, m) => acc + (m.lessons?.length ?? 0),
    0
  );
  const completedCount = completedLessonIds.size;
  const progressPercent =
    lessonCount > 0 ? (completedCount / lessonCount) * 100 : 0;

  const ESTIMATED_MINUTES: Record<string, number> = { VIDEO: 10, ARTICLE: 5, RESOURCE: 5 };
  const totalMinutes = modules.reduce(
    (total, m) =>
      total +
      (m.lessons ?? []).reduce((sum, l) => sum + (ESTIMATED_MINUTES[l.type] ?? 5), 0),
    0
  );
  const durationLabel =
    totalMinutes < 60
      ? `~${totalMinutes} min`
      : `~${Math.floor(totalMinutes / 60)}h${totalMinutes % 60 ? ` ${totalMinutes % 60}m` : ""}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <nav className="flex flex-wrap gap-2 text-sm text-slate-600">
            <Link href="/learn" className="hover:text-indigo-600 transition-colors">
              My courses
            </Link>
            <span aria-hidden>/</span>
            <span className="text-slate-900 font-medium">{course.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Course hero */}
        <header className="mb-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {course.track && (
              <Link
                href={`/tracks/${course.track.slug}`}
                className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 hover:bg-indigo-200 transition-colors mb-4"
              >
                {course.track.title} Track
              </Link>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {course.title}
            </h1>
            {course.summary && (
              <p className="mt-3 text-slate-600 leading-relaxed max-w-2xl">
                {course.summary}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {modules.length} module{modules.length !== 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {durationLabel} total
              </span>
            </div>
            {lessonCount > 0 && (
              <div className="mt-6">
                <CourseProgressBar
                  progressPercent={progressPercent}
                  completedCount={completedCount}
                  totalCount={lessonCount}
                  label="Course progress"
                />
              </div>
            )}
          </div>
        </header>

        {/* Curriculum with accordion modules */}
        <section aria-labelledby="curriculum-heading">
          <h2 id="curriculum-heading" className="sr-only">
            Course curriculum
          </h2>
          <p className="text-sm font-medium text-slate-700 mb-4">
            Expand a module to see lessons and start watching.
          </p>
          <CourseCurriculum
            courseId={courseId}
            modules={modules}
            unlockedLessonIds={Array.from(unlockedLessonIds)}
            completedLessonIds={Array.from(completedLessonIds)}
          />
        </section>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My courses
          </Link>
        </div>
      </div>
    </div>
  );
}
