// file: src/app/lessons/[lessonId]/page.tsx
import { requireAuth } from "@/server/auth/require";
import { getSignedPlaybackForLesson } from "@/server/video/video.service";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { WatermarkOverlay } from "@/components/video/WatermarkOverlay";

export const dynamic = "force-dynamic";

export default async function LessonWatchPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const session = await requireAuth();
  const { lessonId } = await params;

  const playback = await getSignedPlaybackForLesson({
    lessonId,
    viewer: {
      userId: session.user.id,
      email: session.user.email ?? null,
      roles: session.user.roles ?? [],
    },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{playback.title}</h1>

      <div className="relative">
        <HlsPlayer src={playback.playbackUrl} showQualitySelector />
        <WatermarkOverlay text={playback.watermarkText} />
      </div>

      <div className="text-sm opacity-70">
        Signed playback URL is short-lived. Week 6 will add entitlement gating.
      </div>
    </div>
  );
}
