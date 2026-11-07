/**
 * Polar webhook: only verified, paid orders for the membership product grant
 * access, refunds take it back, and failures are answered so Polar retries
 * only what a retry can fix.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const validateEvent = vi.fn();
class PolarWebhookError extends Error {}
class PolarWebhookVerificationError extends PolarWebhookError {}
class PolarWebhookUnknownTypeError extends PolarWebhookError {}

vi.mock("@polar-sh/sdk/2026-10", () => ({
  webhooks: {
    validateEvent: (...a: unknown[]) => validateEvent(...a),
    PolarWebhookError,
    PolarWebhookVerificationError,
    PolarWebhookUnknownTypeError,
  },
}));

const grant = vi.fn();
const reverse = vi.fn();
vi.mock("@/server/subscription/entitlement.service", () => ({
  grantEntitlementForVerifiedPayment: (...a: unknown[]) => grant(...a),
  reverseEntitlementForRefund: (...a: unknown[]) => reverse(...a),
}));

const { POST } = await import("./route");
const { AppError } = await import("@/server/lib/errors");

const PRODUCT = "prod_membership";

function order(overrides: Record<string, unknown> = {}) {
  return {
    id: "ord_1",
    status: "paid",
    paid: true,
    product_id: PRODUCT,
    metadata: { userId: "meta-user" },
    customer: { external_id: "user-1" },
    ...overrides,
  };
}

function post() {
  return POST(
    new NextRequest("https://alwerash.test/api/webhooks/polar", {
      method: "POST",
      body: "{}",
      headers: { "webhook-id": "id", "webhook-timestamp": "1", "webhook-signature": "sig" },
    })
  );
}

beforeEach(() => {
  vi.stubEnv("POLAR_WEBHOOK_SECRET", "whsec");
  vi.stubEnv("POLAR_PRODUCT_ID", PRODUCT);
  validateEvent.mockReset();
  grant.mockReset().mockResolvedValue({ applied: true, expiresAt: new Date() });
  reverse.mockReset().mockResolvedValue({ applied: true });
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/webhooks/polar", () => {
  it("refuses to run without a webhook secret", async () => {
    vi.stubEnv("POLAR_WEBHOOK_SECRET", "");
    expect((await post()).status).toBe(500);
    expect(validateEvent).not.toHaveBeenCalled();
  });

  it("rejects an invalid signature without granting anything", async () => {
    validateEvent.mockRejectedValue(new PolarWebhookVerificationError("bad"));
    expect((await post()).status).toBe(403);
    expect(grant).not.toHaveBeenCalled();
  });

  it("acknowledges event types it does not know", async () => {
    validateEvent.mockRejectedValue(new PolarWebhookUnknownTypeError("new"));
    expect((await post()).status).toBe(202);
  });

  it("grants 12 months for a paid membership order, keyed to the external customer id", async () => {
    validateEvent.mockResolvedValue({ type: "order.paid", data: order() });
    expect((await post()).status).toBe(200);
    expect(grant).toHaveBeenCalledWith({
      provider: "POLAR",
      providerEventId: "order:ord_1",
      eventType: "order.paid",
      userId: "user-1",
      durationMonths: 12,
    });
  });

  it("falls back to the checkout metadata user id", async () => {
    validateEvent.mockResolvedValue({ type: "order.paid", data: order({ customer: {} }) });
    await post();
    expect(grant.mock.calls[0][0].userId).toBe("meta-user");
  });

  it.each([
    ["an unpaid order", { paid: false }],
    ["another product", { product_id: "prod_other" }],
    ["an order with no user", { customer: {}, metadata: {} }],
  ])("ignores %s", async (_label, overrides) => {
    validateEvent.mockResolvedValue({ type: "order.paid", data: order(overrides) });
    expect((await post()).status).toBe(200);
    expect(grant).not.toHaveBeenCalled();
  });

  it("reverses access for a refunded membership order", async () => {
    validateEvent.mockResolvedValue({ type: "order.refunded", data: order({ status: "refunded" }) });
    expect((await post()).status).toBe(200);
    expect(reverse).toHaveBeenCalledWith(
      expect.objectContaining({ providerEventId: "refund:ord_1", userId: "user-1", durationMonths: 12 })
    );
  });

  it("ignores a partial refund", async () => {
    validateEvent.mockResolvedValue({ type: "order.refunded", data: order({ status: "partially_refunded" }) });
    await post();
    expect(reverse).not.toHaveBeenCalled();
  });

  it("acknowledges errors a retry cannot fix, such as an unknown user", async () => {
    validateEvent.mockResolvedValue({ type: "order.paid", data: order() });
    grant.mockRejectedValue(new AppError("NOT_FOUND", 404, "User not found"));
    expect((await post()).status).toBe(200);
  });

  it("returns 500 on unexpected failures so Polar retries", async () => {
    validateEvent.mockResolvedValue({ type: "order.paid", data: order() });
    grant.mockRejectedValue(new Error("database down"));
    expect((await post()).status).toBe(500);
  });
});
