import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { instructorListCourses } from "@/server/content/instructor.service";

export const GET = handleRoute(async () => {
  const session = await requireRole(["INSTRUCTOR", "ADMIN"]);
  const courses = await instructorListCourses(session.user.id);
  return NextResponse.json({ courses });
});
