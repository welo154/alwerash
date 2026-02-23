/**
 * Check if a user has active subscription/entitlement to access courses.
 * User must have active Subscription (currentPeriodEnd > now) or
 * active Entitlement (status ACTIVE, expiresAt > now or null).
 */
import { prisma } from "@/server/db/prisma";

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const now = new Date();

  // Check Subscription - active status and currentPeriodEnd in future
  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      currentPeriodEnd: { gt: now },
    },
  });
  if (activeSub) return true;

  // Check Entitlement - ALL_ACCESS, ACTIVE, not expired
  const activeEntitlement = await prisma.entitlement.findFirst({
    where: {
      userId,
      product: "ALL_ACCESS",
      status: "ACTIVE",
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
  });
  if (activeEntitlement) return true;

  return false;
}
