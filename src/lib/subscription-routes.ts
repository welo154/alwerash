import type { SubscriptionPlanId } from "@/lib/subscription-plans";

/** Pricing cards. Get Started and Sign up land here before an account exists. */
export const SUBSCRIPTION_PRICING_PATH = "/subscription";

export function subscriptionCheckoutPath(planId: SubscriptionPlanId): string {
  return `/subscription/checkout?plan=${encodeURIComponent(planId)}`;
}
