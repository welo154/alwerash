// file: src/app/api/admin/courses/route.ts
import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { adminCreateCourse, adminListCourses } from "@/server/content/admin.service";

export const GET = handleRoute(async (req) => {
  await requireRole(["ADMIN"]);
  const url = new URL(req.url);
  const trackId = url.searchParams.get("trackId") ?? undefined;
  const courses = await adminListCourses(trackId);
  return NextResponse.json({ courses });
});

export const POST = handleRoute(async (req) => {
  await requireRole(["ADMIN"]);
  const body = await req.json().catch(() => null);
  const course = await adminCreateCourse(body);
  return NextResponse.json({ course }, { status: 201 });
});