// file: src/app/dashboard/page.tsx
import Link from "next/link";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="p-6">
        <Link className="underline" href="/login">Login</Link>
      </div>
    );
  }

  const isAdmin = (session.user.roles as string[] | undefined)?.includes("ADMIN");

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <pre className="rounded border p-3 text-sm">
        {JSON.stringify(session.user, null, 2)}
      </pre>
      <div className="flex flex-wrap gap-3">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- signout is an API route, not a page */}
        <a
          className="inline-block rounded bg-black px-4 py-2 text-white no-underline"
          href="/api/auth/signout?callbackUrl=/login"
        >
          Logout
        </a>
        {isAdmin && (
          <Link
            className="inline-block rounded border border-black px-4 py-2 no-underline hover:bg-zinc-100"
            href="/admin/content"
          >
            Manage Content (Tracks, Courses)
          </Link>
        )}
        {isAdmin && (
          <Link className="underline" href="/admin">Admin</Link>
        )}
      </div>
    </div>
  );
}
