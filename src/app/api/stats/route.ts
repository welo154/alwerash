import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type PlatformStats = {
  activeLearners: number;
  courses: number;
  tracks: number;
  completionRate: number;
  /** Display: Watch Time (e.g. minutes) */
  watchTime: number;
  /** Display: Certificates issued */
  certificates: number;
};

/** GET /api/stats — public platform statistics for the landing page. */
export async function GET() {
  try {
    const [activeLearners, courses, tracks, progressStats, completedCount] = await Promise.all([
      prisma.userRole.count({ where: { role: "LEARNER" } }).then((n) => (n > 0 ? n : prisma.user.count())),
      prisma.course.count({ where: { published: true } }),
      prisma.track.count({ where: { published: true } }),
      Promise.all([
        prisma.lessonProgress.aggregate({
          _count: { userId: true },
          where: { completedAt: { not: null } },
        }),
        prisma.lessonProgress.aggregate({ _count: { userId: true } }),
      ]).then(([completed, total]) => ({
        completed: completed._count.userId,
        total: total._count.userId,
      })),
      prisma.lessonProgress.count({ where: { completedAt: { not: null } } }),
    ]);

    const completionRate =
      progressStats.total > 0
        ? Math.round((progressStats.completed / progressStats.total) * 100)
        : 0;
    const watchTime = completedCount * 10;
    const certificates = completedCount;

    const body: PlatformStats = {
      activeLearners,
      courses,
      tracks,
      completionRate,
      watchTime,
      certificates,
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("Stats API failed:", err);
    return NextResponse.json(
      { activeLearners: 0, courses: 0, tracks: 0, completionRate: 0, watchTime: 0, certificates: 0 },
      { status: 200 }
    );
  }
}
