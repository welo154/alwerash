import { describe, expect, it } from "vitest";
import { amountForProvider, isCheckoutProviderKey } from "./checkout-attempt";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";

describe("checkout placeholder", () => {
  const plan = SUBSCRIPTION_PLANS[0];

  it("accepts only Paymob and Stripe", () => {
    expect(isCheckoutProviderKey("paymob")).toBe(true);
    expect(isCheckoutProviderKey("stripe")).toBe(true);
    expect(isCheckoutProviderKey("paypal")).toBe(false);
  });

  it("records 1000 EGP for Paymob and 50 USD for Stripe", () => {
    expect(amountForProvider(plan, "paymob")).toBe(1000);
    expect(amountForProvider(plan, "stripe")).toBe(50);
  });
});
