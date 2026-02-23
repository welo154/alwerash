// file: src/app/api/admin/lessons/[lessonId]/route.ts
import { NextResponse } from "next/server";
import { handleRouteWithParams } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { adminDeleteLesson, adminUpdateLesson } from "@/server/content/admin.service";

export const PATCH = handleRouteWithParams(async (req, ctx) => {
  await requireRole(["ADMIN"]);
  const params = await ctx.params;
  const lessonId = params.lessonId;
  if (!lessonId) return NextResponse.json({ error: "BAD_REQUEST", message: "lessonId required" }, { status: 400 });
  const body = await req.json().catch(() => null);
  const lesson = await adminUpdateLesson(lessonId, body);
  return NextResponse.json({ lesson });
});

export const DELETE = handleRouteWithParams(async (_req, ctx) => {
  await requireRole(["ADMIN"]);
  const params = await ctx.params;
  const lessonId = params.lessonId;
  if (!lessonId) return NextResponse.json({ error: "BAD_REQUEST", message: "lessonId required" }, { status: 400 });
  const result = await adminDeleteLesson(lessonId);
  return NextResponse.json(result);
});
