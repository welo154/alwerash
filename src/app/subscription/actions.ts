"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSubscriptionPlan, isSubscriptionPlanId } from "@/lib/subscription-plans";
import { createFreeEntitlement } from "@/server/subscription/subscribe.service";

export async function chooseSubscriptionPlan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?next=" + encodeURIComponent("/subscription"));
  }

  const planId = String(formData.get("planId") ?? "");
  if (!isSubscriptionPlanId(planId)) {
    redirect("/subscription?error=invalid");
  }

  const plan = getSubscriptionPlan(planId);
  if (!plan) {
    redirect("/subscription?error=invalid");
  }

  await createFreeEntitlement(session.user.id, plan.durationMonths);
  redirect("/home?toast=Subscribed");
}
