import { randomBytes } from "crypto";
import { prisma } from "@/server/db/prisma";
import { sendVerificationEmail } from "./resend.client";

const TOKEN_EXPIRY_HOURS = 24;
const APP_URL = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

/**
 * Create a verification token for the user and send the email.
 * Replaces any existing token for this user.
 */
export async function createAndSendVerificationToken(
  userId: string,
  email: string
): Promise<{ sent: boolean; error?: string }> {
  await prisma.verificationToken.deleteMany({
    where: { identifier: userId },
  });

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      identifier: userId,
      token,
      expires,
    },
  });

  const verifyUrl = `${APP_URL.replace(/\/$/, "")}/verify-email?token=${encodeURIComponent(token)}`;
  const result = await sendVerificationEmail(email, verifyUrl);

  if (!result.success) {
    return { sent: false, error: result.error };
  }
  return { sent: true };
}

/**
 * Verify the token: find it, check expiry, set user emailVerified, delete token.
 */
export async function verifyToken(
  token: string
): Promise<{ success: true; userId: string } | { success: false; reason: string }> {
  if (!token.trim()) {
    return { success: false, reason: "missing" };
  }

  const record = await prisma.verificationToken.findFirst({
    where: { token: token.trim() },
  });

  if (!record) {
    return { success: false, reason: "invalid" };
  }
  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: record.identifier, token: record.token },
    });
    return { success: false, reason: "expired" };
  }

  const userId = record.identifier;
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.deleteMany({
      where: { identifier: userId, token: record.token },
    }),
  ]);

  return { success: true, userId };
}
