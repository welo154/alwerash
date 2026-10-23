import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { requireApiSession, sessionErrorResponse } from "@/server/auth/live-session";
import { canAccessSubmissionFile } from "@/server/learning/submission.service";
import { detectFileType } from "@/server/storage/file-signature";
import { getPrivateObject } from "@/server/storage/object-storage";
import { submissionObjectKey } from "@/server/storage/submission-files";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ fileKey: string }> }
) {
  let session;
  try {
    session = await requireApiSession();
  } catch (error) {
    const response = sessionErrorResponse(error);
    if (response) return response;
    throw error;
  }

  const { fileKey } = await ctx.params;
  const safeKey = path.basename(fileKey);
  const roles = (session.user as { roles?: string[] }).roles ?? [];

  const allowed = await canAccessSubmissionFile(safeKey, session.user.id, roles);
  if (!allowed) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  let bytes: Uint8Array | null;
  try {
    bytes = await getPrivateObject(submissionObjectKey(safeKey));
  } catch (err) {
    console.error("Submission file read failed:", err);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
  if (!bytes) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Serve under the type the bytes actually are; unknown content is downloaded, never rendered.
  const detected = detectFileType(bytes);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": detected?.mime ?? "application/octet-stream",
      "Content-Disposition": `${detected ? "inline" : "attachment"}; filename="${safeKey}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
