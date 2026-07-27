import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getMentorIdForUser } from "@/server/auth/mentor-context";
import { requireRole } from "@/server/auth/require";
import { mentorGetCourseDetail } from "@/server/content/mentor.service";
import { AppError } from "@/server/lib/errors";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  REVIEWED: "Reviewed",
  NEEDS_CHANGES: "Changes requested",
};

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

  const capstoneSubmissions = data.submissions.filter((s) => s.status !== "DRAFT");

  return (
    <div className="p-8">
      <Link href="/mentor" className="text-sm text-slate-600 hover:text-slate-900">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-black">{data.course.title}</h1>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Learners who engaged</h2>
        <p className="mt-1 text-sm text-slate-500">
          Learners who have started watching lessons in this course.
        </p>
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
        <h2 className="text-lg font-semibold text-slate-900">Capstone submissions</h2>
        <p className="mt-1 text-sm text-slate-500">
          Final course assignment uploads awaiting review or already graded.
        </p>
        <div className="mt-4 space-y-2">
          {capstoneSubmissions.length === 0 ? (
            <p className="text-sm text-slate-600">No capstone submissions for this course yet.</p>
          ) : (
            capstoneSubmissions.map((s) => (
              <Link
                key={s.id}
                href={`/mentor/submissions/${s.id}`}
                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {s.user.name ?? s.user.email}
                  </p>
                  <p className="text-xs text-slate-500">{s.assignment.title}</p>
                </div>
                <span className="text-xs font-medium uppercase text-slate-500">
                  {STATUS_LABELS[s.status] ?? s.status}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
