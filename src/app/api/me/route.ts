// file: src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";

/** GET /api/me — current session user (id, email, name, roles). Returns 401 if not signed in. */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: session.user }, { status: 200 });
}
