/**
 * Subscription status reads, plus the legacy self-serve grant entry point.
 *
 * Activation logic lives in `entitlement.service.ts`. This module keeps the
 * historical `createFreeEntitlement` name so existing callers keep working,
 * but it now goes through the gated path and is refused in production unless
 * SUBSCRIPTION_SELF_GRANT_ENABLED is set.
 */
import { prisma } from "@/server/db/prisma";
import {
  ENTITLEMENT_PRODUCT,
  grantSelfServeEntitlement,
} from "./entitlement.service";

/**
 * Grant or extend subscription for a user without payment.
 *
 * @deprecated Development/staging only. Production activation must come from a
 * verified provider event via `grantEntitlementForVerifiedPayment`.
 */
export async function createFreeEntitlement(
  userId: string,
  durationMonths: number
): Promise<{ expiresAt: Date }> {
  return grantSelfServeEntitlement(userId, durationMonths);
}

/**
 * Get subscription status for display (profile, etc.).
 */
export async function getSubscriptionStatus(userId: string): Promise<{
  active: boolean;
  expiresAt: Date | null;
  source: "entitlement" | "subscription" | null;
}> {
  const now = new Date();

  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      currentPeriodEnd: { gt: now },
    },
    orderBy: { currentPeriodEnd: "desc" },
    select: { currentPeriodEnd: true },
  });
  if (sub) {
    return { active: true, expiresAt: sub.currentPeriodEnd, source: "subscription" };
  }

  const ent = await prisma.entitlement.findFirst({
    where: {
      userId,
      product: ENTITLEMENT_PRODUCT,
      status: "ACTIVE",
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    select: { expiresAt: true },
  });
  if (ent) {
    return { active: true, expiresAt: ent.expiresAt, source: "entitlement" };
  }

  return { active: false, expiresAt: null, source: null };
}
