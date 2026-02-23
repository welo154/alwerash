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

        {/* Curriculum with lessons and video area */}
        <div className="mt-8 space-y-8">
          {course.modules.map((module, mIndex) => (
            <section key={module.id}>
              <h2 className="text-lg font-semibold text-slate-900">
                {mIndex + 1}. {module.title}
              </h2>
              <ul className="mt-4 space-y-4">
                {module.lessons.map((lesson, lIndex) => (
                  <li
                    key={lesson.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {mIndex + 1}.{lIndex + 1} {lesson.title}
                        </h3>
                        <span className="mt-1 inline-block text-xs text-slate-500">
                          {lesson.type === "VIDEO" ? "Video" : lesson.type}
                        </span>
                      </div>
                    </div>
                    {lesson.type === "VIDEO" && lesson.video?.muxPlaybackId && (
                      <div className="mt-4">
                        <div className="aspect-video max-w-3xl overflow-hidden rounded-lg bg-black">
                          <video
                            className="h-full w-full"
                            controls
                            playsInline
                            preload="metadata"
                            src={`https://stream.mux.com/${lesson.video.muxPlaybackId}.m3u8`}
                            poster={`https://image.mux.com/${lesson.video.muxPlaybackId}/thumbnail.jpg?width=640&height=360&fit_mode=smartcrop`}
                          >
                            Your browser does not support the video tag. Playback
                            ID: {lesson.video.muxPlaybackId}
                          </video>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          HLS stream (Safari: native; others: may need a
                          player).
                        </p>
                      </div>
                    )}
                    {lesson.type === "VIDEO" && !lesson.video?.muxPlaybackId && (
                      <p className="mt-3 text-sm text-slate-500">
                        Video not yet available for this lesson.
                      </p>
                    )}
                  </li>
                ))}
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
