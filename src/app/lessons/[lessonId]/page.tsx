// file: src/app/lessons/[lessonId]/page.tsx
import { requireSubscription } from "@/server/subscription/require-subscription";
import { getSignedPlaybackForLesson } from "@/server/video/video.service";
import { getLessonProgress } from "@/server/learning/progress.service";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { WatermarkOverlay } from "@/components/video/WatermarkOverlay";
import { ProgressTracker } from "@/components/video/ProgressTracker";

export const dynamic = "force-dynamic";

export default async function LessonWatchPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const session = await requireSubscription();
  const { lessonId } = await params;

  const [playback, progress] = await Promise.all([
    getSignedPlaybackForLesson({
      lessonId,
      viewer: {
        userId: session.user.id,
        email: session.user.email ?? null,
        roles: session.user.roles ?? [],
      },
    }),
    getLessonProgress(session.user.id, lessonId),
  ]);

  const initialLastPositionSeconds = progress?.lastPositionSeconds ?? 0;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{playback.title}</h1>

      <div className="relative">
        <ProgressTracker
          lessonId={lessonId}
          initialLastPositionSeconds={initialLastPositionSeconds > 0 ? initialLastPositionSeconds : undefined}
        >
          <HlsPlayer src={playback.playbackUrl} showQualitySelector />
        </ProgressTracker>
        <WatermarkOverlay text={playback.watermarkText} />
      </div>

      <div className="text-sm opacity-70">
        Signed playback URL is short-lived. Week 6 will add entitlement gating.
      </div>
    </div>
  );
}
