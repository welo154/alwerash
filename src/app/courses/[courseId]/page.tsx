// file: src/app/courses/[courseId]/page.tsx
// Course page is public: anyone can view course info, intro video, and curriculum.
// Lesson videos are only available to subscribed users via /learn/[courseId]/lesson/[lessonId].
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  publicGetCourseById,
  publicGetSimilarCourses,
} from "@/server/content/public.service";
import { hasActiveSubscription } from "@/server/subscription/access.service";
import { AppError } from "@/server/lib/errors";
import { prisma } from "@/server/db/prisma";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { getCourseProgress } from "@/server/learning/progress.service";
import { CourseProgressBar } from "@/components/learning/CourseProgressBar";
import { CourseCard } from "@/components/landing/CourseCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { title: true, summary: true },
  });
  if (!course) return { title: "Course" };
  return {
    title: course.title,
    description: course.summary ?? undefined,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  const hasAccess =
    session?.user?.id &&
    ((session.user as { roles?: string[] }).roles?.includes("ADMIN") ||
      (await hasActiveSubscription(session.user.id)));

  const { courseId } = await params;
  let course;
  try {
    course = await publicGetCourseById(courseId);
  } catch (e) {
    if (e instanceof AppError && e.status === 404) notFound();
    throw e;
  }

  const similarCourses = course.track
    ? await publicGetSimilarCourses(courseId, course.track.slug)
    : [];

  const modules = course.modules ?? [];
  const lessonCount = modules.reduce(
    (acc, m) => acc + (m.lessons?.length ?? 0),
    0
  );
  const whatYouLearn = modules.flatMap((m) =>
    (m.lessons ?? []).map((l) => l.title)
  );

  const introPlaybackId = (course as { introVideoMuxPlaybackId?: string | null }).introVideoMuxPlaybackId;
  const instructorName = (course as { instructorName?: string | null }).instructorName;
  const instructorImage = (course as { instructorImage?: string | null }).instructorImage;

  const userId = session?.user?.id;
  const courseProgress =
    hasAccess && userId && lessonCount > 0
      ? await getCourseProgress(userId, courseId)
      : null;
  const progressPercent = courseProgress?.progressPercent ?? 0;
  const completedCount = courseProgress?.completedCount ?? 0;
  const totalCount = courseProgress?.totalCount ?? lessonCount;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <nav className="flex gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/tracks" className="hover:text-blue-600">
              Projects
            </Link>
            {course.track ? (
              <>
                <span>/</span>
                <Link
                  href={`/tracks/${course.track.slug}`}
                  className="hover:text-blue-600"
                >
                  {course.track.title}
                </Link>
              </>
            ) : null}
            <span>/</span>
            <span className="text-slate-900">{course.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            {/* Intro video or cover image - visible to everyone */}
            <div className="flex-1">
              {introPlaybackId ? (
                <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-slate-200/50">
                  <HlsPlayer
                    src={`https://stream.mux.com/${introPlaybackId}.m3u8`}
                    poster={`https://image.mux.com/${introPlaybackId}/thumbnail.jpg?width=640&height=360&fit_mode=smartcrop`}
                    className="rounded-xl"
                    showQualitySelector={false}
                  />
                  <p className="mt-1.5 text-xs text-slate-500">Course intro — free to watch</p>
                </div>
              ) : (
                <div className="aspect-video relative w-full overflow-hidden rounded-xl bg-slate-200 shadow-lg">
                  {course.coverImage ? (
                    <Image
                      src={course.coverImage}
                      alt={course.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      Course preview
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - Price & CTA */}
            <aside className="w-full lg:w-96 shrink-0">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {course.title}
                </h1>
                {course.track && (
                  <p className="mt-2 text-sm text-slate-600">
                    {course.track.title} Track
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span>{modules.length} modules</span>
                  <span>•</span>
                  <span>{lessonCount} lessons</span>
                </div>
                {hasAccess ? (
                  <div className="mt-4 space-y-3">
                    {lessonCount > 0 && (
                      <CourseProgressBar
                        progressPercent={progressPercent}
                        completedCount={completedCount}
                        totalCount={totalCount}
                        label="Your progress"
                      />
                    )}
                    <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                      ✓ You have access to this course
                    </p>
                    <Link
                      href={`/learn/${courseId}`}
                      className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Watch lessons →
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                      {session
                        ? "Subscribe to access course content."
                        : "Sign in and subscribe to access course content."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {!session && (
                        <Link
                          href={`/login?next=${encodeURIComponent(`/courses/${courseId}`)}`}
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Sign in
                        </Link>
                      )}
                      <Link
                        href="/subscription"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Subscribe
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructor - from admin */}
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900">Instructor</h3>
                <div className="mt-3 flex items-center gap-3">
                  {instructorImage ? (
                    <Image
                      src={instructorImage}
                      alt={instructorName ?? "Instructor"}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-slate-200" />
                  )}
                  <div>
                    <p className="font-medium text-slate-900">
                      {instructorName ?? "Expert Instructor"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {instructorName ? "Course instructor" : "Industry professional"}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Main content + Sidebar (What you'll learn) */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <main className="flex-1 space-y-8">
            {/* Description */}
            {course.summary && (
              <section>
                <h2 className="text-lg font-semibold text-slate-900">
                  What to expect
                </h2>
                <p className="mt-3 text-slate-600">{course.summary}</p>
              </section>
            )}

            {/* Curriculum */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                Curriculum
              </h2>
              {modules.length === 0 ? (
                <p className="mt-3 text-slate-500">No modules yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {modules.map((m, i) => (
                    <details
                      key={m.id}
                      className="group rounded-lg border border-slate-200 bg-white"
                    >
                      <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium text-slate-900">
                        <span>
                          {i + 1}. {m.title}
                        </span>
                        <span className="text-sm font-normal text-slate-500">
                          {(m.lessons?.length ?? 0)} lessons
                        </span>
                      </summary>
                      <ul className="border-t border-slate-200 px-4 py-2">
                        {(m.lessons ?? []).map((l, j) => (
                          <li
                            key={l.id}
                            className="flex items-center gap-3 py-2 text-sm text-slate-600"
                          >
                            <span className="text-slate-400">
                              {String(l.type).charAt(0)}
                            </span>
                            <span>
                              {i + 1}.{j + 1} {l.title}
                            </span>
                          </li>
                        ))}
                        {(m.lessons?.length ?? 0) === 0 && (
                          <li className="py-2 text-sm text-slate-500">
                            No published lessons yet.
                          </li>
                        )}
                      </ul>
                    </details>
                  ))}
                </div>
              )}
              {hasAccess && lessonCount > 0 && (
                <p className="mt-4">
                  <Link
                    href={`/learn/${courseId}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Watch all lessons →
                  </Link>
                </p>
              )}
            </section>
          </main>

          {/* What you'll learn - sidebar on desktop */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-4">
              <h3 className="font-semibold text-slate-900">
                What you&apos;ll learn
              </h3>
              {whatYouLearn.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {whatYouLearn.slice(0, 8).map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-slate-600"
                    >
                      <span className="text-green-600">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {whatYouLearn.length > 8 && (
                    <li className="text-sm text-slate-500">
                      +{whatYouLearn.length - 8} more
                    </li>
                  )}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  Lesson list coming soon.
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* Similar courses */}
        {similarCourses.length > 0 && (
          <section className="mt-12 border-t border-slate-200 pt-12">
            <h2 className="text-lg font-semibold text-slate-900">
              Similar courses
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similarCourses.map((c) => (
                <CourseCard
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  summary={c.summary}
                  coverImage={c.coverImage}
                  track={c.track}
                  lessonCount={c.lessonCount}
                  totalDurationMinutes={c.totalDurationMinutes}
                  rating={c.rating}
                  studentCount={c.studentCount}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
