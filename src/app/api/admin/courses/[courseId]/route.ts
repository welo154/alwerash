// file: src/app/api/admin/courses/[courseId]/route.ts
import { NextResponse } from "next/server";
import { handleRouteWithParams } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { adminDeleteCourse, adminUpdateCourse } from "@/server/content/admin.service";

export const PATCH = handleRouteWithParams(async (req, ctx) => {
  await requireRole(["ADMIN"]);
  const params = await ctx.params;
  const courseId = params.courseId;
  if (!courseId) return NextResponse.json({ error: "BAD_REQUEST", message: "courseId required" }, { status: 400 });
  const body = await req.json().catch(() => null);
  const course = await adminUpdateCourse(courseId, body);
  return NextResponse.json({ course });
});

export const DELETE = handleRouteWithParams(async (_req, ctx) => {
  await requireRole(["ADMIN"]);
  const params = await ctx.params;
  const courseId = params.courseId;
  if (!courseId) return NextResponse.json({ error: "BAD_REQUEST", message: "courseId required" }, { status: 400 });
  const result = await adminDeleteCourse(courseId);
  return NextResponse.json(result);
});
