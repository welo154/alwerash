import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/require";
import { adminListMentors, adminCreateMentor } from "@/server/content/admin.service";
import { AppError } from "@/server/lib/errors";

export const dynamic = "force-dynamic";

/** GET /api/admin/mentors — list all mentors */
export async function GET() {
  try {
    await requireRole(["ADMIN"]);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
  const mentors = await adminListMentors();
  return NextResponse.json({ mentors });
}

/** POST /api/admin/mentors — create mentor (body: name, certificateName?, aboutMe?) */
export async function POST(request: NextRequest) {
  try {
    await requireRole(["ADMIN"]);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const mentor = await adminCreateMentor(body);
  return NextResponse.json({ mentor });
}
