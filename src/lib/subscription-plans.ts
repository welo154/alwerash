export type SubscriptionPlanId = "studio" | "starter" | "pro";

/** One membership price for every plan card. Paymob charges EGP, Stripe charges USD. */
export const MEMBERSHIP_PRICE = {
  egp: 1000,
  usd: 50,
  durationMonths: 12,
} as const;

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  /** Egyptian pound amount charged through Paymob. */
  price: number;
  /** US dollar amount charged through Stripe. */
  priceUsd: number;
  durationMonths: number;
  popular?: boolean;
  accentFeatureCount: number;
  accentChooseButton?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "studio",
    name: "Studio",
    price: MEMBERSHIP_PRICE.egp,
    priceUsd: MEMBERSHIP_PRICE.usd,
    durationMonths: MEMBERSHIP_PRICE.durationMonths,
    accentFeatureCount: 1,
  },
  {
    id: "starter",
    name: "Starter",
    price: MEMBERSHIP_PRICE.egp,
    priceUsd: MEMBERSHIP_PRICE.usd,
    durationMonths: MEMBERSHIP_PRICE.durationMonths,
    popular: true,
    accentFeatureCount: 2,
    accentChooseButton: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: MEMBERSHIP_PRICE.egp,
    priceUsd: MEMBERSHIP_PRICE.usd,
    durationMonths: MEMBERSHIP_PRICE.durationMonths,
    accentFeatureCount: 3,
  },
];

const PLAN_IDS = new Set(SUBSCRIPTION_PLANS.map((plan) => plan.id));

export function isSubscriptionPlanId(value: string): value is SubscriptionPlanId {
  return PLAN_IDS.has(value as SubscriptionPlanId);
}

export function getSubscriptionPlan(planId: string) {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId);
}
