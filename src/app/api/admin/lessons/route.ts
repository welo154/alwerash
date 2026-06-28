// file: src/app/api/admin/lessons/route.ts
import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { adminCreateLesson, adminListLessons } from "@/server/content/admin.service";

export const GET = handleRoute(async (req) => {
  await requireRole(["ADMIN"]);
  const url = new URL(req.url);
  const moduleId = url.searchParams.get("moduleId") ?? undefined;
  const lessons = await adminListLessons(moduleId);
  return NextResponse.json({ lessons });
});

export const POST = handleRoute(async (req) => {
  await requireRole(["ADMIN"]);
  const body = await req.json().catch(() => null);
  const lesson = await adminCreateLesson(body);
  return NextResponse.json({ lesson }, { status: 201 });
});