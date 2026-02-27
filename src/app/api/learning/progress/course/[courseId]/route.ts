/**
 * GET — course progress: completedCount / totalCount, progressPercent, optional per-module.
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/require";
import { getCourseProgress } from "@/server/learning/progress.service";
import { AppError } from "@/server/lib/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await requireAuth();
    const { courseId } = await params;

    const progress = await getCourseProgress(session.user.id, courseId);
    if (!progress) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      courseId: progress.courseId,
      completedCount: progress.completedCount,
      totalCount: progress.totalCount,
      progressPercent: progress.progressPercent,
      modules: progress.modules,
    });
  } catch (e) {
    if (e instanceof AppError && e.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw e;
  }
}
