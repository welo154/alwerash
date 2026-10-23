import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import {
  adminListAssignmentCourses,
  adminListSubmissions,
  adminSubmissionStatusCounts,
  parseSubmissionStatus,
} from "@/server/content/admin-submissions.service";
import { SUBMISSION_STATUS_LABELS, SubmissionStatusBadge } from "./SubmissionStatusBadge";

export const dynamic = "force-dynamic";

const STATUS_TABS = ["SUBMITTED", "NEEDS_CHANGES", "REVIEWED", "DRAFT"] as const;

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function tabHref(status: string | undefined, courseId: string | undefined) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (courseId) params.set("courseId", courseId);
  const qs = params.toString();
  return qs ? `/admin/submissions?${qs}` : "/admin/submissions";
}

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; courseId?: string; toast?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const sp = await searchParams;
  const status = parseSubmissionStatus(sp.status);
  const courseId = sp.courseId?.trim() || undefined;

  const [submissions, { counts, total }, courses] = await Promise.all([
    adminListSubmissions({ status, courseId }),
    adminSubmissionStatusCounts(courseId),
    adminListAssignmentCourses(),
  ]);

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-black">Submissions</h1>
      <p className="mb-6 max-w-2xl text-sm text-slate-600">
        Every final-project submission from all courses. Open one to review it: approving issues the
        learner&apos;s certificate.
      </p>

      {sp.toast ? (
        <p className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {sp.toast}
        </p>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link
          href={tabHref(undefined, courseId)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            !status ? "bg-black text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
          }`}
        >
          All ({total})
        </Link>
        {STATUS_TABS.map((s) => (
          <Link
            key={s}
            href={tabHref(s, courseId)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              status === s
                ? "bg-black text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {SUBMISSION_STATUS_LABELS[s]} ({counts[s]})
          </Link>
        ))}

        <form action="/admin/submissions" className="ml-auto flex items-center gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <select
            name="courseId"
            defaultValue={courseId ?? ""}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value="">All courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Filter
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Learner</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Mentor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  No submissions match this filter.
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{s.user.name ?? "Unnamed"}</p>
                    <p className="text-xs text-slate-500">{s.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <p>{s.assignment.course?.title ?? "—"}</p>
                    <p className="text-xs text-slate-500">{s.assignment.title}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{s.assignment.course?.mentor?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <SubmissionStatusBadge status={s.status} />
                    {s.certificate ? (
                      <p className="mt-1 text-xs text-emerald-700">Certificate issued</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{s.grade != null ? `${s.grade}/100` : "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{formatDate(s.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/submissions/${s.id}`}
                      className="font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {s.status === "SUBMITTED" || s.status === "NEEDS_CHANGES" ? "Review" : "View"}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
