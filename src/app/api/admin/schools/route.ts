import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { adminCreateSchool, adminListSchools } from "@/server/content/admin.service";

export const GET = handleRoute(async () => {
  await requireRole(["ADMIN"]);
  const schools = await adminListSchools();
  return NextResponse.json({ schools });
});

export const POST = handleRoute(async (req) => {
  await requireRole(["ADMIN"]);
  const body = await req.json().catch(() => null);
  const school = await adminCreateSchool(body);
  return NextResponse.json({ school }, { status: 201 });
});
