import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, sessionErrorResponse } from "@/server/auth/live-session";
import { AppError } from "@/server/lib/errors";
import { prisma } from "@/server/db/prisma";
import { addSubmissionFile } from "@/server/learning/submission.service";
import { putObject } from "@/server/storage/object-storage";
import { readValidatedUpload, uniqueObjectName } from "@/server/storage/upload";
import { submissionObjectKey } from "@/server/storage/submission-files";
import { RATE_LIMITED_MESSAGE, RATE_LIMITS, consumeRateLimit } from "@/server/security/rate-limit";

export const dynamic = "force-dynamic";

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ submissionId: string }> }
) {
  let session;
  try {
    session = await requireApiSession();
  } catch (error) {
    const response = sessionErrorResponse(error);
    if (response) return response;
    throw error;
  }

  const { submissionId } = await ctx.params;
  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, userId: session.user.id },
    select: { id: true },
  });
  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  const limited = await consumeRateLimit(RATE_LIMITS.uploadPerUser, session.user.id);
  if (!limited.allowed) {
    return NextResponse.json({ error: RATE_LIMITED_MESSAGE }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const validation = await readValidatedUpload(formData, ["file"], {
    allowed: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
    maxBytes: MAX_SIZE,
    allowedLabel: "JPEG, PNG, WebP images and PDF files",
  });
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }
  const { bytes, type, size } = validation.upload;

  const fileKey = uniqueObjectName(submissionId, type.ext);
  try {
    await putObject("private", submissionObjectKey(fileKey), bytes, type.mime);
  } catch (err) {
    console.error("Submission file write failed:", err);
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }

  try {
    const record = await addSubmissionFile(submissionId, session.user.id, {
      fileKey,
      mime: type.mime,
      size,
    });
    return NextResponse.json({ file: record }, { status: 201 });
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}
