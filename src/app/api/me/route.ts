// file: src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { requireApiSession, sessionErrorResponse } from "@/server/auth/live-session";

/** GET /api/me — current session user (id, email, name, roles). Returns 401 if not signed in. */
export async function GET() {
  let session;
  try {
    session = await requireApiSession();
  } catch (error) {
    const response = sessionErrorResponse(error);
    if (response) return response;
    throw error;
  }
  return NextResponse.json({ user: session.user }, { status: 200 });
}
