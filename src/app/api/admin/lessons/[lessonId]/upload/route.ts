import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createDirectUpload } from "@/server/mux/mux.service";
import { isMuxApiConfigured, getMissingMuxApiVars } from "@/server/mux/config";
import { prisma } from "@/server/db/prisma";

export async function POST(
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
    const missing = getMissingMuxApiVars();
    return NextResponse.json(
      {
        error: "Mux not configured",
        message: missing.length
          ? `Add to .env in project root: ${missing.join(", ")}. Then restart the dev server.`
          : "Set MUX_TOKEN_ID and MUX_TOKEN_SECRET in .env and restart the dev server.",
      },
      { status: 503 }
    );
  }

  const { lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, type: true },
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }
  if (lesson.type !== "VIDEO") {
    return NextResponse.json(
      { error: "Lesson is not a video lesson" },
      { status: 400 }
    );
  }

  const existing = await prisma.lessonVideo.findUnique({
    where: { lessonId },
  });
  if (existing) {
    return NextResponse.json(
      { error: "This lesson already has a video. Delete it first to replace." },
      { status: 400 }
    );
  }

  try {
    const { uploadId, url } = await createDirectUpload(lessonId);
    return NextResponse.json({ uploadId, url });
  } catch (err) {
    console.error("Upload URL creation failed:", err);
    const message = err instanceof Error ? err.message : "Failed to create upload URL";
    return NextResponse.json({ error: "INTERNAL", message }, { status: 500 });
  }
}
