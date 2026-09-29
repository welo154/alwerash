"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSubscriptionPlan, isSubscriptionPlanId } from "@/lib/subscription-plans";
import {
  grantSelfServeEntitlement,
  isSelfServeGrantEnabled,
} from "@/server/subscription/entitlement.service";

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

  // Without a verified payment there is nothing to activate. Send the learner to
  // checkout instead of silently granting paid access.
  if (!isSelfServeGrantEnabled()) {
    redirect(`/subscription?error=payment_required&plan=${encodeURIComponent(plan.id)}`);
  }

  await grantSelfServeEntitlement(session.user.id, plan.durationMonths);
  redirect("/home?toast=Subscribed");
}
