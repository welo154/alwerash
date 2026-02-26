/**
 * Check if a user has active subscription/entitlement to access courses.
 * User must have active Subscription (currentPeriodEnd > now) or
 * active Entitlement (status ACTIVE, expiresAt > now or null).
 */
import { prisma } from "@/server/db/prisma";

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const now = new Date();

  // Run both checks in parallel so we only wait for the slower of the two
  const [activeSub, activeEntitlement] = await Promise.all([
    prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        currentPeriodEnd: { gt: now },
      },
    }),
    prisma.entitlement.findFirst({
      where: {
        userId,
        product: "ALL_ACCESS",
        status: "ACTIVE",
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    }),
  ]);

  return Boolean(activeSub ?? activeEntitlement);
}
