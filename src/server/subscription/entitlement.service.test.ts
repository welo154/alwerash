/**
 * Payment-gate tests: entitlements must only activate from a verified provider
 * event, replays must be idempotent, and the dev self-grant must fail closed in
 * production.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const userFindUnique = vi.fn();
const paymentEventFindUnique = vi.fn();
const paymentEventUpsert = vi.fn();
const paymentEventUpdate = vi.fn();
const entitlementFindUnique = vi.fn();
const entitlementUpsert = vi.fn();

const tx = {
  paymentEvent: {
    upsert: (...a: unknown[]) => paymentEventUpsert(...a),
    update: (...a: unknown[]) => paymentEventUpdate(...a),
  },
  entitlement: {
    findUnique: (...a: unknown[]) => entitlementFindUnique(...a),
    upsert: (...a: unknown[]) => entitlementUpsert(...a),
  },
};

vi.mock("@/server/db/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => userFindUnique(...a) },
    paymentEvent: { findUnique: (...a: unknown[]) => paymentEventFindUnique(...a) },
    entitlement: { findUnique: (...a: unknown[]) => entitlementFindUnique(...a) },
    $transaction: async (fn: (t: typeof tx) => Promise<unknown>) => fn(tx),
  },
}));

const {
  grantEntitlementForVerifiedPayment,
  grantSelfServeEntitlement,
  isSelfServeGrantEnabled,
} = await import("./entitlement.service");
const { AppError } = await import("@/server/lib/errors");

beforeEach(() => {
  for (const fn of [
    userFindUnique,
    paymentEventFindUnique,
    paymentEventUpsert,
    paymentEventUpdate,
    entitlementFindUnique,
    entitlementUpsert,
  ]) {
    fn.mockReset();
  }
  userFindUnique.mockResolvedValue({ id: "user-1" });
  paymentEventFindUnique.mockResolvedValue(null);
  entitlementFindUnique.mockResolvedValue(null);
  entitlementUpsert.mockResolvedValue({});
  paymentEventUpsert.mockResolvedValue({});
  paymentEventUpdate.mockResolvedValue({});
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("grantEntitlementForVerifiedPayment", () => {
  it("activates an entitlement and marks the event processed", async () => {
    const res = await grantEntitlementForVerifiedPayment({
      provider: "PAYMOB",
      providerEventId: "evt-1",
      eventType: "TRANSACTION",
      userId: "user-1",
      durationMonths: 1,
    });

    expect(res.applied).toBe(true);
    expect(entitlementUpsert).toHaveBeenCalledTimes(1);
    const upsertArg = entitlementUpsert.mock.calls[0][0] as {
      create: { status: string };
    };
    expect(upsertArg.create.status).toBe("ACTIVE");
    expect(paymentEventUpdate).toHaveBeenCalledTimes(1);
    const updateArg = paymentEventUpdate.mock.calls[0][0] as {
      data: { status: string };
    };
    expect(updateArg.data.status).toBe("PROCESSED");
  });

  it("is idempotent: a replayed event does not extend access again", async () => {
    paymentEventFindUnique.mockResolvedValue({ status: "PROCESSED" });
    entitlementFindUnique.mockResolvedValue({ expiresAt: new Date("2030-01-01") });

    const res = await grantEntitlementForVerifiedPayment({
      provider: "PAYMOB",
      providerEventId: "evt-1",
      eventType: "TRANSACTION",
      userId: "user-1",
      durationMonths: 12,
    });

    expect(res.applied).toBe(false);
    expect(entitlementUpsert).not.toHaveBeenCalled();
  });

  it("stacks onto remaining time instead of truncating it", async () => {
    const remaining = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    entitlementFindUnique.mockResolvedValue({
      id: "ent-1",
      status: "ACTIVE",
      expiresAt: remaining,
    });

    await grantEntitlementForVerifiedPayment({
      provider: "PAYMOB",
      providerEventId: "evt-2",
      eventType: "TRANSACTION",
      userId: "user-1",
      durationMonths: 1,
    });

    const arg = entitlementUpsert.mock.calls[0][0] as {
      update: { expiresAt: Date };
    };
    expect(arg.update.expiresAt.getTime()).toBeGreaterThan(remaining.getTime());
  });

  it("rejects an unknown user", async () => {
    userFindUnique.mockResolvedValue(null);
    await expect(
      grantEntitlementForVerifiedPayment({
        provider: "PAYMOB",
        providerEventId: "evt-3",
        eventType: "TRANSACTION",
        userId: "ghost",
        durationMonths: 1,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("rejects a missing event id and an out-of-range duration", async () => {
    await expect(
      grantEntitlementForVerifiedPayment({
        provider: "PAYMOB",
        providerEventId: "  ",
        eventType: "TRANSACTION",
        userId: "user-1",
        durationMonths: 1,
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      grantEntitlementForVerifiedPayment({
        provider: "PAYMOB",
        providerEventId: "evt-4",
        eventType: "TRANSACTION",
        userId: "user-1",
        durationMonths: 999,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe("self-serve grant gate", () => {
  it("is disabled by default in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SUBSCRIPTION_SELF_GRANT_ENABLED", "");
    expect(isSelfServeGrantEnabled()).toBe(false);
  });

  it("refuses to grant in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SUBSCRIPTION_SELF_GRANT_ENABLED", "");
    await expect(grantSelfServeEntitlement("user-1", 12)).rejects.toBeInstanceOf(AppError);
    expect(entitlementUpsert).not.toHaveBeenCalled();
  });

  it("can be explicitly enabled for staging", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SUBSCRIPTION_SELF_GRANT_ENABLED", "true");
    expect(isSelfServeGrantEnabled()).toBe(true);
    await expect(grantSelfServeEntitlement("user-1", 1)).resolves.toBeTruthy();
  });

  it("stays available outside production so dev flows keep working", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("SUBSCRIPTION_SELF_GRANT_ENABLED", "");
    expect(isSelfServeGrantEnabled()).toBe(true);
  });
});
