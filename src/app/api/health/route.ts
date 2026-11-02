// file: src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * GET /api/health — public liveness and database check for uptime monitors and
 * load balancers. Returns 200 or 503 and never includes error details.
 */
export async function GET() {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { ok: true, db: "up", dbLatencyMs: Date.now() - started },
      { headers: NO_STORE }
    );
  } catch (err) {
    console.error("[health] database check failed:", err);
    return NextResponse.json({ ok: false, db: "down" }, { status: 503, headers: NO_STORE });
  }
}
