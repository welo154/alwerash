/**
 * Device session registry.
 *
 * Why this exists: the app uses NextAuth's JWT session strategy, so a signed
 * cookie is self-contained and cannot be invalidated server-side. Roles, bans,
 * and deletions therefore had no effect until the cookie expired (30 days).
 *
 * Each sign-in now creates a `DeviceSession` row and embeds its id in the cookie
 * as an opaque `sid` claim. Protected requests confirm the row is still ACTIVE,
 * which gives real revocation while keeping the JWT strategy — switching to
 * database sessions would have invalidated every existing cookie and disturbed
 * OAuth account linking.
 *
 * The `sid` is not hashed. It is only meaningful inside a cookie signed with
 * AUTH_SECRET, so an attacker holding the value cannot mint a usable session
 * without also holding the signing secret.
 */
import { headers } from "next/headers";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { securityHashSecret } from "@/server/security/request-context";
import {
  classifyDeviceKind,
  clientIpFromHeaders,
  describeDevice,
  hashClientIp,
  type DeviceKindValue,
} from "./device-classification";

/** Skip the `lastSeenAt` write unless the row is at least this stale. */
const LAST_SEEN_THROTTLE_MS = 5 * 60 * 1000;

/**
 * Whether exceeding the per-kind device limit revokes the older session.
 *
 * Defaults to OFF so deploying this does not start signing students out before
 * the registry has been observed filling correctly. Registration happens either
 * way, so turning this on later acts on real data. Explicit revocations (sign-out,
 * password reset) are enforced whatever this is set to.
 */
export function isDeviceEnforcementEnabled(): boolean {
  const raw = process.env.DEVICE_SESSION_ENFORCEMENT?.trim().toLowerCase();
  return raw === "true" || raw === "1";
}

type RequestFingerprint = {
  userAgent: string | null;
  ipHash: string | null;
  kind: DeviceKindValue;
  label: string;
};

/**
 * Read the current request's headers. Returns a COMPUTER-classified fingerprint
 * when called outside a request scope rather than throwing, so a sign-in is never
 * blocked by a missing header context.
 */
async function readRequestFingerprint(): Promise<RequestFingerprint> {
  try {
    const h = await headers();
    const userAgent = h.get("user-agent");
    const ip = clientIpFromHeaders(h.get("x-forwarded-for"), h.get("x-real-ip"));
    return {
      userAgent,
      ipHash: hashClientIp(ip, securityHashSecret()),
      kind: classifyDeviceKind(userAgent),
      label: describeDevice(userAgent),
    };
  } catch {
    return { userAgent: null, ipHash: null, kind: "COMPUTER", label: "Unknown device" };
  }
}

export type DeviceRegistration = {
  sessionId: string;
  kind: DeviceKindValue;
  /** Sessions revoked to make room for this one. */
  replaced: { id: string; label: string | null }[];
};

/**
 * Register the current request's device for `userId` and return the new session id.
 *
 * When enforcement is on, any other ACTIVE session of the same kind is revoked, so
 * a student signing in on a second phone displaces the first.
 */
export async function registerDeviceSession(userId: string): Promise<DeviceRegistration> {
  const fingerprint = await readRequestFingerprint();

  return prisma.$transaction(async (tx) => {
    const replaced: { id: string; label: string | null }[] = [];

    if (isDeviceEnforcementEnabled()) {
      const existing = await tx.deviceSession.findMany({
        where: { userId, kind: fingerprint.kind, status: "ACTIVE" },
        select: { id: true, label: true },
      });

      if (existing.length > 0) {
        await tx.deviceSession.updateMany({
          where: { id: { in: existing.map((s) => s.id) } },
          data: {
            status: "REVOKED",
            revokedAt: new Date(),
            revokedReason: "REPLACED_BY_NEW_DEVICE",
          },
        });
        replaced.push(...existing);
      }
    }

    const created = await tx.deviceSession.create({
      data: {
        userId,
        kind: fingerprint.kind,
        label: fingerprint.label,
        userAgent: fingerprint.userAgent,
        ipHash: fingerprint.ipHash,
      },
      select: { id: true },
    });

    return { sessionId: created.id, kind: fingerprint.kind, replaced };
  });
}

export type DeviceSessionCheck =
  /** No `sid` claim: a cookie issued before this feature shipped. */
  | { state: "LEGACY" }
  | { state: "ACTIVE"; kind: DeviceKindValue }
  | { state: "REVOKED"; reason: string | null }
  | { state: "UNKNOWN" };

/**
 * Confirm a `sid` still refers to an ACTIVE session owned by `userId`.
 *
 * A row belonging to a different user is reported as UNKNOWN rather than
 * REVOKED, so a stolen or guessed id reveals nothing about whether it exists.
 */
export async function checkDeviceSession(
  userId: string,
  sid: string | null | undefined
): Promise<DeviceSessionCheck> {
  if (!sid) return { state: "LEGACY" };

  const row = await prisma.deviceSession.findUnique({
    where: { id: sid },
    select: { userId: true, status: true, kind: true, lastSeenAt: true, revokedReason: true },
  });

  if (!row || row.userId !== userId) return { state: "UNKNOWN" };
  if (row.status !== "ACTIVE") return { state: "REVOKED", reason: row.revokedReason };

  // Throttled so a busy page does not write on every request.
  if (Date.now() - row.lastSeenAt.getTime() > LAST_SEEN_THROTTLE_MS) {
    await prisma.deviceSession
      .update({ where: { id: sid }, data: { lastSeenAt: new Date() } })
      .catch(() => {
        /* Touching last-seen must never fail a request. */
      });
  }

  return { state: "ACTIVE", kind: row.kind };
}

export const DEVICE_REVOKED_MESSAGE =
  "This device was signed out because the account was used on another device.";

/**
 * Throw 401 when a session's device registration is no longer valid.
 *
 * This is the point where JWT revocation actually takes effect: the cookie stays
 * validly signed, so only a server-side registry check can stop a revoked device.
 * Runs regardless of DEVICE_SESSION_ENFORCEMENT, which only decides whether a new
 * sign-in displaces an older device; revocations such as a password reset must
 * always hold. LEGACY cookies pass so existing students are not signed out.
 */
export async function assertActiveDeviceSession(
  userId: string,
  sid: string | null | undefined
): Promise<void> {
  const check = await checkDeviceSession(userId, sid);
  if (check.state === "REVOKED" || check.state === "UNKNOWN") {
    throw new AppError("DEVICE_SESSION_REVOKED", 401, DEVICE_REVOKED_MESSAGE);
  }
}

/** Revoke one session. Used by sign-out and by the account's device list. */
export async function revokeDeviceSession(
  userId: string,
  sessionId: string,
  reason: string
): Promise<boolean> {
  const result = await prisma.deviceSession.updateMany({
    where: { id: sessionId, userId, status: "ACTIVE" },
    data: { status: "REVOKED", revokedAt: new Date(), revokedReason: reason },
  });
  return result.count > 0;
}

/** Revoke every active session for a user, e.g. after a password change. */
export async function revokeAllDeviceSessions(userId: string, reason: string): Promise<number> {
  const result = await prisma.deviceSession.updateMany({
    where: { userId, status: "ACTIVE" },
    data: { status: "REVOKED", revokedAt: new Date(), revokedReason: reason },
  });
  return result.count;
}

/** Active devices for the account's own device list. */
export async function listActiveDeviceSessions(userId: string) {
  return prisma.deviceSession.findMany({
    where: { userId, status: "ACTIVE" },
    select: { id: true, kind: true, label: true, createdAt: true, lastSeenAt: true },
    orderBy: { lastSeenAt: "desc" },
  });
}
