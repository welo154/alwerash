import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import { prisma } from "@/server/db/prisma";
import {
  formatSecondsAsHhMm,
  getUserCourseWatchTotals,
  getWeeklyActivitySummary,
} from "@/server/home/learning-activity.service";

export default async function AdminUserActivityPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });
  if (!user) notFound();

  const now = new Date();
  const [weekly, byCourse] = await Promise.all([
    getWeeklyActivitySummary(userId, now),
    getUserCourseWatchTotals(userId, 30, now),
  ]);

  return (
    <div className="p-8">
      <p className="mb-4 text-sm text-slate-600">
        <Link href="/admin/users" className="font-medium text-indigo-600 hover:text-indigo-800">
          ← Learners
        </Link>
      </p>
      <h1 className="mb-1 text-2xl font-bold text-black">Learning activity</h1>
      <p className="mb-6 text-slate-700">
        <span className="font-medium">{user.name ?? "User"}</span>
        <span className="text-slate-400"> · </span>
        <span className="text-slate-600">{user.email}</span>
      </p>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">This week (UTC)</h2>
        <p className="mb-4 text-2xl font-semibold text-black">
          Total: {formatSecondsAsHhMm(weekly.weekTotalSeconds)}
        </p>
        <ul className="grid max-w-xl gap-2 sm:grid-cols-2">
          {weekly.days.map((d) => (
            <li
              key={d.dateKey}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <span className="text-slate-600">
                {d.label} {d.dateKey}
              </span>
              <span className="font-medium text-slate-900">{formatSecondsAsHhMm(d.watchSeconds)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">By course (last 30 days, UTC)</h2>
        {byCourse.length === 0 ? (
          <p className="text-sm text-slate-500">No course-level watch data in this window.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3 text-right">Watch time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {byCourse.map((row) => (
                  <tr key={row.courseId}>
                    <td className="px-4 py-3 font-medium text-slate-900">{row.title}</td>
                    <td className="px-4 py-3 text-right text-slate-800">
                      {formatSecondsAsHhMm(row.watchSeconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
