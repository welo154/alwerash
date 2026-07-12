"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SubmissionDetail = {
  id: string;
  status: string;
  textAnswer: string | null;
  externalLink: string | null;
  instructorFeedback: string | null;
  grade: number | null;
  user: { name: string | null; email: string };
  files: { id: string; fileKey: string }[];
  assignment: {
    title: string;
    course: { title: string } | null;
  };
};

export function MentorReviewForm({ submission }: { submission: SubmissionDetail }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState(submission.instructorFeedback ?? "");
  const [grade, setGrade] = useState(
    submission.grade != null ? String(submission.grade) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function review(status: "REVIEWED" | "NEEDS_CHANGES") {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/mentor/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback,
          status,
          ...(grade !== "" ? { grade: Number(grade) } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Could not save review.");
        return;
      }
      router.push("/mentor/submissions?toast=Review+saved");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">Review</h2>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={5}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Grade (0–100, optional)</label>
        <input
          type="number"
          min={0}
          max={100}
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading || !feedback.trim()}
          onClick={() => review("REVIEWED")}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          Mark reviewed
        </button>
        <button
          type="button"
          disabled={loading || !feedback.trim()}
          onClick={() => review("NEEDS_CHANGES")}
          className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50 disabled:opacity-60"
        >
          Request changes
        </button>
      </div>
    </div>
  );
}
