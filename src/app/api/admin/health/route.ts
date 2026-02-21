// file: src/app/api/admin/health/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

/** GET /api/admin/health — DB connectivity check (no auth required). */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: "connected" });
  } catch (err) {
    console.error("Health check failed:", err);
    return NextResponse.json({ ok: false, db: "disconnected" }, { status: 503 });
  }
}
