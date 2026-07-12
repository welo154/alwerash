import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { canAccessSubmissionFile } from "@/server/learning/submission.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ fileKey: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { fileKey } = await ctx.params;
  const safeKey = path.basename(fileKey);
  const roles = (session.user as { roles?: string[] }).roles ?? [];

  const allowed = await canAccessSubmissionFile(safeKey, session.user.id, roles);
  if (!allowed) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const filepath = path.join(process.cwd(), "public", "submission-files", safeKey);
  try {
    const bytes = await readFile(filepath);
    const ext = path.extname(safeKey).toLowerCase();
    const mime =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : ext === ".pdf"
            ? "application/pdf"
            : "image/jpeg";
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `inline; filename="${safeKey}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
