/**
 * GET — track progress: completedCount / totalCount, progressPercent.
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/require";
import { getTrackProgress } from "@/server/learning/progress.service";
import { AppError } from "@/server/lib/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackId: string }> }
) {
  try {
    const session = await requireAuth();
    const { trackId } = await params;

    const progress = await getTrackProgress(session.user.id, trackId);
    if (!progress) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    return NextResponse.json({
      trackId: progress.trackId,
      trackTitle: progress.trackTitle,
      completedCount: progress.completedCount,
      totalCount: progress.totalCount,
      progressPercent: progress.progressPercent,
    });
  } catch (e) {
    if (e instanceof AppError && e.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw e;
  }
}
