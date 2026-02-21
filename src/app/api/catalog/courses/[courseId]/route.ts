// file: src/app/api/catalog/courses/[courseId]/route.ts
import { NextResponse } from "next/server";
import { handleRouteWithParams } from "@/server/lib/route";
import { publicGetCourseById } from "@/server/content/public.service";

export const GET = handleRouteWithParams(async (_req, ctx) => {
  const params = await ctx.params;
  const courseId = params.courseId;
  if (!courseId) return NextResponse.json({ error: "BAD_REQUEST", message: "courseId required" }, { status: 400 });
  const course = await publicGetCourseById(courseId);
  return NextResponse.json({ course });
});
