import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmissionStatus } from "@prisma/client";
import { getMentorIdForUser } from "@/server/auth/mentor-context";
import { requireRole } from "@/server/auth/require";
import { mentorListSubmissions } from "@/server/content/mentor.service";

export default async function MentorSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireRole(["MENTOR", "ADMIN"]);
  const mentorId = await getMentorIdForUser(session.user.id);
  if (!mentorId) redirect("/mentor");

  const { status: statusParam } = await searchParams;
  const status =
    statusParam && Object.values(SubmissionStatus).includes(statusParam as SubmissionStatus)
      ? (statusParam as SubmissionStatus)
      : SubmissionStatus.SUBMITTED;

  const submissions = await mentorListSubmissions(mentorId, { status });

  return (
    <div className="p-8">
      <Link href="/mentor" className="text-sm text-slate-600 hover:text-slate-900">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-black">Submissions</h1>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {(["SUBMITTED", "REVIEWED", "NEEDS_CHANGES", "DRAFT"] as const).map((s) => (
          <Link
            key={s}
            href={`/mentor/submissions?status=${s}`}
            className={`rounded-full px-3 py-1 ${
              status === s
                ? "bg-slate-900 text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {s.replace("_", " ")}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        {submissions.length === 0 ? (
          <p className="text-sm text-slate-600">No submissions in this filter.</p>
        ) : (
          submissions.map((s) => (
            <Link
              key={s.id}
              href={`/mentor/submissions/${s.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50"
            >
              <p className="font-medium text-slate-900">
                {s.user.name ?? s.user.email} — {s.assignment.title}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {s.assignment.course?.title ?? "Course"}
              </p>
              <p className="mt-1 text-xs uppercase text-slate-500">{s.status}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
