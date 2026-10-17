/**
 * Device session registry: the per-kind cap, grandfathering of old cookies, and
 * the revocation check that makes a JWT session revocable at all.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const findMany = vi.fn();
const findUnique = vi.fn();
const create = vi.fn();
const updateMany = vi.fn();
const update = vi.fn();
const headersGet = vi.fn();

const tx = {
  deviceSession: {
    findMany: (...a: unknown[]) => findMany(...a),
    create: (...a: unknown[]) => create(...a),
    updateMany: (...a: unknown[]) => updateMany(...a),
  },
};

vi.mock("@/server/db/prisma", () => ({
  prisma: {
    deviceSession: {
      findUnique: (...a: unknown[]) => findUnique(...a),
      findMany: (...a: unknown[]) => findMany(...a),
      updateMany: (...a: unknown[]) => updateMany(...a),
      update: (...a: unknown[]) => update(...a),
    },
    $transaction: async (fn: (t: typeof tx) => Promise<unknown>) => fn(tx),
  },
}));

vi.mock("next/headers", () => ({
  headers: async () => ({ get: (name: string) => headersGet(name) }),
}));

const {
  registerDeviceSession,
  checkDeviceSession,
  assertActiveDeviceSession,
  revokeDeviceSession,
  revokeAllDeviceSessions,
  isDeviceEnforcementEnabled,
} = await import("./device-session");
const { AppError } = await import("@/server/lib/errors");

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const WINDOWS =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

function useUserAgent(ua: string | null, ip: string | null = "203.0.113.7") {
  headersGet.mockImplementation((name: string) => {
    if (name === "user-agent") return ua;
    if (name === "x-forwarded-for") return ip;
    return null;
  });
}

beforeEach(() => {
  for (const fn of [findMany, findUnique, create, updateMany, update, headersGet]) fn.mockReset();
  create.mockResolvedValue({ id: "device-new" });
  findMany.mockResolvedValue([]);
  updateMany.mockResolvedValue({ count: 0 });
  update.mockResolvedValue({});
  useUserAgent(WINDOWS);
  vi.stubEnv("DEVICE_SESSION_ENFORCEMENT", "true");
  vi.stubEnv("DEVICE_IP_HASH_SECRET", "test-ip-secret");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isDeviceEnforcementEnabled", () => {
  it("is off unless explicitly enabled, so deploying does not sign anyone out", () => {
    vi.stubEnv("DEVICE_SESSION_ENFORCEMENT", "");
    expect(isDeviceEnforcementEnabled()).toBe(false);
    vi.stubEnv("DEVICE_SESSION_ENFORCEMENT", "false");
    expect(isDeviceEnforcementEnabled()).toBe(false);
  });

  it("accepts true and 1", () => {
    vi.stubEnv("DEVICE_SESSION_ENFORCEMENT", "true");
    expect(isDeviceEnforcementEnabled()).toBe(true);
    vi.stubEnv("DEVICE_SESSION_ENFORCEMENT", "1");
    expect(isDeviceEnforcementEnabled()).toBe(true);
  });
});

describe("registerDeviceSession", () => {
  it("records the device kind from the request User-Agent", async () => {
    useUserAgent(IPHONE);
    const result = await registerDeviceSession("user-1");

    expect(result.kind).toBe("MOBILE");
    const arg = create.mock.calls[0][0] as { data: { kind: string; label: string } };
    expect(arg.data.kind).toBe("MOBILE");
    expect(arg.data.label).toBe("Safari on iPhone");
  });

  it("never stores a raw IP address", async () => {
    await registerDeviceSession("user-1");
    const arg = create.mock.calls[0][0] as { data: { ipHash: string | null } };
    expect(arg.data.ipHash).not.toContain("203.0.113.7");
    expect(arg.data.ipHash).toMatch(/^[0-9a-f]{32}$/);
  });

  it("revokes an existing session of the same kind", async () => {
    findMany.mockResolvedValue([{ id: "device-old", label: "Chrome on Windows" }]);
    const result = await registerDeviceSession("user-1");

    expect(result.replaced).toEqual([{ id: "device-old", label: "Chrome on Windows" }]);
    const arg = updateMany.mock.calls[0][0] as {
      data: { status: string; revokedReason: string };
    };
    expect(arg.data.status).toBe("REVOKED");
    expect(arg.data.revokedReason).toBe("REPLACED_BY_NEW_DEVICE");
  });

  it("only looks at sessions of the same kind, so a phone does not displace a laptop", async () => {
    useUserAgent(IPHONE);
    await registerDeviceSession("user-1");
    const arg = findMany.mock.calls[0][0] as { where: { kind: string; status: string } };
    expect(arg.where.kind).toBe("MOBILE");
    expect(arg.where.status).toBe("ACTIVE");
  });

  it("does not revoke anything while enforcement is disabled", async () => {
    vi.stubEnv("DEVICE_SESSION_ENFORCEMENT", "false");
    findMany.mockResolvedValue([{ id: "device-old", label: "Chrome on Windows" }]);

    const result = await registerDeviceSession("user-1");
    expect(result.replaced).toEqual([]);
    expect(updateMany).not.toHaveBeenCalled();
    // Registration still happens, so the registry fills before enforcement is on.
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("still registers when the request has no headers available", async () => {
    headersGet.mockImplementation(() => {
      throw new Error("called outside a request scope");
    });
    const result = await registerDeviceSession("user-1");
    expect(result.kind).toBe("COMPUTER");
    expect(create).toHaveBeenCalledTimes(1);
  });
});

describe("checkDeviceSession", () => {
  it("reports LEGACY for a cookie with no sid", async () => {
    expect(await checkDeviceSession("user-1", null)).toEqual({ state: "LEGACY" });
    expect(await checkDeviceSession("user-1", undefined)).toEqual({ state: "LEGACY" });
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("reports ACTIVE for a live session", async () => {
    findUnique.mockResolvedValue({
      userId: "user-1",
      status: "ACTIVE",
      kind: "MOBILE",
      lastSeenAt: new Date(),
      revokedReason: null,
    });
    expect(await checkDeviceSession("user-1", "device-1")).toEqual({
      state: "ACTIVE",
      kind: "MOBILE",
    });
  });

  it("reports REVOKED for a displaced session", async () => {
    findUnique.mockResolvedValue({
      userId: "user-1",
      status: "REVOKED",
      kind: "MOBILE",
      lastSeenAt: new Date(),
      revokedReason: "REPLACED_BY_NEW_DEVICE",
    });
    expect(await checkDeviceSession("user-1", "device-1")).toEqual({
      state: "REVOKED",
      reason: "REPLACED_BY_NEW_DEVICE",
    });
  });

  it("reports UNKNOWN for another user's session id, revealing nothing", async () => {
    findUnique.mockResolvedValue({
      userId: "someone-else",
      status: "ACTIVE",
      kind: "MOBILE",
      lastSeenAt: new Date(),
      revokedReason: null,
    });
    expect(await checkDeviceSession("user-1", "device-1")).toEqual({ state: "UNKNOWN" });
  });

  it("reports UNKNOWN for an id that does not exist", async () => {
    findUnique.mockResolvedValue(null);
    expect(await checkDeviceSession("user-1", "nope")).toEqual({ state: "UNKNOWN" });
  });

  it("throttles the last-seen write for a recently active session", async () => {
    findUnique.mockResolvedValue({
      userId: "user-1",
      status: "ACTIVE",
      kind: "MOBILE",
      lastSeenAt: new Date(),
      revokedReason: null,
    });
    await checkDeviceSession("user-1", "device-1");
    expect(update).not.toHaveBeenCalled();
  });

  it("refreshes last-seen once the record is stale", async () => {
    findUnique.mockResolvedValue({
      userId: "user-1",
      status: "ACTIVE",
      kind: "MOBILE",
      lastSeenAt: new Date(Date.now() - 10 * 60 * 1000),
      revokedReason: null,
    });
    await checkDeviceSession("user-1", "device-1");
    expect(update).toHaveBeenCalledTimes(1);
  });

  it("does not fail the request when the last-seen write errors", async () => {
    findUnique.mockResolvedValue({
      userId: "user-1",
      status: "ACTIVE",
      kind: "MOBILE",
      lastSeenAt: new Date(Date.now() - 10 * 60 * 1000),
      revokedReason: null,
    });
    update.mockRejectedValue(new Error("write failed"));
    await expect(checkDeviceSession("user-1", "device-1")).resolves.toEqual({
      state: "ACTIVE",
      kind: "MOBILE",
    });
  });
});

describe("assertActiveDeviceSession", () => {
  it("rejects a revoked session with 401", async () => {
    findUnique.mockResolvedValue({
      userId: "user-1",
      status: "REVOKED",
      kind: "MOBILE",
      lastSeenAt: new Date(),
      revokedReason: "REPLACED_BY_NEW_DEVICE",
    });

    const promise = assertActiveDeviceSession("user-1", "device-1");
    await expect(promise).rejects.toBeInstanceOf(AppError);
    await promise.catch((e: unknown) => {
      expect((e as InstanceType<typeof AppError>).status).toBe(401);
    });
  });

  it("allows a legacy cookie so existing students are not signed out", async () => {
    await expect(assertActiveDeviceSession("user-1", null)).resolves.toBeUndefined();
  });

  it("does nothing at all while enforcement is disabled", async () => {
    vi.stubEnv("DEVICE_SESSION_ENFORCEMENT", "false");
    findUnique.mockResolvedValue({
      userId: "user-1",
      status: "REVOKED",
      kind: "MOBILE",
      lastSeenAt: new Date(),
      revokedReason: "REPLACED_BY_NEW_DEVICE",
    });
    await expect(assertActiveDeviceSession("user-1", "device-1")).resolves.toBeUndefined();
    expect(findUnique).not.toHaveBeenCalled();
  });
});

describe("revocation helpers", () => {
  it("scopes a single revoke to the owning user", async () => {
    updateMany.mockResolvedValue({ count: 1 });
    expect(await revokeDeviceSession("user-1", "device-1", "USER_SIGNED_OUT")).toBe(true);

    const arg = updateMany.mock.calls[0][0] as {
      where: { id: string; userId: string; status: string };
    };
    expect(arg.where.userId).toBe("user-1");
    expect(arg.where.status).toBe("ACTIVE");
  });

  it("reports false when nothing matched, so another user's row cannot be revoked", async () => {
    updateMany.mockResolvedValue({ count: 0 });
    expect(await revokeDeviceSession("user-1", "someone-elses-device", "x")).toBe(false);
  });

  it("revokes every active session for a user", async () => {
    updateMany.mockResolvedValue({ count: 2 });
    expect(await revokeAllDeviceSessions("user-1", "PASSWORD_CHANGED")).toBe(2);
  });
});
