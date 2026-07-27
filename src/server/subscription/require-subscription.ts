/**
 * Require user to be logged in and have an active subscription.
 * Admins bypass the subscription check.
 * Redirects to login or subscription/pricing when not allowed.
 */
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { hasActiveSubscription } from "./access.service";

export type RequireSubscriptionOptions = {
  /** Where to send the user after login / subscribe. */
  next?: string;
};

export async function requireSubscription(
  options?: RequireSubscriptionOptions
): Promise<Session> {
  const nextPath = options?.next ?? "/subscription";
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  const roles = (session.user as { roles?: string[] }).roles ?? [];
  if (roles.includes("ADMIN")) return session;

  const hasAccess = await hasActiveSubscription(session.user.id);
  if (!hasAccess) {
    redirect(
      `/subscription?message=subscribe&next=${encodeURIComponent(nextPath)}`
    );
  }

  return session;
}
