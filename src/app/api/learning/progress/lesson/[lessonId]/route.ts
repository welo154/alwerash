/**
 * GET — lesson progress for resume (last_position_seconds, completed_at).
 * PATCH — save position (and optional duration); marks completed when ≥90% or last 30s.
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/require";
import { getLessonProgress, saveLessonProgress } from "@/server/learning/progress.service";
import { updateLessonProgressBodySchema } from "@/server/learning/progress.schemas";
import { AppError } from "@/server/lib/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await requireAuth();
    const { lessonId } = await params;

    const progress = await getLessonProgress(session.user.id, lessonId);
    if (!progress) {
      return NextResponse.json(
        {
          lessonId,
          lastPositionSeconds: 0,
          completedAt: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      lessonId: progress.lessonId,
      lastPositionSeconds: progress.lastPositionSeconds,
      completedAt: progress.completedAt?.toISOString() ?? null,
    });
  } catch (e) {
    if (e instanceof AppError && e.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw e;
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await requireAuth();
    const { lessonId } = await params;

    const body = await request.json();
    const parsed = updateLessonProgressBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { positionSeconds, durationSeconds } = parsed.data;
    const progress = await saveLessonProgress(
      session.user.id,
      lessonId,
      positionSeconds,
      durationSeconds
    );

    return NextResponse.json({
      lessonId: progress.lessonId,
      lastPositionSeconds: progress.lastPositionSeconds,
      completedAt: progress.completedAt?.toISOString() ?? null,
    });
  } catch (e) {
    if (e instanceof AppError && e.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw e;
  }
}
