import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import {
  adminCertificateTotals,
  adminListAssignmentCourses,
  adminListCertificates,
} from "@/server/content/admin-submissions.service";
import { certificatePath } from "@/server/certificates/certificate.service";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; courseId?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const courseId = sp.courseId?.trim() || undefined;

  const [certificates, totals, courses] = await Promise.all([
    adminListCertificates({ q, courseId }),
    adminCertificateTotals(),
    adminListAssignmentCourses(),
  ]);

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-black">Certificates</h1>
      <p className="mb-6 max-w-2xl text-sm text-slate-600">
        Certificates are issued automatically when a mentor or admin approves a final submission.
        The signature comes from the course mentor&apos;s profile at the time of issue.
      </p>

      <div className="mb-6 grid max-w-xl grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total issued</p>
          <p className="mt-1 text-3xl font-bold text-black">{totals.total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">This month</p>
          <p className="mt-1 text-3xl font-bold text-black">{totals.thisMonth}</p>
        </div>
      </div>

      <form action="/admin/certificates" className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, email, code or course"
          className="w-72 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
        />
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
          Search
        </button>
        {q || courseId ? (
          <Link href="/admin/certificates" className="text-sm text-slate-600 hover:text-slate-900">
            Clear
          </Link>
        ) : null}
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Mentor</th>
              <th className="px-4 py-3">Signature</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3 text-right">Links</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  No certificates found.
                </td>
              </tr>
            ) : (
              certificates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono text-xs text-slate-800">{c.code}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{c.recipientName}</p>
                    <p className="text-xs text-slate-500">{c.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{c.courseTitle}</td>
                  <td className="px-4 py-3 text-slate-700">{c.mentorName ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {c.signatureImage ? (
                      <span className="text-emerald-700">Included</span>
                    ) : (
                      <span className="text-rose-700">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {c.issuedAt.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="space-x-3 whitespace-nowrap px-4 py-3 text-right">
                    <a
                      href={certificatePath(c.code)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Verify page
                    </a>
                    {c.submissionId ? (
                      <Link
                        href={`/admin/submissions/${c.submissionId}`}
                        className="font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Submission
                      </Link>
                    ) : null}
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
