// file: src/app/api/admin/modules/[moduleId]/route.ts
import { NextResponse } from "next/server";
import { handleRouteWithParams } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { adminDeleteModule, adminUpdateModule } from "@/server/content/admin.service";

export const PATCH = handleRouteWithParams(async (req, ctx) => {
  await requireRole(["ADMIN"]);
  const params = await ctx.params;
  const moduleId = params.moduleId;
  if (!moduleId) return NextResponse.json({ error: "BAD_REQUEST", message: "moduleId required" }, { status: 400 });
  const body = await req.json().catch(() => null);
  const updated = await adminUpdateModule(moduleId, body);
  return NextResponse.json({ module: updated });
});

export const DELETE = handleRouteWithParams(async (_req, ctx) => {
  await requireRole(["ADMIN"]);
  const params = await ctx.params;
  const moduleId = params.moduleId;
  if (!moduleId) return NextResponse.json({ error: "BAD_REQUEST", message: "moduleId required" }, { status: 400 });
  const result = await adminDeleteModule(moduleId);
  return NextResponse.json(result);
});
