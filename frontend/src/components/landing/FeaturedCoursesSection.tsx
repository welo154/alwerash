import Link from "next/link";

/** Placeholder for featured courses. Replace with real data later. */
const PLACEHOLDER_COURSES = [
  { id: "1", title: "Course 1", track: "Design" },
  { id: "2", title: "Course 2", track: "Development" },
  { id: "3", title: "Course 3", track: "Marketing" },
  { id: "4", title: "Course 4", track: "Business" },
];

export function FeaturedCoursesSection() {
  return (
    <section className="border-b border-slate-200 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Best seller & featured courses
        </h2>
        <p className="mt-2 text-slate-600">
          Most popular courses chosen by learners
        </p>
        <div className="mt-8 flex flex-wrap gap-6">
          {PLACEHOLDER_COURSES.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="flex w-48 flex-col rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:shadow-md"
            >
              <div className="h-24 rounded bg-slate-100" />
              <h3 className="mt-3 font-medium text-slate-900">{course.title}</h3>
              <p className="text-sm text-slate-500">{course.track}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
