/**
 * Subscribe user without payment (for now). Creates or extends an Entitlement.
 * You can replace this with real payment flow later.
 */
import { prisma } from "@/server/db/prisma";

const ENTITLEMENT_PRODUCT = "ALL_ACCESS" as const;

function addMonths(date: Date, months: number): Date {
  const out = new Date(date);
  out.setMonth(out.getMonth() + months);
  return out;
}

/**
 * Grant or extend subscription for a user (no payment).
 * durationMonths: 1, 6, or 12 (from bundle).
 */
export async function createFreeEntitlement(
  userId: string,
  durationMonths: number
): Promise<{ expiresAt: Date }> {
  const now = new Date();
  const expiresAt = addMonths(now, durationMonths);

  const existing = await prisma.entitlement.findUnique({
    where: { userId_product: { userId, product: ENTITLEMENT_PRODUCT } },
  });

  if (existing && existing.status === "ACTIVE" && existing.expiresAt && existing.expiresAt > now) {
    // Extend if new expiry is later
    const newExpiresAt = existing.expiresAt > expiresAt ? existing.expiresAt : expiresAt;
    await prisma.entitlement.update({
      where: { id: existing.id },
      data: { expiresAt: newExpiresAt, updatedAt: now },
    });
    return { expiresAt: newExpiresAt };
  }

  await prisma.entitlement.upsert({
    where: { userId_product: { userId, product: ENTITLEMENT_PRODUCT } },
    create: {
      userId,
      product: ENTITLEMENT_PRODUCT,
      status: "ACTIVE",
      expiresAt,
    },
    update: {
      status: "ACTIVE",
      expiresAt,
      updatedAt: now,
    },
  });

  return { expiresAt };
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
