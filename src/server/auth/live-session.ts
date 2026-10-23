/**
 * A signed cookie is not enough. Password reset and sign-out revoke the device
 * row, and pages that only called auth() kept rendering for that cookie.
 */
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { checkDeviceSession } from "@/server/auth/device-session";
import { AppError } from "@/server/lib/errors";

export type LiveSession =
  | { state: "anonymous" }
  | { state: "revoked" }
  | { state: "active"; session: Session };

export async function readLiveSession(): Promise<LiveSession> {
  const session = await auth();
  if (!session?.user?.id) return { state: "anonymous" };

  const device = await checkDeviceSession(session.user.id, session.user.deviceSessionId);
  if (device.state === "REVOKED" || device.state === "UNKNOWN") return { state: "revoked" };
  return { state: "active", session };
}

/** Member pages: anonymous goes to login, a revoked device goes there with a reason. */
export async function requirePageSession(nextPath: string): Promise<Session> {
  const live = await readLiveSession();
  if (live.state === "revoked") {
    redirect(`/login?error=device_revoked&next=${encodeURIComponent(nextPath)}`);
  }
  if (live.state !== "active") {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return live.session;
}

/** API routes that are not wrapped in handleRoute. */
export async function requireApiSession(): Promise<Session> {
  const live = await readLiveSession();
  if (live.state === "revoked") {
    throw new AppError("DEVICE_SESSION_REVOKED", 401, "This device was signed out.");
  }
  if (live.state !== "active") {
    throw new AppError("UNAUTHORIZED", 401, "Unauthorized");
  }
  return live.session;
}

export function sessionErrorResponse(error: unknown): NextResponse | null {
  if (!(error instanceof AppError)) return null;
  return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
}
