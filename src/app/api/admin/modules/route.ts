// file: src/app/api/admin/modules/route.ts
import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { adminCreateModule, adminListModules } from "@/server/content/admin.service";

export const GET = handleRoute(async (req) => {
  await requireRole(["ADMIN"]);
  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId") ?? undefined;
  const modules = await adminListModules(courseId);
  return NextResponse.json({ modules });
});

export const POST = handleRoute(async (req) => {
  await requireRole(["ADMIN"]);
  const body = await req.json().catch(() => null);
  const created = await adminCreateModule(body);
  return NextResponse.json({ module: created }, { status: 201 });
});