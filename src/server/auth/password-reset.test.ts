/**
 * Password reset, email verification token storage, and registration enumeration.
 * Prisma is replaced with a small in-memory token table so the flows run end to end.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";

type Token = { identifier: string; token: string; expires: Date };
let tokens: Token[] = [];
const users = new Map<string, { id: string; email: string; emailVerified: Date | null; passwordHash?: string }>();

function matches(t: Token, where: Record<string, unknown>): boolean {
  if (typeof where.identifier === "string" && t.identifier !== where.identifier) return false;
  if (where.identifier && typeof where.identifier === "object") {
    const prefix = (where.identifier as { startsWith: string }).startsWith;
    if (!t.identifier.startsWith(prefix)) return false;
  }
  if (where.NOT) {
    const prefix = (where.NOT as { identifier: { startsWith: string } }).identifier.startsWith;
    if (t.identifier.startsWith(prefix)) return false;
  }
  if (typeof where.token === "string" && t.token !== where.token) return false;
  return true;
}

const verificationToken = {
  deleteMany: async ({ where }: { where: Record<string, unknown> }) => {
    const before = tokens.length;
    tokens = tokens.filter((t) => !matches(t, where));
    return { count: before - tokens.length };
  },
  create: async ({ data }: { data: Token }) => {
    tokens.push(data);
    return data;
  },
  findFirst: async ({ where }: { where: Record<string, unknown> }) => tokens.find((t) => matches(t, where)) ?? null,
};

const userCreate = vi.fn();
const revokeAllDeviceSessions = vi.fn(async () => 2);
const sendPasswordResetEmail = vi.fn(async () => ({ success: true as const }));
const sendVerificationEmail = vi.fn(async () => ({ success: true as const }));
const sendAccountExistsEmail = vi.fn(async () => ({ success: true as const }));

vi.mock("@/server/db/prisma", () => ({
  prisma: {
    verificationToken,
    user: {
      findUnique: async ({ where }: { where: { id?: string; email?: string } }) =>
        [...users.values()].find((u) => u.id === where.id || u.email === where.email) ?? null,
      update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
        Object.assign(users.get(where.id)!, data);
      },
      create: (...a: unknown[]) => userCreate(...a),
    },
    $transaction: async (ops: Promise<unknown>[]) => Promise.all(ops),
  },
}));
vi.mock("@/server/email/resend.client", () => ({
  getAppBaseUrl: () => "https://alwerash.test",
  sendPasswordResetEmail: (...a: unknown[]) => sendPasswordResetEmail(...(a as [])),
  sendVerificationEmail: (...a: unknown[]) => sendVerificationEmail(...(a as [])),
  sendAccountExistsEmail: (...a: unknown[]) => sendAccountExistsEmail(...(a as [])),
}));
vi.mock("./device-session", () => ({ revokeAllDeviceSessions: (...a: unknown[]) => revokeAllDeviceSessions(...(a as [])) }));
vi.mock("./password", () => ({ hashPassword: async (p: string) => `hashed:${p}` }));
vi.mock("@/server/security/security-events", () => ({ recordSecurityEvent: async () => {} }));
vi.mock("@/server/security/rate-limit", () => ({
  RATE_LIMITS: { registerPerIp: {}, emailPerAddress: {} },
  enforceRateLimit: async () => {},
  consumeRateLimit: async () => ({ allowed: true }),
}));
vi.mock("@/server/security/request-context", () => ({ readRequestContext: async () => ({ ip: "203.0.113.1" }) }));

const { requestPasswordReset, resetPassword, checkPasswordResetToken } = await import("./password-reset.service");
const { createAndSendVerificationToken, verifyToken } = await import("@/server/email/verification.service");
const { registerUser } = await import("./auth.service");

function linkToken(mockFn: ReturnType<typeof vi.fn>): string {
  const url = String(mockFn.mock.calls.at(-1)![1]);
  return new URL(url).searchParams.get("token")!;
}

beforeEach(() => {
  tokens = [];
  users.clear();
  users.set("u1", { id: "u1", email: "student@example.com", emailVerified: null });
  vi.clearAllMocks();
});

describe("password reset", () => {
  it("stores only a hash of the emailed token", async () => {
    await requestPasswordReset("student@example.com");
    const raw = linkToken(sendPasswordResetEmail);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].token).not.toBe(raw);
    expect(tokens[0].token).toMatch(/^[0-9a-f]{64}$/);
  });

  it("sends nothing for an unknown email but resolves the same way", async () => {
    await expect(requestPasswordReset("nobody@example.com")).resolves.toBeUndefined();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it("changes the password, verifies the email, and signs out every device", async () => {
    await requestPasswordReset("student@example.com");
    const raw = linkToken(sendPasswordResetEmail);
    expect(await checkPasswordResetToken(raw)).toBe("valid");

    expect(await resetPassword(raw, "NewPassword123")).toEqual({ ok: true });
    expect(users.get("u1")!.passwordHash).toBe("hashed:NewPassword123");
    expect(users.get("u1")!.emailVerified).toBeInstanceOf(Date);
    expect(revokeAllDeviceSessions).toHaveBeenCalledWith("u1", "PASSWORD_RESET");
  });

  it("is single use", async () => {
    await requestPasswordReset("student@example.com");
    const raw = linkToken(sendPasswordResetEmail);
    await resetPassword(raw, "NewPassword123");
    expect(await resetPassword(raw, "Another123456")).toEqual({ ok: false, reason: "invalid" });
  });

  it("invalidates the previous link when a new one is requested", async () => {
    await requestPasswordReset("student@example.com");
    const first = linkToken(sendPasswordResetEmail);
    await requestPasswordReset("student@example.com");
    expect(await checkPasswordResetToken(first)).toBe("invalid");
  });

  it("rejects an expired link", async () => {
    await requestPasswordReset("student@example.com");
    const raw = linkToken(sendPasswordResetEmail);
    tokens[0].expires = new Date(Date.now() - 1000);
    expect(await resetPassword(raw, "NewPassword123")).toEqual({ ok: false, reason: "expired" });
    expect(revokeAllDeviceSessions).not.toHaveBeenCalled();
  });

  it("cannot be redeemed as an email verification link, and vice versa", async () => {
    await requestPasswordReset("student@example.com");
    const resetRaw = linkToken(sendPasswordResetEmail);
    expect(await verifyToken(resetRaw)).toEqual({ success: false, reason: "invalid" });

    await createAndSendVerificationToken("u1", "student@example.com");
    const verifyRaw = linkToken(sendVerificationEmail);
    expect(await checkPasswordResetToken(verifyRaw)).toBe("invalid");
  });
});

describe("email verification tokens", () => {
  it("stores a hash and still verifies from the raw link value", async () => {
    await createAndSendVerificationToken("u1", "student@example.com");
    const raw = linkToken(sendVerificationEmail);
    expect(tokens[0].token).not.toBe(raw);
    expect(await verifyToken(raw)).toEqual({ success: true, userId: "u1" });
  });
});

describe("registration does not reveal existing accounts", () => {
  const input = { email: "student@example.com", password: "Password1234" };

  it("resolves identically for a new and an existing email", async () => {
    userCreate.mockResolvedValueOnce({ id: "u2", email: "new@example.com" });
    const fresh = await registerUser({ ...input, email: "new@example.com" });

    userCreate.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", { code: "P2002", clientVersion: "6" })
    );
    const existing = await registerUser(input);

    expect(fresh).toEqual({ email: "new@example.com" });
    expect(existing).toEqual({ email: "student@example.com" });
    expect(sendAccountExistsEmail).toHaveBeenCalledWith("student@example.com");
  });
});
