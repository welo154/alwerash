import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/settings");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">
          Edit your name, country, and profile picture on your Profile page.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/profile"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit profile
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
