import { describe, expect, it } from "vitest";
import { safeInternalPath, withNext } from "./safe-internal-path";
import { SUBSCRIPTION_PRICING_PATH, subscriptionCheckoutPath } from "./subscription-routes";

describe("subscription entry routes", () => {
  it("keeps pricing and checkout on this site", () => {
    expect(SUBSCRIPTION_PRICING_PATH).toBe("/subscription");
    expect(subscriptionCheckoutPath("starter")).toBe("/subscription/checkout?plan=starter");
  });

  it("drops off-site next paths", () => {
    expect(safeInternalPath("/subscription/checkout?plan=pro")).toBe("/subscription/checkout?plan=pro");
    expect(safeInternalPath("//evil.example")).toBeNull();
    expect(safeInternalPath("https://evil.example")).toBeNull();
    expect(withNext("/register", "//evil.example")).toBe("/register");
    expect(withNext("/register", "/subscription/checkout?plan=studio")).toBe(
      "/register?next=%2Fsubscription%2Fcheckout%3Fplan%3Dstudio"
    );
    expect(withNext("/login?verified=1", "/subscription/checkout?plan=pro")).toBe(
      "/login?verified=1&next=%2Fsubscription%2Fcheckout%3Fplan%3Dpro"
    );
  });
});
