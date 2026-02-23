"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createFreeEntitlement } from "@/server/subscription/subscribe.service";
import { BUNDLES } from "@/lib/subscription-plans";

const VALID_BUNDLE_IDS = new Set(BUNDLES.map((b) => b.id));

/**
 * Subscribe the current user to a bundle (no payment for now).
 * Redirects to login if not authenticated, then to /learn after success.
 * Called from form with field bundleId.
 */
export async function subscribeWithBundle(formData: FormData) {
  const bundleId = String(formData.get("bundleId") ?? "").trim();
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?next=" + encodeURIComponent("/subscription"));
  }

  if (!VALID_BUNDLE_IDS.has(bundleId)) {
    redirect("/subscription?error=invalid");
  }

  const bundle = BUNDLES.find((b) => b.id === bundleId);
  if (!bundle) {
    redirect("/subscription?error=invalid");
  }

  await createFreeEntitlement(session.user.id, bundle.durationMonths);
  redirect("/learn?subscribed=1&toast=Subscribed+successfully");
}
