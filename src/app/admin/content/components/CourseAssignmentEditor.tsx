"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AssignmentData = {
  id: string;
  title: string;
  instructions: string | null;
  published: boolean;
  _count: { submissions: number };
};

type Props = {
  courseId: string;
  courseTitle: string;
  initialAssignment: AssignmentData | null;
};

export function CourseAssignmentEditor({
  courseId,
  courseTitle,
  initialAssignment,
}: Props) {
  const router = useRouter();
  const [assignment, setAssignment] = useState(initialAssignment);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    const instructions = String(fd.get("instructions") ?? "").trim() || undefined;
    const published = fd.get("published") === "on";

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/assignment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, instructions, published }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Could not create assignment.");
        return;
      }
      setAssignment(data.assignment ?? null);
      e.currentTarget.reset();
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function onUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!assignment) return;
    setError(null);
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    const instructions = String(fd.get("instructions") ?? "").trim() || undefined;
    const published = fd.get("published") === "on";

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/assignment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, instructions, published }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Could not update assignment.");
        return;
      }
      setAssignment(data.assignment ?? assignment);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!assignment) return;
    if (!window.confirm(`Remove final assignment from “${courseTitle}”?`)) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/assignment`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.message === "string" ? data.message : "Could not delete.");
        return;
      }
      setAssignment(null);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Final course assignment</h2>
      <p className="mt-1 text-sm text-slate-500">
        One assignment at the end of the course. Learners submit a photo or PDF for mentor review.
      </p>
      {assignment ? (
        <form onSubmit={onUpdate} className="mt-4 space-y-3">
          <input
            name="title"
            defaultValue={assignment.title}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            name="instructions"
            defaultValue={assignment.instructions ?? ""}
            rows={4}
            placeholder="Instructions for learners (photo or PDF)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input name="published" type="checkbox" defaultChecked={assignment.published} />
            Published (visible to learners)
          </label>
          <p className="text-xs text-slate-500">
            {assignment._count.submissions} submission(s) received
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white disabled:opacity-60"
            >
              Save assignment
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={loading}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700"
            >
              Remove
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={onCreate} className="mt-4 space-y-3">
          <input
            name="title"
            placeholder="Assignment title"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            name="instructions"
            rows={3}
            placeholder="Instructions (optional) — ask for a photo or PDF"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input name="published" type="checkbox" />
            Published
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700"
          >
            Add final assignment
          </button>
        </form>
      )}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
