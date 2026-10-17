// file: src/server/auth/require.ts
import type { Role } from "@prisma/client";
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
