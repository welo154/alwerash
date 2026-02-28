import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { getLessonForLearning, getCourseForLearning } from "@/server/content/learn.service";
import { AppError } from "@/server/lib/errors";
import { getCourseProgress, getLessonProgress } from "@/server/learning/progress.service";
import { CourseCurriculumSidebar } from "../../CourseCurriculumSidebar";
import { completeLesson } from "./actions";
import { LessonPlayerWithActions } from "./LessonPlayerWithActions";

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
  const session = await requireSubscription();
  const userId = session.user.id;
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

  const [courseProgressRecord, lessonProgressRecord] = await Promise.all([
    getCourseProgress(userId, courseId),
    getLessonProgress(userId, lessonId),
  ]);
  const courseProgress = courseProgressRecord
    ? {
        progressPercent: courseProgressRecord.progressPercent,
        completedCount: courseProgressRecord.completedCount,
        totalCount: courseProgressRecord.totalCount,
      }
    : { progressPercent: 0, completedCount: 0, totalCount: 0 };
  const initialLastPositionSeconds = lessonProgressRecord?.lastPositionSeconds ?? 0;

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
                <LessonPlayerWithActions
                  courseId={courseId}
                  lessonId={lessonId}
                  streamUrl={streamUrl}
                  posterUrl={posterUrl}
                  completeLesson={completeLesson}
                  courseProgress={courseProgress}
                  initialLastPositionSeconds={
                    initialLastPositionSeconds > 0 ? initialLastPositionSeconds : undefined
                  }
                />
                <p className="mt-3 text-xs text-slate-500">
                  Use the <strong>⋮</strong> (three dots) in the bottom-right of the video to change playback speed and quality.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm animate-fade-in-up animation-delay-150">
                <p className="text-slate-600">Video not yet available for this lesson.</p>
              </div>
            )}
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
