import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/require";
import { adminGetMentor, adminUpdateMentor, adminDeleteMentor } from "@/server/content/admin.service";
import { AppError } from "@/server/lib/errors";

export const dynamic = "force-dynamic";

/** GET /api/admin/mentors/[id] */
export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
  const { id } = await ctx.params;
  const mentor = await adminGetMentor(id);
  return NextResponse.json({ mentor });
}

/** PUT /api/admin/mentors/[id] */
export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const mentor = await adminUpdateMentor(id, body);
  return NextResponse.json({ mentor });
}

/** DELETE /api/admin/mentors/[id] */
export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
  const { id } = await ctx.params;
  await adminDeleteMentor(id);
  return NextResponse.json({ ok: true });
}
