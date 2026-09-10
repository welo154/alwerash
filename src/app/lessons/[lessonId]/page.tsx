import { requireSubscription } from "@/server/subscription/require-subscription";
import { getLessonProgress } from "@/server/learning/progress.service";
import { prisma } from "@/server/db/prisma";
import { notFound } from "next/navigation";
import { AuthorizedHlsPlayer } from "@/components/video/AuthorizedHlsPlayer";
import { ProgressTracker } from "@/components/video/ProgressTracker";

export const dynamic = "force-dynamic";

export default async function LessonWatchPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const session = await requireSubscription();
  const { lessonId } = await params;

  const [lesson, progress] = await Promise.all([
    prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, title: true },
    }),
    getLessonProgress(session.user.id, lessonId),
  ]);

  if (!lesson) notFound();

  const initialLastPositionSeconds = progress?.lastPositionSeconds ?? 0;
  const initialWatchSeconds = progress?.watchSeconds ?? 0;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{lesson.title}</h1>

      <div className="relative">
        <ProgressTracker
          lessonId={lessonId}
          initialLastPositionSeconds={initialLastPositionSeconds > 0 ? initialLastPositionSeconds : undefined}
          initialWatchSeconds={initialWatchSeconds > 0 ? initialWatchSeconds : undefined}
        >
          <AuthorizedHlsPlayer lessonId={lessonId} showQualitySelector />
        </ProgressTracker>
      </div>
    </div>
  );
}
