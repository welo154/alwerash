import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/server/db/prisma";
import { IMAGE_MIME_TYPES } from "@/server/storage/file-signature";
import { putObject } from "@/server/storage/object-storage";
import { readValidatedUpload, uniqueObjectName } from "@/server/storage/upload";
import { RATE_LIMITED_MESSAGE, RATE_LIMITS, consumeRateLimit } from "@/server/security/rate-limit";

export const dynamic = "force-dynamic";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB

/** POST /api/profile/photo — upload profile picture; returns { url }. */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      `avatars/${uniqueObjectName(session.user.id, type.ext)}`,
      bytes,
      type.mime
    );
    url = stored.publicUrl!;
  } catch (err) {
    console.error("Profile photo write failed:", err);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: url },
  });

  return NextResponse.json({ url });
}
