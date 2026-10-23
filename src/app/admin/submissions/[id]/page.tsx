import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import { adminGetSubmission } from "@/server/content/admin-submissions.service";
import { certificatePath } from "@/server/certificates/certificate.service";
import { AppError } from "@/server/lib/errors";
import { MentorReviewForm } from "@/app/mentor/submissions/[submissionId]/MentorReviewForm";
import { SubmissionStatusBadge } from "../SubmissionStatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { id } = await params;

  let submission: Awaited<ReturnType<typeof adminGetSubmission>>;
  try {
    submission = await adminGetSubmission(id);
  } catch (e) {
    if (e instanceof AppError && e.code === "NOT_FOUND") notFound();
    throw e;
  }

  const canReview =
    submission.status === "SUBMITTED" || submission.status === "NEEDS_CHANGES";
  const course = submission.assignment.course;

  return (
    <div className="max-w-3xl p-8">
      <Link href="/admin/submissions" className="text-sm text-slate-600 hover:text-slate-900">
        ← Submissions
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-black">{submission.assignment.title}</h1>
      <p className="mt-1 text-sm text-slate-600">
        {course?.title ?? "Course"} · Mentor: {course?.mentor?.name ?? "not assigned"}
      </p>
      <p className="mt-2 text-sm text-slate-700">
        Learner: {submission.user.name ?? "Unnamed"} ({submission.user.email})
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <SubmissionStatusBadge status={submission.status} />
        <span>Created {submission.createdAt.toLocaleString("en-GB")}</span>
        <span>Updated {submission.updatedAt.toLocaleString("en-GB")}</span>
      </div>

      {submission.certificate ? (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Certificate issued on {submission.certificate.issuedAt.toLocaleDateString("en-GB")}:{" "}
          <a
            href={certificatePath(submission.certificate.code)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            {submission.certificate.code}
          </a>
        </p>
      ) : null}

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

      {submission.instructorFeedback ? (
        <section className="mt-4 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-800">
          <p className="font-medium">Feedback</p>
          <p className="mt-1 whitespace-pre-wrap">{submission.instructorFeedback}</p>
          {submission.grade != null ? <p className="mt-2">Grade: {submission.grade}/100</p> : null}
        </section>
      ) : null}

      {canReview ? (
        <MentorReviewForm
          submission={submission}
          endpoint={`/api/admin/submissions/${submission.id}`}
          doneHref="/admin/submissions"
        />
      ) : null}
    </div>
  );
}
