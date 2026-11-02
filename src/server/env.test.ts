import { describe, expect, it, vi } from "vitest";
import { assertServerEnv, checkServerEnv } from "./env";

const SECRET = "x".repeat(44);

const productionEnv = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://u:p@host:5432/db",
  AUTH_SECRET: SECRET,
  AUTH_URL: "https://alwerash.com",
  MUX_TOKEN_ID: "id",
  MUX_TOKEN_SECRET: "secret",
  MUX_SIGNING_KEY_ID: "key",
  MUX_PRIVATE_KEY: "pem",
  MUX_WEBHOOK_SECRET: "whsec",
  RESEND_API_KEY: "re_key",
  RESEND_FROM_EMAIL: "hello@alwerash.com",
  SUPABASE_URL: "https://ref.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service",
  POLAR_SERVER: "production",
  POLAR_ACCESS_TOKEN: "polar_oat",
  POLAR_PRODUCT_ID: "prod",
  POLAR_WEBHOOK_SECRET: "polar_whs",
};

describe("checkServerEnv", () => {
  it("accepts a complete production configuration", () => {
    expect(checkServerEnv(productionEnv)).toEqual({ errors: [], warnings: [] });
  });

  it("reports each missing production feature", () => {
    const { errors } = checkServerEnv({ ...productionEnv, POLAR_WEBHOOK_SECRET: "", SUPABASE_URL: undefined });
    expect(errors).toEqual([
      "File storage is not configured: missing SUPABASE_URL.",
      "Payments is not configured: missing POLAR_WEBHOOK_SECRET.",
    ]);
  });

  it("treats .env.example placeholders as missing", () => {
    const { errors } = checkServerEnv({
      ...productionEnv,
      POLAR_ACCESS_TOKEN: "replace-with-polar-organization-access-token",
    });
    expect(errors).toEqual(["Payments is not configured: missing POLAR_ACCESS_TOKEN."]);
  });

  it("refuses the free self-grant in production", () => {
    const { errors } = checkServerEnv({ ...productionEnv, SUBSCRIPTION_SELF_GRANT_ENABLED: "true" });
    expect(errors[0]).toMatch(/SUBSCRIPTION_SELF_GRANT_ENABLED/);
  });

  it("requires a strong secret and an https AUTH_URL in production", () => {
    const { errors } = checkServerEnv({ ...productionEnv, AUTH_SECRET: "short", AUTH_URL: "http://alwerash.com" });
    expect(errors).toHaveLength(2);
  });

  it("warns when production checkout still points at the Polar sandbox", () => {
    const { errors, warnings } = checkServerEnv({ ...productionEnv, POLAR_SERVER: "sandbox" });
    expect(errors).toEqual([]);
    expect(warnings[0]).toMatch(/sandbox/);
  });

  it("only needs the database and auth secret in development", () => {
    const report = checkServerEnv({ NODE_ENV: "development", DATABASE_URL: "postgresql://localhost/db", AUTH_SECRET: SECRET });
    expect(report.errors).toEqual([]);
  });
});

describe("assertServerEnv", () => {
  it("throws in production when configuration is invalid", () => {
    expect(() => assertServerEnv({ NODE_ENV: "production" })).toThrow(/Invalid server configuration/);
  });

  it("can be bypassed with SKIP_ENV_VALIDATION=1", () => {
    expect(() => assertServerEnv({ NODE_ENV: "production", SKIP_ENV_VALIDATION: "1" })).not.toThrow();
  });

  it("only warns outside production", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => assertServerEnv({ NODE_ENV: "development" })).not.toThrow();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
