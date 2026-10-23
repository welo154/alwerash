import { describe, expect, it, vi, beforeEach } from "vitest";

const queryRaw = vi.fn();
const deleteMany = vi.fn(async () => ({ count: 0 }));

vi.mock("@/server/db/prisma", () => ({
  prisma: {
    $queryRaw: (...a: unknown[]) => queryRaw(...a),
    rateLimitBucket: { deleteMany: (...a: unknown[]) => deleteMany(...(a as [])) },
  },
}));

const { consumeRateLimit, enforceRateLimit, windowStartFor, secondsUntilWindowEnds } = await import(
  "./rate-limit"
);
const { AppError } = await import("@/server/lib/errors");

const rule = { name: "test", limit: 3, windowSeconds: 60 };

/** The SQL template's interpolated values, in order: key, windowStart. */
function lastValues(): unknown[] {
  return queryRaw.mock.calls.at(-1)!.slice(1);
}

describe("window arithmetic", () => {
  it("aligns windows to fixed boundaries", () => {
    expect(windowStartFor(125_000, 60).getTime()).toBe(120_000);
    expect(windowStartFor(120_000, 60).getTime()).toBe(120_000);
  });

  it("reports at least one second until the window ends", () => {
    expect(secondsUntilWindowEnds(125_000, 60)).toBe(55);
    expect(secondsUntilWindowEnds(179_999, 60)).toBe(1);
  });
});

describe("consumeRateLimit", () => {
  beforeEach(() => {
    queryRaw.mockReset();
  });

  it("allows up to the limit and blocks after it", async () => {
    queryRaw.mockResolvedValueOnce([{ count: 3 }]);
    expect((await consumeRateLimit(rule, "a@example.com")).allowed).toBe(true);
    queryRaw.mockResolvedValueOnce([{ count: 4 }]);
    expect((await consumeRateLimit(rule, "a@example.com")).allowed).toBe(false);
  });

  it("never stores the raw identifier", async () => {
    queryRaw.mockResolvedValue([{ count: 1 }]);
    await consumeRateLimit(rule, "student@example.com");
    const [key] = lastValues();
    expect(String(key)).toMatch(/^test:[0-9a-f]{32}$/);
    expect(String(key)).not.toContain("student");
  });

  it("keys identifiers case-insensitively so casing cannot reset the count", async () => {
    queryRaw.mockResolvedValue([{ count: 1 }]);
    await consumeRateLimit(rule, "Student@Example.com");
    const [upper] = lastValues();
    await consumeRateLimit(rule, "student@example.com");
    const [lower] = lastValues();
    expect(upper).toBe(lower);
  });

  it("skips counting when there is no identifier", async () => {
    expect((await consumeRateLimit(rule, null)).allowed).toBe(true);
    expect(queryRaw).not.toHaveBeenCalled();
  });

  it("fails open when the store is unavailable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    queryRaw.mockRejectedValue(new Error('relation "rate_limit_buckets" does not exist'));
    expect((await consumeRateLimit(rule, "a@example.com")).allowed).toBe(true);
  });

  it("enforceRateLimit throws 429 with a retry hint", async () => {
    queryRaw.mockResolvedValue([{ count: 99 }]);
    const promise = enforceRateLimit(rule, "a@example.com");
    await expect(promise).rejects.toBeInstanceOf(AppError);
    await promise.catch((e: InstanceType<typeof AppError>) => {
      expect(e.status).toBe(429);
      expect((e.details as { retryAfterSeconds: number }).retryAfterSeconds).toBeGreaterThan(0);
    });
  });
});
