import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { adminAssignInstructorToCourse } from "@/server/auth/adminUsers.service";

export const POST = handleRoute(async (req) => {
  await requireRole(["ADMIN"]);
  const body = await req.json().catch(() => null);
  const assignment = await adminAssignInstructorToCourse(body);
  return NextResponse.json({ assignment }, { status: 201 });
});
