// file: src/app/api/admin/tracks/[trackId]/route.ts
import { NextResponse } from "next/server";
import { handleRouteWithParams } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { adminDeleteTrack, adminUpdateTrack } from "@/server/content/admin.service";

export const PATCH = handleRouteWithParams(async (req, ctx) => {
  await requireRole(["ADMIN"]);
  const params = await ctx.params;
  const trackId = params.trackId;
  if (!trackId) return NextResponse.json({ error: "BAD_REQUEST", message: "trackId required" }, { status: 400 });
  const body = await req.json().catch(() => null);
  const track = await adminUpdateTrack(trackId, body);
  return NextResponse.json({ track });
});

export const DELETE = handleRouteWithParams(async (_req, ctx) => {
  await requireRole(["ADMIN"]);
  const params = await ctx.params;
  const trackId = params.trackId;
  if (!trackId) return NextResponse.json({ error: "BAD_REQUEST", message: "trackId required" }, { status: 400 });
  const result = await adminDeleteTrack(trackId);
  return NextResponse.json(result);
});