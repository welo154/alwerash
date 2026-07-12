import Link from "next/link";
import { getMentorIdForUser } from "@/server/auth/mentor-context";
import { requireRole } from "@/server/auth/require";
import {
  mentorGetDashboardStats,
  mentorListCourses,
} from "@/server/content/mentor.service";

export default async function MentorPage() {
  const session = await requireRole(["MENTOR", "ADMIN"]);
  const mentorId = await getMentorIdForUser(session.user.id);
  if (!mentorId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-black">Mentor portal</h1>
        <p className="mt-2 text-sm text-slate-600">
          No mentor profile is linked to this account. An admin must create mentor login credentials
          from the mentor edit page in the admin dashboard.
        </p>
      </div>
    );
  }

  const [stats, courses] = await Promise.all([
    mentorGetDashboardStats(mentorId),
    mentorListCourses(mentorId),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-black">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Your courses and learner activity.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Courses" value={stats.courseCount} />
        <StatCard label="Learners" value={stats.totalLearners} />
        <StatCard label="Pending reviews" value={stats.pendingSubmissions} />
        <StatCard label="Reviewed this week" value={stats.reviewedThisWeek} />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Your courses</h2>
        <div className="mt-4 space-y-3">
          {courses.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
              No courses assigned to you yet. Ask an admin to set your mentor on a course.
            </div>
          ) : (
            courses.map((course) => (
              <Link
                key={course.id}
                href={`/mentor/courses/${course.id}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50"
              >
                <span className="font-medium text-slate-900">{course.title}</span>
                <span className="text-sm text-slate-600">
                  {course.attendeeCount} learners
                  {course.pendingSubmissions > 0
                    ? ` · ${course.pendingSubmissions} pending`
                    : ""}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
