import { requireRole } from "@/server/auth/require";
import { adminWatchTimeByCourse } from "@/server/content/admin-analytics.service";

export const dynamic = "force-dynamic";

const numberFormat = new Intl.NumberFormat("en-US");

function formatHours(seconds: number) {
  return `${(seconds / 3600).toFixed(1)} h`;
}

export default async function AdminAnalyticsPage() {
  await requireRole(["ADMIN"]);
  const { courses, totalSeconds, totalMinutes } = await adminWatchTimeByCourse();
  const maxSeconds = courses[0]?.seconds ?? 0;
  const watchedCourses = courses.filter((c) => c.seconds > 0).length;

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-black">Watch time</h1>
      <p className="mb-6 max-w-2xl text-sm text-slate-600">
        Minutes of video watched by all learners, summed across every course and for each course.
      </p>

      <div className="mb-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total, all courses
          </p>
          <p className="mt-1 text-4xl font-bold text-black">
            {numberFormat.format(totalMinutes)} <span className="text-xl font-semibold">min</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">{formatHours(totalSeconds)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Courses watched
          </p>
          <p className="mt-1 text-4xl font-bold text-black">
            {watchedCourses}
            <span className="text-xl font-semibold text-slate-400"> / {courses.length}</span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3 text-right">Minutes</th>
              <th className="px-4 py-3 text-right">Hours</th>
              <th className="px-4 py-3 text-right">Learners</th>
              <th className="w-[30%] px-4 py-3">Share of total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No courses yet.
                </td>
              </tr>
            ) : (
              courses.map((c) => {
                const share = totalSeconds > 0 ? (c.seconds / totalSeconds) * 100 : 0;
                const bar = maxSeconds > 0 ? (c.seconds / maxSeconds) * 100 : 0;
                return (
                  <tr key={c.courseId} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{c.title}</span>
                      {!c.published ? (
                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                          Draft
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900">
                      {numberFormat.format(c.minutes)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                      {formatHours(c.seconds)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                      {numberFormat.format(c.learners)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[var(--color-primary)]"
                            style={{ width: `${bar}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-xs tabular-nums text-slate-500">
                          {share.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Each course uses whichever record is more complete: per-lesson progress or daily totals.
      </p>
    </div>
  );
}
