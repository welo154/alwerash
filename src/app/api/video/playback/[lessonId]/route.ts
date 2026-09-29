import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { handleRoute } from "@/server/lib/route";
import { getSignedPlaybackForLesson } from "@/server/video/video.service";
import { RATE_LIMITS, enforceRateLimit } from "@/server/security/rate-limit";
import { readRequestContext } from "@/server/security/request-context";

export const runtime = "nodejs";
// Personalized, short-lived credentials: never cache or share this response.
export const dynamic = "force-dynamic";

/**
 * Returns a short-lived signed Mux HLS URL.
 * Free first-module previews: guests allowed.
 * Protected lessons: authenticated subscriber, admin, or an instructor assigned
 * to the lesson's course.
 *
 * Authorization is re-evaluated on every call, so the player rolling its token
 * mid-playback is also a continuous re-authorization check: a learner whose
 * entitlement is revoked stops receiving fresh tokens.
 */
export const GET = handleRoute(async (_req: Request, ctx: { params: Promise<{ lessonId: string }> }) => {
  const session = await auth();
  const { lessonId } = await ctx.params;
  if (!lessonId) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "lessonId required" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } }
    );
  }

  const viewerKey = session?.user?.id ?? (await readRequestContext()).ip;
  await enforceRateLimit(RATE_LIMITS.playbackPerViewer, viewerKey);

  const result = await getSignedPlaybackForLesson({
    lessonId,
    viewer: {
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? null,
      roles: session?.user?.roles ?? [],
      deviceSessionId: session?.user?.deviceSessionId ?? null,
    },
  });

  return NextResponse.json(
    {
      lessonId: result.lessonId,
      playbackUrl: result.playbackUrl,
      token: result.token,
      expiresAt: result.expiresAt,
      watermarkText: result.watermarkText,
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
});
