// file: src/app/api/admin/video/uploads/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { handleRoute } from "@/server/lib/route";
import { requireRole } from "@/server/auth/require";
import { adminCreateMuxDirectUploadForLesson } from "@/server/video/video.service";

export const runtime = "nodejs";

const BodySchema = z.object({ lessonId: z.string().min(1) });

export const POST = handleRoute(async (req: Request) => {
  await requireRole(["ADMIN"]);
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "BAD_REQUEST", issues: parsed.error.flatten() }, { status: 400 });
  }

  const result = await adminCreateMuxDirectUploadForLesson(parsed.data.lessonId);
  return NextResponse.json(result, { status: 201 });
});
