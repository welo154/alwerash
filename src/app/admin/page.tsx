// file: src/app/admin/page.tsx
import Link from "next/link";
import { requireRole } from "@/server/auth/require";

export default async function AdminPage() {
  const session = await requireRole(["ADMIN"]); // defense-in-depth (middleware also blocks)
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-sm">Hello {session.user.email}</p>
      <div className="flex flex-col gap-2">
        <Link
          className="inline-block w-fit rounded bg-black px-4 py-2 text-white no-underline"
          href="/admin/content"
        >
          Manage Content (Tracks, Courses)
        </Link>
        <Link className="underline" href="/dashboard">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
