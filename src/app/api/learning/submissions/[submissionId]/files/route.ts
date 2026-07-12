import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { auth } from "@/auth";
import { AppError } from "@/server/lib/errors";
import { prisma } from "@/server/db/prisma";
import { addSubmissionFile } from "@/server/learning/submission.service";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ submissionId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { submissionId } = await ctx.params;
  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, userId: session.user.id },
    select: { id: true },
  });
  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const f = file as File;
  if (!ALLOWED_TYPES.includes(f.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP images and PDF files are allowed" },
      { status: 400 }
    );
  }
  if (f.size > MAX_SIZE) {
    return NextResponse.json({ error: "File must be 10MB or smaller" }, { status: 400 });
  }

  const ext =
    f.type === "image/png"
      ? "png"
      : f.type === "image/webp"
        ? "webp"
        : f.type === "application/pdf"
          ? "pdf"
          : "jpg";
  const fileKey = `${submissionId}-${randomBytes(8).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "submission-files");
  const filepath = path.join(dir, fileKey);

  try {
    await mkdir(dir, { recursive: true });
    const bytes = await f.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));
  } catch (err) {
    console.error("Submission file write failed:", err);
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }

  try {
    const record = await addSubmissionFile(submissionId, session.user.id, {
      fileKey,
      mime: f.type,
      size: f.size,
    });
    return NextResponse.json({ file: record }, { status: 201 });
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}
