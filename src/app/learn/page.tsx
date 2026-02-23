import Link from "next/link";
import Image from "next/image";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { listCoursesForLearning } from "@/server/content/learn.service";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string }>;
}) {
  await requireSubscription();
  const courses = await listCoursesForLearning();
  const params = await searchParams;
  const justSubscribed = params.subscribed === "1";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        My courses
      </h1>
      <p className="mt-2 text-slate-600">
        Your subscribed courses. Click a course to watch lessons.
      </p>

      {justSubscribed && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          You’re subscribed. Start watching any course below.
        </div>
      )}

      {courses.length === 0 ? (
        <p className="mt-8 text-slate-500">No courses available yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/learn/${course.id}`}
              className="group card-hover overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg"
            >
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
              </div>
              <div className="p-4">
                {course.track && (
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
                <span className="mt-2 inline-block text-sm text-blue-600 group-hover:underline">
                  Watch course →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
