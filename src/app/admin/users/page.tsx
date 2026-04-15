import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import { adminListUsersForActivity } from "@/server/home/learning-activity.service";

export default async function AdminUsersPage() {
  await requireRole(["ADMIN"]);
  const users = await adminListUsersForActivity();

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-black">Learners &amp; activity</h1>
      <p className="mb-6 max-w-2xl text-sm text-slate-600">
        Open a user to see UTC week totals and watch time by course (rolling window).
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-right">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium text-slate-900">{u.name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-700">{u.email}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/users/${u.id}/activity`}
                    className="font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
