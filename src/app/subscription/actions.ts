"use server";

import { redirect } from "next/navigation";
import { withNext } from "@/lib/safe-internal-path";
import { isSubscriptionPlanId } from "@/lib/subscription-plans";
import { subscriptionCheckoutPath } from "@/lib/subscription-routes";
import { rememberPostAuthNext } from "@/server/auth/post-auth-next";
import { readLiveSession } from "@/server/auth/live-session";

export async function chooseSubscriptionPlan(formData: FormData) {
  const planId = String(formData.get("planId") ?? "");
  if (!isSubscriptionPlanId(planId)) {
    redirect("/subscription?error=invalid");
  }

  const checkoutPath = subscriptionCheckoutPath(planId);
  const live = await readLiveSession();

  if (live.state === "revoked") {
    redirect(`/login?error=device_revoked&next=${encodeURIComponent(checkoutPath)}`);
  }

  if (live.state !== "active") {
    await rememberPostAuthNext(checkoutPath);
    redirect(withNext("/register", checkoutPath));
  }

  redirect(checkoutPath);
}
