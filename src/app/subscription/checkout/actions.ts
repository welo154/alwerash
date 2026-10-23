"use server";

import { redirect } from "next/navigation";
import { requirePageSession } from "@/server/auth/live-session";
import { isSubscriptionPlanId } from "@/lib/subscription-plans";
import {
  isCheckoutProviderKey,
  recordCheckoutAttempt,
} from "@/server/subscription/checkout-attempt";
import { RATE_LIMITS, consumeRateLimit } from "@/server/security/rate-limit";

export async function requestCheckout(formData: FormData) {
  const session = await requirePageSession("/subscription");
  const planId = String(formData.get("planId") ?? "");
  const provider = String(formData.get("provider") ?? "");

  if (!isSubscriptionPlanId(planId) || !isCheckoutProviderKey(provider)) {
    redirect("/subscription?error=invalid");
  }

  const limited = await consumeRateLimit(RATE_LIMITS.checkoutPerUser, session.user.id);
  if (!limited.allowed) {
    redirect(
      `/subscription/checkout?plan=${encodeURIComponent(planId)}&error=rate_limited`
    );
  }

  await recordCheckoutAttempt({ userId: session.user.id, planId, provider });
  redirect(
    `/subscription/checkout?plan=${encodeURIComponent(planId)}&provider=${provider}&saved=1`
  );
}
