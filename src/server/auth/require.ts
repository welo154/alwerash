// file: src/server/auth/require.ts
import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppError } from "@/server/lib/errors";
import { assertActiveDeviceSession } from "./device-session";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new AppError("UNAUTHORIZED", 401, "Unauthorized");
  // Revokes displaced devices: the cookie stays validly signed, so only this
  // server-side registry check can stop it.
  await assertActiveDeviceSession(session.user.id, session.user.deviceSessionId);
  return session;
}

export async function requireRole(allowed: Role[]) {
  const session = await requireAuth();
  const roles = session.user.roles ?? [];
  const ok = allowed.some((r) => roles.includes(r));
  if (!ok) throw new AppError("FORBIDDEN", 403, "Forbidden");
  return session;
}

/**
 * Layouts and pages. Same checks as requireRole, but a failure redirects instead
 * of throwing, so a removed role or a signed-out device does not become a 500.
 */
export async function requirePageRole(allowed: Role[], nextPath: string) {
  try {
    return await requireRole(allowed);
  } catch (error) {
    if (error instanceof AppError && error.code === "DEVICE_SESSION_REVOKED") {
      redirect(`/login?error=device_revoked&next=${encodeURIComponent(nextPath)}`);
    }
    if (error instanceof AppError && error.code === "UNAUTHORIZED") {
      redirect(`/login?next=${encodeURIComponent(nextPath)}`);
    }
    redirect("/403");
  }
}
