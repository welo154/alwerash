import Link from "next/link";

/** Placeholder for most watched courses. Replace with real data later. */
const PLACEHOLDER_COURSES = [
  { id: "5", title: "Course 5", views: "2.5K views" },
  { id: "6", title: "Course 6", views: "2.1K views" },
  { id: "7", title: "Course 7", views: "1.9K views" },
  { id: "8", title: "Course 8", views: "1.7K views" },
];

export function MostWatchedSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Most watched courses
        </h2>
        <p className="mt-2 text-slate-600">
          Trending courses this month
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
              <p className="text-sm text-slate-500">{course.views}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
