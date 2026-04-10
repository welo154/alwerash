import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { adminCreateInstructor, adminListInstructors } from "@/server/auth/adminUsers.service";

export const GET = handleRoute(async () => {
  await requireRole(["ADMIN"]);
  const instructors = await adminListInstructors();
  return NextResponse.json({ instructors });
});

export const POST = handleRoute(async (req) => {
  await requireRole(["ADMIN"]);
  const body = await req.json().catch(() => null);
  const result = await adminCreateInstructor(body);
  return NextResponse.json(result, { status: 201 });
});
