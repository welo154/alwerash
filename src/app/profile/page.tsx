import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getSubscriptionStatus } from "@/server/subscription/subscribe.service";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/profile");

  const user = session.user;
  const subscription = await getSubscriptionStatus(user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-500">Name</label>
            <p className="mt-1 text-slate-900">{user.name ?? "—"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500">Email</label>
            <p className="mt-1 text-slate-900">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500">Subscription</label>
            {subscription.active ? (
              <p className="mt-1 text-slate-900">
                You are subscribed
                {subscription.expiresAt
                  ? ` until ${subscription.expiresAt.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}`
                  : ""}
                .
              </p>
            ) : (
              <p className="mt-1 text-slate-600">No active subscription.</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {subscription.active && (
            <Link
              href="/learn"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              My courses
            </Link>
          )}
          <Link
            href="/settings"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Settings
          </Link>
          {!subscription.active && (
            <Link
              href="/subscription"
              className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              Subscribe
            </Link>
          )}
          <Link
            href="/"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
