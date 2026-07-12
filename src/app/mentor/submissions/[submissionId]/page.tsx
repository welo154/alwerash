import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getMentorIdForUser } from "@/server/auth/mentor-context";
import { requireRole } from "@/server/auth/require";
import { mentorGetSubmission } from "@/server/content/mentor.service";
import { AppError } from "@/server/lib/errors";
import { MentorReviewForm } from "./MentorReviewForm";

export default async function MentorSubmissionDetailPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const session = await requireRole(["MENTOR", "ADMIN"]);
  const mentorId = await getMentorIdForUser(session.user.id);
  if (!mentorId) redirect("/mentor");

  const { submissionId } = await params;

  let submission: Awaited<ReturnType<typeof mentorGetSubmission>>;
  try {
    submission = await mentorGetSubmission(mentorId, submissionId);
  } catch (e) {
    if (e instanceof AppError && e.code === "NOT_FOUND") notFound();
    throw e;
  }

  const canReview =
    submission.status === "SUBMITTED" || submission.status === "NEEDS_CHANGES";

  return (
    <div className="p-8">
      <Link href="/mentor/submissions" className="text-sm text-slate-600 hover:text-slate-900">
        ← Submissions
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-black">{submission.assignment.title}</h1>
      <p className="mt-1 text-sm text-slate-600">
        {submission.assignment.course?.title ?? "Course"} · Final assignment
      </p>
      <p className="mt-2 text-sm text-slate-700">
        Learner: {submission.user.name ?? "Unnamed"} ({submission.user.email})
      </p>
      <p className="text-xs font-medium uppercase text-slate-500">{submission.status}</p>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Submission</h2>
        {submission.textAnswer ? (
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{submission.textAnswer}</p>
        ) : null}
        {submission.externalLink ? (
          <p className="mt-3 text-sm">
            <a
              href={submission.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              {submission.externalLink}
            </a>
          </p>
        ) : null}
        {submission.files.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm">
            {submission.files.map((f) => (
              <li key={f.id}>
                <a
                  href={`/api/learning/submissions/files/${encodeURIComponent(f.fileKey)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {f.fileKey}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        {!submission.textAnswer && !submission.externalLink && submission.files.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No content in this submission.</p>
        ) : null}
      </section>

      {submission.instructorFeedback && submission.status === "REVIEWED" ? (
        <section className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          <p className="font-medium">Your feedback</p>
          <p className="mt-1 whitespace-pre-wrap">{submission.instructorFeedback}</p>
          {submission.grade != null ? <p className="mt-2">Grade: {submission.grade}/100</p> : null}
        </section>
      ) : null}

      {canReview ? <MentorReviewForm submission={submission} /> : null}
    </div>
  );
}
