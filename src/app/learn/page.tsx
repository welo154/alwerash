import Link from "next/link";
import Image from "next/image";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { listCoursesForLearningWithProgress } from "@/server/content/learn.service";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string; message?: string }>;
}) {
  const session = await requireSubscription();
  const courses = await listCoursesForLearningWithProgress(session.user.id);
  const params = await searchParams;
  const justSubscribed = params.subscribed === "1";
  const completePreviousCourse = params.message === "complete_previous_course";

  const byTrack = new Map<string | null, typeof courses>();
  for (const c of courses) {
    const key = c.trackId ?? "__notrack__";
    if (!byTrack.has(key)) byTrack.set(key, []);
    byTrack.get(key)!.push(c);
  }
  const trackOrder = Array.from(byTrack.keys()).sort((a, b) => {
    if (a === "__notrack__") return 1;
    if (b === "__notrack__") return -1;
    return 0;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        My courses
      </h1>
      <p className="mt-2 text-slate-600">
        Your subscribed courses. Complete courses in order within each track.
      </p>

      {justSubscribed && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          You’re subscribed. Start with the first course in each track.
        </div>
      )}

      {completePreviousCourse && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Complete the previous course in this track before starting the next one.
        </div>
      )}

      {courses.length === 0 ? (
        <p className="mt-8 text-slate-500">No courses available yet.</p>
      ) : (
        <div className="mt-8 space-y-10">
          {trackOrder.map((key) => {
            const trackCourses = byTrack.get(key)!;
            const trackTitle = key === "__notrack__"
              ? null
              : trackCourses[0]?.track?.title ?? "Other";
            const trackSlug = key === "__notrack__"
              ? null
              : trackCourses[0]?.track?.slug ?? null;

            return (
              <section key={key ?? "notrack"}>
                {trackTitle && (
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">
                    {trackTitle} Track
                  </h2>
                )}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {trackCourses.map((course) => {
                    const isLocked = !course.unlocked;
                    const isCompleted = course.completed;
                    const href = course.unlocked ? `/learn/${course.id}` : undefined;

                    return (
                      <div
                        key={course.id}
                        className={`group overflow-hidden rounded-xl border bg-white transition-all ${
                          isLocked
                            ? "border-amber-200 bg-amber-50/30 cursor-not-allowed"
                            : "border-slate-200 hover:border-blue-300 hover:shadow-lg"
                        }`}
                      >
                        {href ? (
                          <Link href={href} className="block">
                            <div className="aspect-video relative overflow-hidden bg-slate-100">
                              {course.coverImage ? (
                                <Image
                                  src={course.coverImage}
                                  alt={course.title}
                                  fill
                                  unoptimized
                                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                  Course
                                </div>
                              )}
                              {isLocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                                  <span className="rounded-full bg-amber-500/90 px-4 py-2 text-sm font-medium text-white">
                                    Complete previous course first
                                  </span>
                                </div>
                              )}
                              {isCompleted && !isLocked && (
                                <div className="absolute top-2 right-2 rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                                  ✓ Done
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              {course.track && !trackTitle && (
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                  {course.track.title}
                                </p>
                              )}
                              <h2 className="mt-1 font-semibold text-slate-900">{course.title}</h2>
                              {course.summary && (
                                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                                  {course.summary}
                                </p>
                              )}
                              <span className="mt-2 inline-block text-sm font-medium text-blue-600 group-hover:underline">
                                {isCompleted ? "Review course →" : "Watch course →"}
                              </span>
                            </div>
                          </Link>
                        ) : (
                          <>
                            <div className="aspect-video relative overflow-hidden bg-slate-100">
                              {course.coverImage ? (
                                <Image
                                  src={course.coverImage}
                                  alt={course.title}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                  Course
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                                <span className="rounded-full bg-amber-500/90 px-4 py-2 text-sm font-medium text-white">
                                  Complete previous course first
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              {course.track && !trackTitle && (
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                  {course.track.title}
                                </p>
                              )}
                              <h2 className="mt-1 font-semibold text-slate-900">{course.title}</h2>
                              {course.summary && (
                                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                                  {course.summary}
                                </p>
                              )}
                              <span className="mt-2 inline-block text-sm text-slate-400">
                                Locked
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
