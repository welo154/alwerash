import { publicListFeaturedCourses } from "@/server/content/public.service";
import { CourseCard } from "./CourseCard";

export async function MostWatchedSection() {
  const courses = await publicListFeaturedCourses(4);

  if (courses.length === 0) return null;

  return (
    <section className="border-b border-slate-200/80 bg-white px-4 py-16 sm:px-6" data-gsap-reveal>
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Trending courses
        </h2>
        <p className="mt-2.5 leading-relaxed text-slate-600">
          Popular courses this month
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-gsap-stagger-group>
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              variant="mostPlayed"
              id={course.id}
              title={course.title}
              summary={course.summary}
              coverImage={course.coverImage}
              track={course.track}
              lessonCount={course.lessonCount}
              instructorName={course.instructorName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
