/**
 * Require user to be logged in and have active subscription.
 * Admins bypass the subscription check.
 * Redirects to login or subscription page if not allowed.
 */
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasActiveSubscription } from "./access.service";

export async function requireSubscription() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?next=" + encodeURIComponent("/subscription"));
  }
  const roles = (session.user as { roles?: string[] }).roles ?? [];
  if (roles.includes("ADMIN")) return session;
  const hasAccess = await hasActiveSubscription(session.user.id);
  if (!hasAccess) {
    redirect("/subscription?message=subscribe");
  }
  return session;
}
