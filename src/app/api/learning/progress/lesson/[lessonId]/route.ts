/**
 * GET — lesson progress for resume (last_position_seconds, completed_at).
 * PATCH — save position (and optional duration); marks completed when ≥90% or last 30s.
 *
 * Both verify lesson access server-side so a free account cannot read or write
 * progress against paid lessons.
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/require";
import { authorizeLessonAccess } from "@/server/authz/lesson-access";
import { getLessonProgress, saveLessonProgress } from "@/server/learning/progress.service";
import { updateLessonProgressBodySchema } from "@/server/learning/progress.schemas";
import { AppError } from "@/server/lib/errors";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" } as const;

function errorResponse(e: unknown) {
  if (e instanceof AppError) {
    return NextResponse.json(
      { error: e.code, message: e.message },
      { status: e.status, headers: PRIVATE_HEADERS }
    );
  }
  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await requireAuth();
    const { lessonId } = await params;

    await authorizeLessonAccess({
      lessonId,
      action: "WRITE_PROGRESS",
      viewer: {
        userId: session.user.id,
        email: session.user.email ?? null,
        roles: session.user.roles ?? [],
      },
    });

    const progress = await getLessonProgress(session.user.id, lessonId);
    if (!progress) {
      return NextResponse.json(
        {
          lessonId,
          lastPositionSeconds: 0,
          watchSeconds: 0,
          completedAt: null,
        },
        { status: 200, headers: PRIVATE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        lessonId: progress.lessonId,
        lastPositionSeconds: progress.lastPositionSeconds,
        watchSeconds: progress.watchSeconds,
        completedAt: progress.completedAt?.toISOString() ?? null,
      },
      { headers: PRIVATE_HEADERS }
    );
  } catch (e) {
    const res = errorResponse(e);
    if (res) return res;
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

    await authorizeLessonAccess({
      lessonId,
      action: "WRITE_PROGRESS",
      viewer: {
        userId: session.user.id,
        email: session.user.email ?? null,
        roles: session.user.roles ?? [],
      },
    });

    const body = await request.json();
    const parsed = updateLessonProgressBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400, headers: PRIVATE_HEADERS }
      );
    }

    const { positionSeconds, durationSeconds, watchedSecondsTotal } = parsed.data;
    const progress = await saveLessonProgress(
      session.user.id,
      lessonId,
      positionSeconds,
      durationSeconds,
      watchedSecondsTotal !== undefined ? { watchedSecondsTotal } : undefined
    );

    return NextResponse.json(
      {
        lessonId: progress.lessonId,
        lastPositionSeconds: progress.lastPositionSeconds,
        watchSeconds: progress.watchSeconds,
        completedAt: progress.completedAt?.toISOString() ?? null,
      },
      { headers: PRIVATE_HEADERS }
    );
  } catch (e) {
    const res = errorResponse(e);
    if (res) return res;
    throw e;
  }
}
