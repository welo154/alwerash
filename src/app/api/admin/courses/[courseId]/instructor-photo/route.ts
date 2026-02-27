// file: src/app/api/admin/courses/[courseId]/instructor-photo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireRole } from "@/server/auth/require";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
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

  const file = formData.get("photo") ?? formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const f = file as File;
  if (!ALLOWED_TYPES.includes(f.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, and WebP images are allowed" },
      { status: 400 }
    );
  }
  if (f.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image must be 4MB or smaller" },
      { status: 400 }
    );
  }

  const ext = f.type === "image/png" ? "png" : f.type === "image/webp" ? "webp" : "jpg";
  const filename = `${courseId}.${ext}`;
  const dir = path.join(process.cwd(), "public", "instructor-photos");
  const filepath = path.join(dir, filename);

  try {
    await mkdir(dir, { recursive: true });
    const bytes = await f.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));
  } catch (err) {
    console.error("Instructor photo write failed:", err);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }

  const url = `/instructor-photos/${filename}`;

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
