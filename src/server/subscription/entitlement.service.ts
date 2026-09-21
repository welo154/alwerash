/**
 * Entitlement activation.
 *
 * `grantEntitlementForVerifiedPayment` is the only path that should activate
 * paid access in production. It is idempotent: a provider may deliver the same
 * event more than once, and replays must not extend access repeatedly.
 *
 * The self-serve grant used during development is gated behind
 * SUBSCRIPTION_SELF_GRANT_ENABLED and defaults to OFF in production.
 */
import type { Prisma, SubscriptionProvider } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";

export const ENTITLEMENT_PRODUCT = "ALL_ACCESS" as const;

/**
 * Whether a learner may grant themselves an entitlement without a verified
 * payment. Explicit env value wins; otherwise allowed outside production only,
 * so local and staging flows keep working.
 */
export function isSelfServeGrantEnabled(): boolean {
  const raw = process.env.SUBSCRIPTION_SELF_GRANT_ENABLED?.trim().toLowerCase();
  if (raw === "true" || raw === "1") return true;
  if (raw === "false" || raw === "0") return false;
  return process.env.NODE_ENV !== "production";
}

export function addMonths(date: Date, months: number): Date {
  const out = new Date(date);
  out.setMonth(out.getMonth() + months);
  return out;
}

/**
 * Extend an ACTIVE, unexpired entitlement, or (re)activate one. Never shortens
 * an existing expiry.
 */
async function upsertActiveEntitlement(
  tx: Prisma.TransactionClient,
  userId: string,
  durationMonths: number,
  now: Date
): Promise<Date> {
  const candidateExpiry = addMonths(now, durationMonths);

  const existing = await tx.entitlement.findUnique({
    where: { userId_product: { userId, product: ENTITLEMENT_PRODUCT } },
  });

  const remaining =
    existing?.status === "ACTIVE" && existing.expiresAt && existing.expiresAt > now
      ? existing.expiresAt
      : null;

  // Stack onto remaining time rather than discarding it.
  const stacked = addMonths(remaining ?? now, durationMonths);
  const finalExpiry = stacked > candidateExpiry ? stacked : candidateExpiry;

  await tx.entitlement.upsert({
    where: { userId_product: { userId, product: ENTITLEMENT_PRODUCT } },
    create: {
      userId,
      product: ENTITLEMENT_PRODUCT,
      status: "ACTIVE",
      expiresAt: finalExpiry,
    },
    update: {
      status: "ACTIVE",
      expiresAt: finalExpiry,
      updatedAt: now,
    },
  });

  return finalExpiry;
}

/**
 * Activate paid access in response to an already-verified provider event.
 *
 * Callers MUST verify the provider signature (HMAC for Paymob) before calling.
 * This function does not trust amounts or plan data from the client.
 *
 * Returns `applied: false` when the event was already processed.
 */
export async function grantEntitlementForVerifiedPayment(params: {
  provider: SubscriptionProvider;
  providerEventId: string;
  eventType: string;
  userId: string;
  durationMonths: number;
}): Promise<{ applied: boolean; expiresAt: Date | null }> {
  const { provider, providerEventId, eventType, userId, durationMonths } = params;

  if (!providerEventId.trim()) {
    throw new AppError("BAD_REQUEST", 400, "Missing provider event id");
  }
  if (!Number.isInteger(durationMonths) || durationMonths <= 0 || durationMonths > 24) {
    throw new AppError("BAD_REQUEST", 400, "Invalid entitlement duration");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) throw new AppError("NOT_FOUND", 404, "User not found");

  const alreadyProcessed = await prisma.paymentEvent.findUnique({
    where: { provider_providerEventId: { provider, providerEventId } },
    select: { status: true },
  });
  if (alreadyProcessed?.status === "PROCESSED") {
    const current = await prisma.entitlement.findUnique({
      where: { userId_product: { userId, product: ENTITLEMENT_PRODUCT } },
      select: { expiresAt: true },
    });
    return { applied: false, expiresAt: current?.expiresAt ?? null };
  }

  const now = new Date();

  return prisma.$transaction(async (tx) => {
    // Claim the event first so concurrent deliveries collide here, not on the
    // entitlement write.
    await tx.paymentEvent.upsert({
      where: { provider_providerEventId: { provider, providerEventId } },
      create: {
        provider,
        providerEventId,
        type: eventType,
        status: "RECEIVED",
      },
      update: {},
    });

    const expiresAt = await upsertActiveEntitlement(tx, userId, durationMonths, now);

    await tx.paymentEvent.update({
      where: { provider_providerEventId: { provider, providerEventId } },
      data: { status: "PROCESSED", processedAt: now },
    });

    return { applied: true, expiresAt };
  });
}

/**
 * Development-only self grant. Throws in production unless explicitly enabled.
 */
export async function grantSelfServeEntitlement(
  userId: string,
  durationMonths: number
): Promise<{ expiresAt: Date }> {
  if (!isSelfServeGrantEnabled()) {
    throw new AppError(
      "FORBIDDEN",
      403,
      "Subscriptions require a completed payment"
    );
  }

  const now = new Date();
  const expiresAt = await prisma.$transaction((tx) =>
    upsertActiveEntitlement(tx, userId, durationMonths, now)
  );

  return { expiresAt };
}
