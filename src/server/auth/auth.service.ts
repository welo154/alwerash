// file: src/server/auth/auth.service.ts
import { Prisma, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { hashPassword } from "./password";
import { createAndSendVerificationToken } from "@/server/email/verification.service";
import { sendAccountExistsEmail } from "@/server/email/resend.client";
import { RATE_LIMITS, consumeRateLimit, enforceRateLimit } from "@/server/security/rate-limit";
import { readRequestContext } from "@/server/security/request-context";
import { recordSecurityEvent } from "@/server/security/security-events";

export const PasswordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(200)
  .refine((v) => /[A-Z]/.test(v), "Password must include an uppercase letter")
  .refine((v) => /[a-z]/.test(v), "Password must include a lowercase letter")
  .refine((v) => /[0-9]/.test(v), "Password must include a number");

export const RegisterInput = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: PasswordSchema,
  name: z.string().min(1).max(100).optional(),
  country: z.string().min(2).max(2).optional(), // ISO-3166 alpha-2 later
});

export type RegisterInput = z.infer<typeof RegisterInput>;

/**
 * Create an account and send the verification email.
 *
 * Resolves identically whether or not the email is already registered, so the form
 * cannot be used to discover who has an account. The existing owner is emailed a
 * sign-in / reset notice instead.
 */
export async function registerUser(input: RegisterInput): Promise<{ email: string }> {
  const { ip } = await readRequestContext();
  await enforceRateLimit(RATE_LIMITS.registerPerIp, ip);

  const passwordHash = await hashPassword(input.password);

  try {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        country: input.country,
        passwordHash,
        emailVerified: null,
        roles: { create: { role: Role.LEARNER } },
      },
      select: { id: true, email: true },
    });

    const { sent, error: sendError } = await createAndSendVerificationToken(user.id, user.email);
    if (!sent && sendError) {
      console.error("[auth] Failed to send verification email:", sendError);
    }
    await recordSecurityEvent({ type: "REGISTERED", userId: user.id });
  } catch (e) {
    if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) throw e;

    const existing = await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } });
    const notice = await consumeRateLimit(RATE_LIMITS.emailPerAddress, input.email);
    if (notice.allowed) {
      const result = await sendAccountExistsEmail(input.email);
      if (!result.success) console.error("[auth] Failed to send account-exists email:", result.error);
    }
    await recordSecurityEvent({ type: "REGISTER_EXISTING_EMAIL", userId: existing?.id ?? null });
  }

  return { email: input.email };
}
