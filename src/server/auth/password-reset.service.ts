/**
 * Password reset by emailed one-time link.
 *
 * Requesting a reset always looks the same to the caller whether or not the email
 * has an account. Completing one signs the account out everywhere, because the
 * usual reason to reset is that someone else may know the old password.
 */
import { prisma } from "@/server/db/prisma";
import { getAppBaseUrl, sendPasswordResetEmail } from "@/server/email/resend.client";
import { recordSecurityEvent } from "@/server/security/security-events";
import { revokeAllDeviceSessions } from "./device-session";
import { hashPassword } from "./password";
import {
  PASSWORD_RESET_IDENTIFIER_PREFIX,
  generateOneTimeToken,
  hashOneTimeToken,
} from "./one-time-token";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function resetIdentifier(userId: string): string {
  return `${PASSWORD_RESET_IDENTIFIER_PREFIX}${userId}`;
}

/** Send a reset link if the email has an account. Resolves the same way either way. */
export async function requestPasswordReset(email: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true, email: true },
  });

  if (!user) {
    await recordSecurityEvent({ type: "PASSWORD_RESET_REQUESTED", email, metadata: { known: false } });
    return;
  }

  const identifier = resetIdentifier(user.id);
  const { raw, hash } = generateOneTimeToken();
  await prisma.$transaction([
    // One outstanding link per account: requesting again invalidates the previous one.
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({
      data: { identifier, token: hash, expires: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
    }),
  ]);

  const resetUrl = `${getAppBaseUrl()}/reset-password?token=${encodeURIComponent(raw)}`;
  const result = await sendPasswordResetEmail(user.email, resetUrl);
  if (!result.success) {
    console.error("[password-reset] email failed:", result.error);
  }
  await recordSecurityEvent({
    type: "PASSWORD_RESET_REQUESTED",
    userId: user.id,
    metadata: { known: true, emailSent: result.success },
  });
}

export type ResetTokenState = "valid" | "invalid" | "expired";

async function findResetToken(rawToken: string) {
  if (!rawToken.trim()) return null;
  return prisma.verificationToken.findFirst({
    where: {
      token: hashOneTimeToken(rawToken),
      identifier: { startsWith: PASSWORD_RESET_IDENTIFIER_PREFIX },
    },
  });
}

/** Lets the reset page show "expired" up front instead of after the user types a password. */
export async function checkPasswordResetToken(rawToken: string): Promise<ResetTokenState> {
  const record = await findResetToken(rawToken);
  if (!record) return "invalid";
  return record.expires < new Date() ? "expired" : "valid";
}

export async function resetPassword(
  rawToken: string,
  newPassword: string
): Promise<{ ok: true } | { ok: false; reason: "invalid" | "expired" }> {
  const record = await findResetToken(rawToken);
  if (!record) return { ok: false, reason: "invalid" };

  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: record.identifier, token: record.token },
    });
    return { ok: false, reason: "expired" };
  }

  const userId = record.identifier.slice(PASSWORD_RESET_IDENTIFIER_PREFIX.length);
  const passwordHash = await hashPassword(newPassword);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { emailVerified: true } });
  if (!user) return { ok: false, reason: "invalid" };

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        // Opening the emailed link proves ownership of the address.
        ...(user.emailVerified ? {} : { emailVerified: new Date() }),
      },
    }),
    prisma.verificationToken.deleteMany({ where: { identifier: record.identifier } }),
  ]);

  const revoked = await revokeAllDeviceSessions(userId, "PASSWORD_RESET");
  await recordSecurityEvent({
    type: "PASSWORD_RESET_COMPLETED",
    userId,
    metadata: { devicesSignedOut: revoked },
  });
  return { ok: true };
}
