// file: src/server/auth/auth.service.ts
import { Prisma, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { hashPassword } from "./password";
import { createAndSendVerificationToken } from "@/server/email/verification.service";

export const RegisterInput = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(200)
    .refine((v) => /[A-Z]/.test(v), "Password must include an uppercase letter")
    .refine((v) => /[a-z]/.test(v), "Password must include a lowercase letter")
    .refine((v) => /[0-9]/.test(v), "Password must include a number"),
  name: z.string().min(1).max(100).optional(),
  country: z.string().min(2).max(2).optional(), // ISO-3166 alpha-2 later
});

export type RegisterInput = z.infer<typeof RegisterInput>;

export async function registerUser(input: RegisterInput) {
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
      select: { id: true, email: true, name: true, country: true, createdAt: true },
    });

    const { sent, error: sendError } = await createAndSendVerificationToken(user.id, user.email);
    if (!sent && sendError) {
      console.error("[auth] Failed to send verification email:", sendError);
    }

    return user;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new AppError("CONFLICT", 409, "Email is already registered");
    }
    throw e;
  }
}
