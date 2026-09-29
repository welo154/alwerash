/**
 * Device registration from the jwt callback must only happen where the re-encoded
 * cookie is actually written back, otherwise every server-rendered request for a
 * cookie without a sid inserts another DeviceSession row.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { JWT } from "next-auth/jwt";

const registerDeviceSession = vi.fn();

vi.mock("@/server/db/prisma", () => ({
  prisma: {
    userRole: { findMany: async () => [{ role: "LEARNER" }] },
    user: { findUnique: async () => null },
  },
}));
vi.mock("@/server/user/readProfession", () => ({ readUserProfessionFromDb: async () => null }));
vi.mock("@/server/auth/device-session", () => ({
  registerDeviceSession: (...a: unknown[]) => registerDeviceSession(...a),
  revokeDeviceSession: vi.fn(),
}));

const { buildAuthOptions } = await import("./auth");

type JwtParams = Parameters<NonNullable<NonNullable<ReturnType<typeof buildAuthOptions>["callbacks"]>["jwt"]>>[0];

async function runJwt(canPersistToken: boolean, params: Partial<JwtParams>): Promise<JWT> {
  const jwt = buildAuthOptions({ canPersistToken }).callbacks!.jwt!;
  return jwt({ token: {}, account: null, ...params } as JwtParams);
}

describe("jwt callback device registration", () => {
  beforeEach(() => {
    registerDeviceSession.mockReset();
    registerDeviceSession.mockResolvedValue({ sessionId: "sid-new", kind: "COMPUTER", replaced: [] });
  });

  it("registers a legacy cookie from the route handler", async () => {
    const token = await runJwt(true, { token: { sub: "u1", roles: ["LEARNER"] } });
    expect(registerDeviceSession).toHaveBeenCalledTimes(1);
    expect(token.sid).toBe("sid-new");
  });

  it("does not register from server components, whose cookie writes are discarded", async () => {
    for (let i = 0; i < 3; i++) {
      const token = await runJwt(false, { token: { sub: "u1", roles: ["LEARNER"] } });
      expect(token.sid).toBeUndefined();
    }
    expect(registerDeviceSession).not.toHaveBeenCalled();
  });

  it("registers on sign-in and replaces a sid carried over from an earlier session", async () => {
    const token = await runJwt(true, {
      token: { sub: "u1", sid: "sid-old" },
      user: { id: "u1", email: "a@example.com" } as JwtParams["user"],
    });
    expect(registerDeviceSession).toHaveBeenCalledWith("u1");
    expect(token.sid).toBe("sid-new");
  });

  it("leaves an existing sid alone", async () => {
    const token = await runJwt(true, { token: { sub: "u1", roles: ["LEARNER"], sid: "sid-kept" } });
    expect(registerDeviceSession).not.toHaveBeenCalled();
    expect(token.sid).toBe("sid-kept");
  });
});
