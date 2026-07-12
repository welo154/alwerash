"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SubmissionFile = {
  id: string;
  fileKey: string;
  mime: string;
  size: number;
};

type SubmissionData = {
  id: string;
  status: string;
  textAnswer: string | null;
  externalLink: string | null;
  instructorFeedback: string | null;
  grade: number | null;
  files: SubmissionFile[];
};

type AssignmentData = {
  id: string;
  title: string;
  instructions: string | null;
};

type Props = {
  assignment: AssignmentData;
  initialSubmission: SubmissionData | null;
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted — awaiting review",
  REVIEWED: "Reviewed",
  NEEDS_CHANGES: "Changes requested",
};

export function AssignmentSubmissionPanel({ assignment, initialSubmission }: Props) {
  const router = useRouter();
  const [submission, setSubmission] = useState(initialSubmission);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const editable =
    !submission ||
    submission.status === "DRAFT" ||
    submission.status === "NEEDS_CHANGES";

  async function ensureDraft(): Promise<SubmissionData> {
    if (submission) return submission;
    const res = await fetch(`/api/learning/assignments/${assignment.id}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(typeof data.message === "string" ? data.message : "Could not start submission.");
    }
    setSubmission(data.submission);
    return data.submission as SubmissionData;
  }

  async function submitForReview() {
    setError(null);
    setLoading(true);
    try {
      await ensureDraft();
      const res = await fetch(`/api/learning/assignments/${assignment.id}/submit`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Could not submit.");
        return;
      }
      setSubmission(data.submission);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const sub = await ensureDraft();
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/learning/submissions/${sub.id}/files`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Upload failed.");
        return;
      }
      setSubmission((prev) =>
        prev
          ? { ...prev, files: [...prev.files, data.file] }
          : { ...sub, files: [data.file] }
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
        Final course assignment
      </p>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">{assignment.title}</h2>
      {assignment.instructions ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{assignment.instructions}</p>
      ) : (
        <p className="mt-2 text-sm text-slate-600">
          Upload a photo or PDF of your work for mentor review.
        </p>
      )}

      {submission ? (
        <p className="mt-3 text-sm font-medium text-indigo-700">
          {STATUS_LABELS[submission.status] ?? submission.status}
        </p>
      ) : null}

      {submission?.instructorFeedback && submission.status !== "DRAFT" ? (
        <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          <p className="font-medium">Mentor feedback</p>
          <p className="mt-1 whitespace-pre-wrap">{submission.instructorFeedback}</p>
          {submission.grade != null ? (
            <p className="mt-2 text-indigo-800">Grade: {submission.grade}/100</p>
          ) : null}
        </div>
      ) : null}

      {editable ? (
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Photo or PDF <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={onFileChange}
              disabled={uploading}
              className="text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">JPEG, PNG, WebP, or PDF up to 10MB</p>
          </div>
          {submission?.files?.length ? (
            <ul className="space-y-1 text-sm text-slate-600">
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
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="button"
            onClick={submitForReview}
            disabled={loading || uploading || !(submission?.files?.length)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            Submit for review
          </button>
        </div>
      ) : submission?.files?.length ? (
        <ul className="mt-4 space-y-1 text-sm">
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
    </section>
  );
}
