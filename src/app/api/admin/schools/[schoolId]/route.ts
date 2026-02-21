import { NextResponse } from "next/server";
import { handleRouteWithParams } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import {
  adminDeleteSchool,
  adminGetSchool,
  adminUpdateSchool,
} from "@/server/content/admin.service";

export const GET = handleRouteWithParams(async (_req, ctx) => {
  await requireRole(["ADMIN"]);
  const { schoolId } = await ctx.params;
  if (!schoolId) return NextResponse.json({ error: "BAD_REQUEST", message: "schoolId required" }, { status: 400 });
  const school = await adminGetSchool(schoolId);
  return NextResponse.json({ school });
});

export const PATCH = handleRouteWithParams(async (req, ctx) => {
  await requireRole(["ADMIN"]);
  const { schoolId } = await ctx.params;
  if (!schoolId) return NextResponse.json({ error: "BAD_REQUEST", message: "schoolId required" }, { status: 400 });
  const body = await req.json().catch(() => null);
  const school = await adminUpdateSchool(schoolId, body);
  return NextResponse.json({ school });
});

export const DELETE = handleRouteWithParams(async (_req, ctx) => {
  await requireRole(["ADMIN"]);
  const { schoolId } = await ctx.params;
  if (!schoolId) return NextResponse.json({ error: "BAD_REQUEST", message: "schoolId required" }, { status: 400 });
  await adminDeleteSchool(schoolId);
  return NextResponse.json({ ok: true });
});
