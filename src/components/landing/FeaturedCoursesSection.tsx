import Link from "next/link";
import Image from "next/image";
import { publicListFeaturedCourses } from "@/server/content/public.service";

export async function FeaturedCoursesSection() {
  const courses = await publicListFeaturedCourses(8);

  if (courses.length === 0) return null;

  return (
    <section className="border-b border-slate-200 bg-slate-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Featured courses
        </h2>
        <p className="mt-2 text-slate-600">
          Most popular courses chosen by learners
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group card-hover overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-lg"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                {course.coverImage ? (
                  <Image
                    src={course.coverImage}
                    alt={course.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    Course
                  </div>
                )}
              </div>
              <div className="p-4">
                {course.track && (
                  <span className="text-xs font-medium text-blue-600">
                    {course.track.title}
                  </span>
                )}
                <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-blue-600">
                  {course.title}
                </h3>
                {course.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {course.summary}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
