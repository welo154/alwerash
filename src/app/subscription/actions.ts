"use server";

import { redirect } from "next/navigation";
import { requirePageSession } from "@/server/auth/live-session";
import { isSubscriptionPlanId } from "@/lib/subscription-plans";

export async function chooseSubscriptionPlan(formData: FormData) {
  await requirePageSession("/subscription");

  const planId = String(formData.get("planId") ?? "");
  if (!isSubscriptionPlanId(planId)) {
    redirect("/subscription?error=invalid");
  }

  // Placeholder only. Paymob and Stripe are not called, and access is not granted.
  redirect(`/subscription/checkout?plan=${encodeURIComponent(planId)}`);
}
