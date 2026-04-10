"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type InstructorRow = { id: string; email: string; name: string | null; country: string | null };
type CourseOption = { id: string; title: string };
type AssignmentRow = {
  createdAt: Date;
  course: { id: string; title: string };
  instructor: { id: string; email: string; name: string | null };
};

export function InstructorsAdminClient({
  instructors: initialInstructors,
  courses,
  assignments: initialAssignments,
}: {
  instructors: InstructorRow[];
  courses: CourseOption[];
  assignments: AssignmentRow[];
}) {
  const router = useRouter();
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [lastTempPassword, setLastTempPassword] = useState<string | null>(null);
  const [lastCreatedEmail, setLastCreatedEmail] = useState<string | null>(null);

  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);

  async function onCreateInstructor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateError(null);
    setLastTempPassword(null);
    setLastCreatedEmail(null);
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    const name = String(new FormData(form).get("name") ?? "").trim() || undefined;
    const country = String(new FormData(form).get("country") ?? "").trim().toUpperCase() || undefined;
    const body: { email: string; name?: string; country?: string } = { email };
    if (name) body.name = name;
    if (country) {
      if (country.length !== 2) {
        setCreateError("Country must be a 2-letter code (e.g. EG) or leave blank.");
        return;
      }
      body.country = country;
    }

    setCreateLoading(true);
    try {
      const res = await fetch("/api/admin/instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCreateError(typeof data.message === "string" ? data.message : "Could not create instructor.");
        return;
      }
      setLastTempPassword(typeof data.temporaryPassword === "string" ? data.temporaryPassword : null);
      setLastCreatedEmail(typeof data.user?.email === "string" ? data.user.email : email);
      form.reset();
      router.refresh();
    } catch {
      setCreateError("Network error. Try again.");
    } finally {
      setCreateLoading(false);
    }
  }

  async function onAssign(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAssignError(null);
    setAssignSuccess(null);
    const fd = new FormData(e.currentTarget);
    const courseId = String(fd.get("courseId") ?? "");
    const instructorId = String(fd.get("instructorId") ?? "");
    if (!courseId || !instructorId) {
      setAssignError("Choose a course and an instructor.");
      return;
    }
    setAssignLoading(true);
    try {
      const res = await fetch("/api/admin/course-instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, instructorId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAssignError(typeof data.message === "string" ? data.message : "Could not assign.");
        return;
      }
      setAssignSuccess("Instructor assigned to course.");
      e.currentTarget.reset();
      router.refresh();
    } catch {
      setAssignError("Network error. Try again.");
    } finally {
      setAssignLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Create instructor account</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Instructors cannot self-register. They sign in at <strong>/login</strong> with the one-time password
          shown below (copy it now; it is not stored).
        </p>
        <form onSubmit={onCreateInstructor} className="mt-4 max-w-lg space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name (optional)</label>
            <input
              name="name"
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Country (optional, 2 letters)</label>
            <input
              name="country"
              maxLength={2}
              placeholder="EG"
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          {createError && (
            <p className="text-sm text-red-700" role="alert">
              {createError}
            </p>
          )}
          <button
            type="submit"
            disabled={createLoading}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {createLoading ? "Creating…" : "Create instructor"}
          </button>
        </form>
        {lastTempPassword && lastCreatedEmail && (
          <div
            className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
            role="status"
          >
            <p className="font-medium">One-time password for {lastCreatedEmail}</p>
            <p className="mt-2 font-mono break-all text-base">{lastTempPassword}</p>
            <p className="mt-2 text-xs text-amber-900/80">Copy and send securely to the instructor. This will not be shown again.</p>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Assign instructor to course</h2>
        <form onSubmit={onAssign} className="mt-4 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">Course</label>
            <select
              name="courseId"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              defaultValue=""
            >
              <option value="" disabled>
                Select course…
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0 flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">Instructor</label>
            <select
              name="instructorId"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              defaultValue=""
            >
              <option value="" disabled>
                Select instructor…
              </option>
              {initialInstructors.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.email}
                  {i.name ? ` — ${i.name}` : ""}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={assignLoading || initialInstructors.length === 0 || courses.length === 0}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {assignLoading ? "Saving…" : "Assign"}
          </button>
        </form>
        {assignError && (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {assignError}
          </p>
        )}
        {assignSuccess && (
          <p className="mt-2 text-sm text-green-800" role="status">
            {assignSuccess}
          </p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-black">Current assignments</h2>
        {initialAssignments.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">No assignments yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white text-sm">
            {initialAssignments.map((a) => (
              <li key={`${a.course.id}-${a.instructor.id}`} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <span className="font-medium text-slate-900">{a.course.title}</span>
                <span className="text-slate-600">
                  {a.instructor.email}
                  {a.instructor.name ? ` (${a.instructor.name})` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-black">All instructors</h2>
        {initialInstructors.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">No instructors yet. Create one above.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white text-sm">
            {initialInstructors.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <span className="text-slate-900">{i.email}</span>
                <span className="text-slate-600">
                  {[i.name, i.country].filter(Boolean).join(" · ") || "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
