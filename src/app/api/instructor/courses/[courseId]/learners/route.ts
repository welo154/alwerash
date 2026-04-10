import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { instructorGetCourseLearners } from "@/server/content/instructor.service";

export const GET = handleRoute(async (_req, ctx: { params: Promise<{ courseId: string }> }) => {
  const session = await requireRole(["INSTRUCTOR", "ADMIN"]);
  const { courseId } = await ctx.params;
  const isAdmin = (session.user.roles ?? []).includes("ADMIN");
  const result = await instructorGetCourseLearners(session.user.id, courseId, isAdmin);
  return NextResponse.json(result);
});
