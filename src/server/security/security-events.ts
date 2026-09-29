/**
 * Append-only security event log.
 *
 * Recording never throws and never delays the caller's response on failure:
 * losing one audit row is better than failing a sign-in because of it.
 */
import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { hashIdentifier, readRequestContext } from "./request-context";

export type SecurityEventType =
  | "LOGIN_SUCCEEDED"
  | "LOGIN_FAILED"
  | "LOGIN_RATE_LIMITED"
  | "REGISTERED"
  | "REGISTER_EXISTING_EMAIL"
  | "EMAIL_VERIFIED"
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_RESET_COMPLETED"
  | "DEVICE_REPLACED"
  | "RATE_LIMITED";

export type SecurityEventInput = {
  type: SecurityEventType;
  userId?: string | null;
  /** Hashed before storage; pass it only when no user id is known. */
  email?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export async function recordSecurityEvent(input: SecurityEventInput): Promise<void> {
  try {
    const context = await readRequestContext();
    await prisma.securityEvent.create({
      data: {
        type: input.type,
        userId: input.userId ?? null,
        emailHash: input.email ? hashIdentifier("email", input.email) : null,
        ipHash: context.ipHash,
        userAgent: context.userAgent?.slice(0, 512) ?? null,
        metadata: input.metadata,
      },
    });
  } catch (error) {
    // P2021: table missing because the migration has not been applied yet.
    const missingTable = (error as { code?: string } | null)?.code === "P2021";
    if (missingTable && warnedMissingTable) return;
    if (missingTable) warnedMissingTable = true;
    console.error("[security-events] failed to record", input.type, error);
  }
}

let warnedMissingTable = false;
