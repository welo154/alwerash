import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { getLessonForLearning } from "@/server/content/learn.service";
import { AppError } from "@/server/lib/errors";
import { HlsPlayer } from "@/components/video/HlsPlayer";

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
  try {
    lesson = await getLessonForLearning(lessonId, courseId);
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
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <nav className="flex flex-wrap gap-2 text-sm text-slate-600">
            <Link href="/learn" className="hover:text-blue-600">
              My courses
            </Link>
            <span>/</span>
            <Link href={`/learn/${courseId}`} className="hover:text-blue-600">
              {courseTitle}
            </Link>
            <span>/</span>
            <span className="text-slate-900">{lesson.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>

        {streamUrl ? (
          <div className="mt-6">
            <HlsPlayer
              src={streamUrl}
              poster={posterUrl}
              className="rounded-lg"
              showQualitySelector
            />
            <p className="mt-2 text-xs text-slate-500">
              Use the <strong>Quality</strong> bar directly below the video to choose Auto or a specific resolution. In Safari you’ll see &quot;Auto (browser)&quot;.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-slate-500">Video not yet available for this lesson.</p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/learn/${courseId}`}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Back to course
          </Link>
        </div>
      </div>
    </div>
  );
}
