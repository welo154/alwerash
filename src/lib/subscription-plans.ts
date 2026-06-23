export type SubscriptionPlanId = "studio" | "starter" | "pro";

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  price: number;
  durationMonths: number;
  popular?: boolean;
  accentFeatureCount: number;
  accentChooseButton?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "studio",
    name: "Studio",
    price: 150,
    durationMonths: 1,
    accentFeatureCount: 1,
  },
  {
    id: "starter",
    name: "Starter",
    price: 200,
    durationMonths: 1,
    popular: true,
    accentFeatureCount: 2,
    accentChooseButton: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 250,
    durationMonths: 1,
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
