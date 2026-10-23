/**
 * Records which payment option a signed-in learner chose.
 *
 * Polar is live: the attempt is logged and the learner is sent to Polar's hosted
 * checkout. Paymob and Stripe stay placeholders that only save the choice. No
 * attempt grants access; that comes only from a verified provider webhook.
 */
import type { SubscriptionProvider } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { getSubscriptionPlan, type SubscriptionPlan } from "@/lib/subscription-plans";

export const CHECKOUT_PROVIDERS = {
  paymob: { provider: "PAYMOB" as const, currency: "EGP" as const, label: "Paymob" },
  stripe: { provider: "STRIPE" as const, currency: "USD" as const, label: "Stripe" },
  polar: { provider: "POLAR" as const, currency: "USD" as const, label: "Polar" },
};

export type CheckoutProviderKey = keyof typeof CHECKOUT_PROVIDERS;

export function isCheckoutProviderKey(value: string): value is CheckoutProviderKey {
  return value === "paymob" || value === "stripe" || value === "polar";
}

/** Paymob stores the EGP price. Stripe and Polar store the USD price. */
export function amountForProvider(plan: SubscriptionPlan, provider: CheckoutProviderKey): number {
  return provider === "paymob" ? plan.price : plan.priceUsd;
}

export async function recordCheckoutAttempt(input: {
  userId: string;
  planId: string;
  provider: CheckoutProviderKey;
  status?: "COMING_SOON" | "REDIRECTED";
}): Promise<{ saved: boolean }> {
  const plan = getSubscriptionPlan(input.planId);
  if (!plan) return { saved: false };

  const chosen = CHECKOUT_PROVIDERS[input.provider];
  try {
    await prisma.checkoutAttempt.create({
      data: {
        userId: input.userId,
        planId: plan.id,
        provider: chosen.provider satisfies SubscriptionProvider,
        currency: chosen.currency,
        amount: amountForProvider(plan, input.provider),
        status: input.status ?? "COMING_SOON",
      },
    });
    return { saved: true };
  } catch (error) {
    // The table arrives with the migration. The screen still confirms the choice.
    console.error("[checkout] could not store the attempt", error);
    return { saved: false };
  }
}
