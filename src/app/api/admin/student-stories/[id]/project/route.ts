import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/require";
import { AppError } from "@/server/lib/errors";
import { IMAGE_MIME_TYPES } from "@/server/storage/file-signature";
import { putObject } from "@/server/storage/object-storage";
import { readValidatedUpload, uniqueObjectName } from "@/server/storage/upload";
import { adminSetStudentStoryProject } from "@/server/content/student-stories.service";
import { revalidateStudentStoryPaths } from "@/server/content/revalidate-public-paths";

export const dynamic = "force-dynamic";

const MAX_SIZE = 4 * 1024 * 1024;

function denied(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return null;
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    const response = denied(error);
    if (response) return response;
    throw error;
  }
  const { id } = await ctx.params;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const validation = await readValidatedUpload(formData, ["project", "photo", "file"], {
    allowed: IMAGE_MIME_TYPES,
    maxBytes: MAX_SIZE,
    allowedLabel: "JPEG, PNG, and WebP images",
  });
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  let url: string;
  try {
    const stored = await putObject(
      "public",
      `student-projects/${uniqueObjectName(id, validation.upload.type.ext)}`,
      validation.upload.bytes,
      validation.upload.type.mime
    );
    url = stored.publicUrl!;
  } catch (error) {
    console.error("Student project write failed:", error);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }

  try {
    await adminSetStudentStoryProject(id, url);
  } catch (error) {
    const response = denied(error);
    if (response) return response;
    throw error;
  }
  revalidateStudentStoryPaths();
  return NextResponse.json({ url });
}

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    const response = denied(error);
    if (response) return response;
    throw error;
  }
  const { id } = await ctx.params;
  try {
    await adminSetStudentStoryProject(id, null);
  } catch (error) {
    const response = denied(error);
    if (response) return response;
    throw error;
  }
  revalidateStudentStoryPaths();
  return NextResponse.json({ ok: true });
}
