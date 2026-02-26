import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { syncLessonVideoFromMux } from "@/server/mux/mux.service";
import { isMuxApiConfigured } from "@/server/mux/config";
import { prisma } from "@/server/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
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

  const { lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true },
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  try {
    const result = await syncLessonVideoFromMux(lessonId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Sync lesson video failed:", err);
    return NextResponse.json(
      { error: "Sync failed", message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
