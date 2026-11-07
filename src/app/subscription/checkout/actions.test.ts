/**
 * requestCheckout: validates input, rate-limits, and only redirects to Polar
 * with the signed-in user's own id. It never grants access itself.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

class Redirect extends Error {
  constructor(readonly url: string) {
    super(`redirect:${url}`);
  }
}
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Redirect(url);
  },
}));

const session = { user: { id: "user-1", email: "a@b.co", name: "Amal" } };
vi.mock("@/server/auth/live-session", () => ({ requirePageSession: async () => session }));

const consumeRateLimit = vi.fn();
vi.mock("@/server/security/rate-limit", () => ({
  RATE_LIMITS: { checkoutPerUser: { name: "checkout_user", limit: 10, windowSeconds: 3600 } },
  consumeRateLimit: (...a: unknown[]) => consumeRateLimit(...a),
}));

const recordCheckoutAttempt = vi.fn();
vi.mock("@/server/subscription/checkout-attempt", () => ({
  isCheckoutProviderKey: (v: string) => ["polar", "paymob", "stripe"].includes(v),
  recordCheckoutAttempt: (...a: unknown[]) => recordCheckoutAttempt(...a),
}));

const createPolarCheckoutUrl = vi.fn();
const isPolarConfigured = vi.fn();
vi.mock("@/server/payments/polar", () => ({
  createPolarCheckoutUrl: (...a: unknown[]) => createPolarCheckoutUrl(...a),
  isPolarConfigured: () => isPolarConfigured(),
}));
vi.mock("@/server/email/resend.client", () => ({ getAppBaseUrl: () => "https://alwerash.test" }));

const { requestCheckout } = await import("./actions");

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

async function redirectOf(fields: Record<string, string>): Promise<string> {
  try {
    await requestCheckout(form(fields));
  } catch (e) {
    if (e instanceof Redirect) return e.url;
    throw e;
  }
  throw new Error("expected a redirect");
}

beforeEach(() => {
  consumeRateLimit.mockReset().mockResolvedValue({ allowed: true });
  recordCheckoutAttempt.mockReset().mockResolvedValue(undefined);
  createPolarCheckoutUrl.mockReset().mockResolvedValue("https://polar.sh/checkout/abc");
  isPolarConfigured.mockReset().mockReturnValue(true);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("requestCheckout", () => {
  it("rejects an unknown plan or provider", async () => {
    expect(await redirectOf({ planId: "gold", provider: "polar" })).toBe("/subscription?error=invalid");
    expect(await redirectOf({ planId: "starter", provider: "paypal" })).toBe("/subscription?error=invalid");
    expect(createPolarCheckoutUrl).not.toHaveBeenCalled();
  });

  it("stops after too many attempts", async () => {
    consumeRateLimit.mockResolvedValue({ allowed: false });
    expect(await redirectOf({ planId: "starter", provider: "polar" })).toBe(
      "/subscription/checkout?plan=starter&error=rate_limited"
    );
    expect(consumeRateLimit).toHaveBeenCalledWith(expect.anything(), "user-1");
  });

  it("sends the signed-in user to Polar with their own id", async () => {
    expect(await redirectOf({ planId: "starter", provider: "polar" })).toBe("https://polar.sh/checkout/abc");
    expect(createPolarCheckoutUrl).toHaveBeenCalledWith({
      userId: "user-1",
      email: "a@b.co",
      name: "Amal",
      planId: "starter",
      baseUrl: "https://alwerash.test",
    });
    expect(recordCheckoutAttempt).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-1", provider: "polar", status: "REDIRECTED" })
    );
  });

  it("reports Polar as unavailable when it is not configured or errors", async () => {
    isPolarConfigured.mockReturnValue(false);
    expect(await redirectOf({ planId: "pro", provider: "polar" })).toBe(
      "/subscription/checkout?plan=pro&error=unavailable"
    );
    isPolarConfigured.mockReturnValue(true);
    createPolarCheckoutUrl.mockRejectedValue(new Error("polar down"));
    expect(await redirectOf({ planId: "pro", provider: "polar" })).toBe(
      "/subscription/checkout?plan=pro&error=unavailable"
    );
  });

  it("only records interest for providers that are not connected yet", async () => {
    expect(await redirectOf({ planId: "studio", provider: "paymob" })).toBe(
      "/subscription/checkout?plan=studio&provider=paymob&saved=1"
    );
    expect(createPolarCheckoutUrl).not.toHaveBeenCalled();
    expect(recordCheckoutAttempt).toHaveBeenCalledWith({ userId: "user-1", planId: "studio", provider: "paymob" });
  });
});
