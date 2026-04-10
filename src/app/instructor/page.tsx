import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import { instructorListCourses } from "@/server/content/instructor.service";

export default async function InstructorPage() {
  const { user } = await requireRole(["INSTRUCTOR", "ADMIN"]);
  const courses = await instructorListCourses(user.id);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-black">Instructor portal</h1>
      <p className="mt-2 text-sm text-slate-600">Your assigned courses and attendee counts.</p>

      <div className="mt-6 space-y-3">
        {courses.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No courses assigned yet.
          </div>
        ) : (
          courses.map((course) => (
            <Link
              key={course.id}
              href={`/instructor/courses/${course.id}`}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50"
            >
              <span className="font-medium text-slate-900">{course.title}</span>
              <span className="text-sm text-slate-600">Attendees: {course.attendeeCount}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
