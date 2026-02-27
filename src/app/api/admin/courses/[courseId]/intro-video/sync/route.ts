import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { syncCourseIntroVideoFromMux } from "@/server/mux/mux.service";
import { isMuxApiConfigured } from "@/server/mux/config";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });
  if (!token?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roles = (token.roles as string[] | undefined) ?? [];
  if (!roles.includes("ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isMuxApiConfigured()) {
    return NextResponse.json({ error: "Mux not configured" }, { status: 503 });
  }

  const { courseId } = await params;

  try {
    const result = await syncCourseIntroVideoFromMux(courseId);
    return NextResponse.json({
      linked: result.linked,
      status: result.status,
      playbackId: result.playbackId,
    });
  } catch (err) {
    console.error("Course intro sync failed:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
