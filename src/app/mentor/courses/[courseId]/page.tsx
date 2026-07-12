import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getMentorIdForUser } from "@/server/auth/mentor-context";
import { requireRole } from "@/server/auth/require";
import { mentorGetCourseDetail } from "@/server/content/mentor.service";
import { AppError } from "@/server/lib/errors";

export default async function MentorCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await requireRole(["MENTOR", "ADMIN"]);
  const mentorId = await getMentorIdForUser(session.user.id);
  if (!mentorId) redirect("/mentor");

  const { courseId } = await params;

  let data: Awaited<ReturnType<typeof mentorGetCourseDetail>>;
  try {
    data = await mentorGetCourseDetail(mentorId, courseId);
  } catch (e) {
    if (e instanceof AppError && e.code === "NOT_FOUND") notFound();
    throw e;
  }

  return (
    <div className="p-8">
      <Link href="/mentor" className="text-sm text-slate-600 hover:text-slate-900">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-black">{data.course.title}</h1>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Learners</h2>
        <div className="mt-4 space-y-2">
          {data.learners.length === 0 ? (
            <p className="text-sm text-slate-600">No learners have started this course yet.</p>
          ) : (
            data.learners.map((learner) => (
              <div
                key={learner.id}
                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
              >
                <span className="text-sm font-medium text-slate-900">
                  {learner.name || "Unnamed learner"}
                </span>
                <span className="text-sm text-slate-600">{learner.email}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Submissions</h2>
        <div className="mt-4 space-y-2">
          {data.submissions.length === 0 ? (
            <p className="text-sm text-slate-600">No submissions for this course yet.</p>
          ) : (
            data.submissions.map((s) => (
              <Link
                key={s.id}
                href={`/mentor/submissions/${s.id}`}
                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 hover:bg-slate-50"
              >
                <span className="text-sm text-slate-900">
                  {s.user.name ?? s.user.email} — {s.assignment.title}
                </span>
                <span className="text-xs font-medium uppercase text-slate-500">{s.status}</span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
