import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { getCourseForLearning } from "@/server/content/learn.service";
import { AppError } from "@/server/lib/errors";

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  await requireSubscription();
  const { courseId } = await params;

  let course;
  try {
    course = await getCourseForLearning(courseId);
  } catch (e) {
    if (e instanceof AppError && e.status === 404) notFound();
    throw e;
  }

  const lessonCount = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <nav className="flex flex-wrap gap-2 text-sm text-slate-600">
            <Link href="/learn" className="hover:text-blue-600">
              My courses
            </Link>
            <span>/</span>
            <span className="text-slate-900">{course.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
        {course.track && (
          <p className="mt-1 text-slate-600">{course.track.title} Track</p>
        )}
        <p className="mt-2 text-sm text-slate-500">
          {course.modules.length} modules · {lessonCount} lessons
        </p>

        {/* Curriculum: list of lessons — click to open lesson page with video */}
        <div className="mt-8 space-y-6">
          {course.modules.map((module, mIndex) => (
            <section key={module.id}>
              <h2 className="text-lg font-semibold text-slate-900">
                {mIndex + 1}. {module.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {module.lessons.map((lesson, lIndex) => {
                  const hasVideo = lesson.type === "VIDEO" && lesson.video?.muxPlaybackId;
                  const href = hasVideo
                    ? `/learn/${courseId}/lesson/${lesson.id}`
                    : undefined;
                  return (
                    <li key={lesson.id}>
                      {href ? (
                        <Link
                          href={href}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-blue-300 hover:bg-slate-50"
                        >
                          <span className="font-medium text-slate-900">
                            {mIndex + 1}.{lIndex + 1} {lesson.title}
                          </span>
                          <span className="text-xs text-slate-500">
                            {lesson.type === "VIDEO" ? "Video" : lesson.type}
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                          <span>
                            {mIndex + 1}.{lIndex + 1} {lesson.title}
                          </span>
                          <span className="text-xs">
                            {lesson.type === "VIDEO"
                              ? "Video not ready"
                              : lesson.type}
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/learn"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Back to My courses
          </Link>
        </div>
      </div>
    </div>
  );
}
