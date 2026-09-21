/**
 * Require user to be logged in and have an active subscription.
 * Admins bypass the subscription check.
 * Redirects to login or subscription/pricing when not allowed.
 */
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { AppError } from "@/server/lib/errors";
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

/**
 * API-route variant: throws AppError (401/403) instead of redirecting, so
 * fetch callers receive JSON status codes rather than an HTML page.
 * Admins bypass the subscription check, matching `requireSubscription`.
 */
export async function requireSubscriptionApi(): Promise<Session> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AppError("UNAUTHORIZED", 401, "Unauthorized");
  }

  const roles = (session.user as { roles?: string[] }).roles ?? [];
  if (roles.includes("ADMIN")) return session;

  const hasAccess = await hasActiveSubscription(session.user.id);
  if (!hasAccess) {
    throw new AppError("FORBIDDEN", 403, "Subscription required");
  }

  return session;
}
