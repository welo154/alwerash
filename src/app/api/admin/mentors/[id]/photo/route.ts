// file: src/app/api/admin/mentors/[id]/photo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireRole } from "@/server/auth/require";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 4 * 1024 * 1024; // 4MB

/** POST /api/admin/mentors/[id]/photo — upload mentor photo; returns { url }. */
export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
  const { id: mentorId } = await ctx.params;

  const mentor = await prisma.mentor.findUnique({ where: { id: mentorId } });
  if (!mentor) {
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
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
  const filename = `${mentorId}.${ext}`;
  const dir = path.join(process.cwd(), "public", "mentor-photos");
  const filepath = path.join(dir, filename);

  try {
    await mkdir(dir, { recursive: true });
    const bytes = await f.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));
  } catch (err) {
    console.error("Mentor photo write failed:", err);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }

  const url = `/mentor-photos/${filename}`;

  await prisma.mentor.update({
    where: { id: mentorId },
    data: { photo: url },
  });

  return NextResponse.json({ url });
}

/** DELETE /api/admin/mentors/[id]/photo — remove mentor photo */
export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
  const { id: mentorId } = await ctx.params;

  await prisma.mentor.update({
    where: { id: mentorId },
    data: { photo: null },
  });

  return NextResponse.json({ ok: true });
}
