/**
 * Records that a signed-in learner chose Paymob or Stripe.
 *
 * This does not call either provider and does not grant access. The buttons stay
 * placeholders until the company accounts exist; swapping this recorder for a real
 * checkout later is the only change the page needs.
 */
import type { SubscriptionProvider } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { getSubscriptionPlan, type SubscriptionPlan } from "@/lib/subscription-plans";

export const CHECKOUT_PROVIDERS = {
  paymob: { provider: "PAYMOB" as const, currency: "EGP" as const, label: "Paymob" },
  stripe: { provider: "STRIPE" as const, currency: "USD" as const, label: "Stripe" },
};

export type CheckoutProviderKey = keyof typeof CHECKOUT_PROVIDERS;

export function isCheckoutProviderKey(value: string): value is CheckoutProviderKey {
  return value === "paymob" || value === "stripe";
}

/** Paymob stores the EGP price. Stripe stores the USD price. Neither value is a charge. */
export function amountForProvider(plan: SubscriptionPlan, provider: CheckoutProviderKey): number {
  return provider === "paymob" ? plan.price : plan.priceUsd;
}

export async function recordCheckoutAttempt(input: {
  userId: string;
  planId: string;
  provider: CheckoutProviderKey;
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
        status: "COMING_SOON",
      },
    });
    return { saved: true };
  } catch (error) {
    // The table arrives with the migration. The screen still confirms the choice.
    console.error("[checkout] could not store the attempt", error);
    return { saved: false };
  }
}
