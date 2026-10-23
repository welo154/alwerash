"use server";

import { redirect } from "next/navigation";
import { requirePageSession } from "@/server/auth/live-session";
import { isSubscriptionPlanId } from "@/lib/subscription-plans";
import {
  isCheckoutProviderKey,
  recordCheckoutAttempt,
} from "@/server/subscription/checkout-attempt";
import { createPolarCheckoutUrl, isPolarConfigured } from "@/server/payments/polar";
import { getAppBaseUrl } from "@/server/email/resend.client";
import { RATE_LIMITS, consumeRateLimit } from "@/server/security/rate-limit";

export async function requestCheckout(formData: FormData) {
  const session = await requirePageSession("/subscription");
  const planId = String(formData.get("planId") ?? "");
  const provider = String(formData.get("provider") ?? "");

  if (!isSubscriptionPlanId(planId) || !isCheckoutProviderKey(provider)) {
    redirect("/subscription?error=invalid");
  }

  const checkoutPage = `/subscription/checkout?plan=${encodeURIComponent(planId)}`;
  const limited = await consumeRateLimit(RATE_LIMITS.checkoutPerUser, session.user.id);
  if (!limited.allowed) {
    redirect(`${checkoutPage}&error=rate_limited`);
  }

  if (provider === "polar") {
    if (!isPolarConfigured() || !session.user.email) {
      redirect(`${checkoutPage}&error=unavailable`);
    }
    let url: string;
    try {
      url = await createPolarCheckoutUrl({
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name ?? null,
        planId,
        baseUrl: getAppBaseUrl(),
      });
    } catch (error) {
      console.error("[checkout] Polar checkout could not be created", error);
      redirect(`${checkoutPage}&error=unavailable`);
    }
    await recordCheckoutAttempt({ userId: session.user.id, planId, provider, status: "REDIRECTED" });
    redirect(url);
  }

  await recordCheckoutAttempt({ userId: session.user.id, planId, provider });
  redirect(`${checkoutPage}&provider=${provider}&saved=1`);
}
