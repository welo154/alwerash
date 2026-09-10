import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { handleRoute } from "@/server/lib/route";
import { getSignedPlaybackForLesson } from "@/server/video/video.service";

export const runtime = "nodejs";

/**
 * Returns a short-lived signed Mux HLS URL.
 * Free first-module previews: guests allowed.
 * Protected lessons: authenticated subscriber (or ADMIN/INSTRUCTOR).
 */
export const GET = handleRoute(async (_req: Request, ctx: { params: Promise<{ lessonId: string }> }) => {
  const session = await auth();
  const { lessonId } = await ctx.params;
  if (!lessonId) {
    return NextResponse.json({ error: "BAD_REQUEST", message: "lessonId required" }, { status: 400 });
  }

  const result = await getSignedPlaybackForLesson({
    lessonId,
    viewer: {
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? null,
      roles: session?.user?.roles ?? [],
    },
  });

  return NextResponse.json({
    lessonId: result.lessonId,
    playbackUrl: result.playbackUrl,
    watermarkText: result.watermarkText,
  });
});
