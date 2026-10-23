import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/require";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { IMAGE_MIME_TYPES } from "@/server/storage/file-signature";
import { putObject } from "@/server/storage/object-storage";
import { readValidatedUpload, uniqueObjectName } from "@/server/storage/upload";

export const dynamic = "force-dynamic";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

async function requireAdmin(): Promise<NextResponse | null> {
  try {
    await requireRole(["ADMIN"]);
    return null;
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}

/** POST /api/admin/mentors/[id]/signature — upload the signature printed on certificates. */
export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id: mentorId } = await ctx.params;

  const mentor = await prisma.mentor.findUnique({ where: { id: mentorId }, select: { id: true } });
  if (!mentor) {
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const validation = await readValidatedUpload(formData, ["signature", "file"], {
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
      `mentor-signatures/${uniqueObjectName(mentorId, type.ext)}`,
      bytes,
      type.mime
    );
    url = stored.publicUrl!;
  } catch (err) {
    console.error("Mentor signature write failed:", err);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }

  await prisma.mentor.update({ where: { id: mentorId }, data: { signatureImage: url } });
  return NextResponse.json({ url });
}

/** DELETE /api/admin/mentors/[id]/signature — remove the signature for future certificates. */
export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id: mentorId } = await ctx.params;

  await prisma.mentor.update({ where: { id: mentorId }, data: { signatureImage: null } });
  return NextResponse.json({ ok: true });
}
