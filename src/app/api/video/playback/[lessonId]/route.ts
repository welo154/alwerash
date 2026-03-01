// file: src/app/api/video/playback/[lessonId]/route.ts
import { NextResponse } from "next/server";
import { handleRoute } from "@/server/lib/route";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { getSignedPlaybackForLesson } from "@/server/video/video.service";

export const runtime = "nodejs";

/** Lesson playback is only for subscribed users (or admins). */
export const GET = handleRoute(async (_req: Request, ctx: { params: Promise<{ lessonId: string }> }) => {
  const session = await requireSubscription();
  const { lessonId } = await ctx.params;
  const result = await getSignedPlaybackForLesson({
    lessonId,
    viewer: {
      userId: session.user.id,
      email: session.user.email ?? null,
      roles: session.user.roles ?? [],
    },
  });
  return NextResponse.json(result);
});
