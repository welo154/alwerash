// file: src/app/api/admin/courses/[courseId]/instructor-photo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/require";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { IMAGE_MIME_TYPES } from "@/server/storage/file-signature";
import { putObject } from "@/server/storage/object-storage";
import { readValidatedUpload, uniqueObjectName } from "@/server/storage/upload";

export const dynamic = "force-dynamic";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB

/** POST /api/admin/courses/[courseId]/instructor-photo — upload instructor photo; returns { url }. */
export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ courseId: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
  const { courseId } = await ctx.params;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const validation = await readValidatedUpload(formData, ["photo", "file"], {
    allowed: IMAGE_MIME_TYPES,
    maxBytes: MAX_SIZE,
    allowedLabel: "JPEG, PNG, and WebP images",
  });
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }
  const { bytes, type } = validation.upload;

  let url: string;
  try {
    const stored = await putObject(
      "public",
      `instructor-photos/${uniqueObjectName(courseId, type.ext)}`,
      bytes,
      type.mime
    );
    url = stored.publicUrl!;
  } catch (err) {
    console.error("Instructor photo write failed:", err);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }

  await prisma.course.update({
    where: { id: courseId },
    data: { instructorImage: url },
  });

  return NextResponse.json({ url });
}

/** DELETE /api/admin/courses/[courseId]/instructor-photo — remove instructor photo */
export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ courseId: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
  const { courseId } = await ctx.params;

  await prisma.course.update({
    where: { id: courseId },
    data: { instructorImage: null },
  });

  return NextResponse.json({ ok: true });
}
