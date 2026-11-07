import { beforeEach, describe, expect, it, vi } from "vitest";

const queryRaw = vi.fn();
vi.mock("@/server/db/prisma", () => ({ prisma: { $queryRaw: (...a: unknown[]) => queryRaw(...a) } }));

const { GET } = await import("./route");

beforeEach(() => {
  queryRaw.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("GET /api/health", () => {
  it("reports ok when the database answers", async () => {
    queryRaw.mockResolvedValue([{ "?column?": 1 }]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toMatchObject({ ok: true, db: "up" });
  });

  it("returns 503 without leaking error details when the database is down", async () => {
    queryRaw.mockRejectedValue(new Error("password authentication failed for user postgres"));
    const res = await GET();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body).toEqual({ ok: false, db: "down" });
    expect(JSON.stringify(body)).not.toContain("password");
  });
});
