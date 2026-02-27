import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { getLessonForLearning, getCourseForLearning } from "@/server/content/learn.service";
import { AppError } from "@/server/lib/errors";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { CourseCurriculumSidebar } from "../../CourseCurriculumSidebar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  try {
    const lesson = await getLessonForLearning(lessonId, courseId);
    return { title: lesson.title };
  } catch {
    return { title: "Lesson" };
  }
}

export default async function LearnLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  await requireSubscription();
  const { courseId, lessonId } = await params;

  let lesson;
  let course;
  try {
    [lesson, course] = await Promise.all([
      getLessonForLearning(lessonId, courseId),
      getCourseForLearning(courseId),
    ]);
  } catch (e) {
    if (e instanceof AppError && e.status === 404) notFound();
    throw e;
  }

  const courseTitle = lesson.module.course.title;
  const playbackId = lesson.video?.muxPlaybackId;
  const streamUrl = playbackId
    ? `https://stream.mux.com/${playbackId}.m3u8`
    : null;
  const posterUrl = playbackId
    ? `https://image.mux.com/${playbackId}/thumbnail.jpg?width=640&height=360&fit_mode=smartcrop`
    : undefined;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/20 to-slate-100">
      {/* Breadcrumb bar */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-3.5 sm:px-6">
          <nav
            className="flex flex-wrap gap-2 text-sm text-slate-600 animate-fade-in-up"
            aria-label="Breadcrumb"
          >
            <Link href="/learn" className="transition-colors hover:text-indigo-600">
              My courses
            </Link>
            <span aria-hidden>/</span>
            <Link href={`/learn/${courseId}`} className="transition-colors hover:text-indigo-600">
              {courseTitle}
            </Link>
            <span aria-hidden>/</span>
            <span className="font-medium text-slate-900">{lesson.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <main className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl opacity-0 animate-fade-in-up animation-delay-75">
              {lesson.title}
            </h1>

            {streamUrl ? (
              <div className="mt-6 opacity-0 animate-scale-in animation-delay-150">
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/60">
                  <HlsPlayer
                    src={streamUrl}
                    poster={posterUrl}
                    className="rounded-2xl"
                    showQualitySelector
                  />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Use the <strong>⋮</strong> (three dots) in the bottom-right of the video to change playback speed and quality.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm animate-fade-in-up animation-delay-150">
                <p className="text-slate-600">Video not yet available for this lesson.</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3 opacity-0 animate-fade-in-up animation-delay-225">
              <Link
                href={`/learn/${courseId}`}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow"
              >
                ← Back to course
              </Link>
            </div>
          </main>

          <div className="opacity-0 animate-fade-in-up animation-delay-225">
            <CourseCurriculumSidebar
              key={lessonId}
              courseId={courseId}
              modules={course.modules}
              currentLessonId={lessonId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
