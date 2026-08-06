import type { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";
import {
  emptyWeeklyActivitySummary,
  startOfUtcWeek,
  WEEKDAY_LABELS,
  type MonthActivitySummary,
  type WeeklyActivitySummary,
  type WeeklyDayActivity,
} from "@/lib/learning-activity";

export type {
  MonthActivitySummary,
  WeekdayLabel,
  WeeklyActivitySummary,
  WeeklyDayActivity,
} from "@/lib/learning-activity";
export {
  emptyWeeklyActivitySummary,
  formatSecondsAsHhMm,
  startOfUtcWeek,
  WEEKDAY_LABELS,
} from "@/lib/learning-activity";

/** Max seconds credited toward aggregates per debounced PATCH (abuse / clock skew guard). */
export const MAX_WATCH_DELTA_PER_PATCH = 300;

export function utcCalendarDate(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function dateKeyUtc(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function emptyMonthActivitySummary(now: Date): MonthActivitySummary {
  return {
    year: now.getUTCFullYear(),
    monthIndex: now.getUTCMonth(),
    monthTotalSeconds: 0,
  };
}

export async function getWeeklyActivitySummary(
  userId: string,
  now: Date = new Date()
): Promise<WeeklyActivitySummary> {
  const start = startOfUtcWeek(now);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  try {
    const rows = await prisma.userLearningDay.findMany({
      where: {
        userId,
        day: { gte: start, lte: end },
      },
      select: { day: true, watchSecondsTotal: true },
    });

    const byKey = new Map<string, number>();
    for (const r of rows) {
      byKey.set(dateKeyUtc(r.day), r.watchSecondsTotal);
    }

    const days: WeeklyDayActivity[] = [];
    let weekTotalSeconds = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      const key = dateKeyUtc(d);
      const watchSeconds = byKey.get(key) ?? 0;
      weekTotalSeconds += watchSeconds;
      days.push({
        dayIndex: i,
        label: WEEKDAY_LABELS[i],
        dateKey: key,
        watchSeconds,
      });
    }

    return { days, weekTotalSeconds };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[learning-activity] getWeeklyActivitySummary unavailable:", message);
    return emptyWeeklyActivitySummary(now);
  }
}

export async function getMonthActivitySummary(
  userId: string,
  now: Date = new Date()
): Promise<MonthActivitySummary> {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const start = new Date(Date.UTC(y, m, 1));
  const end = new Date(Date.UTC(y, m + 1, 0));

  try {
    const agg = await prisma.userLearningDay.aggregate({
      where: { userId, day: { gte: start, lte: end } },
      _sum: { watchSecondsTotal: true },
    });

    return {
      year: y,
      monthIndex: m,
      monthTotalSeconds: agg._sum.watchSecondsTotal ?? 0,
    };
  } catch (err) {
    console.error("[learning-activity] getMonthActivitySummary failed", err);
    return emptyMonthActivitySummary(now);
  }
}

export async function bumpAggregatesForWatchDelta(
  tx: Prisma.TransactionClient,
  params: { userId: string; courseId: string; dayUtc: Date; delta: number }
): Promise<void> {
  const { userId, courseId, dayUtc, delta } = params;
  if (delta <= 0) return;

  const day = utcCalendarDate(dayUtc);

  try {
    await tx.userLearningDay.upsert({
      where: {
        userId_day: { userId, day },
      },
      create: {
        userId,
        day,
        watchSecondsTotal: delta,
      },
      update: {
        watchSecondsTotal: { increment: delta },
      },
    });

    await tx.userCourseLearningDay.upsert({
      where: {
        userId_courseId_day: { userId, courseId, day },
      },
      create: {
        userId,
        courseId,
        day,
        watchSecondsTotal: delta,
      },
      update: {
        watchSecondsTotal: { increment: delta },
      },
    });
  } catch (err) {
    console.error("[learning-activity] bumpAggregatesForWatchDelta failed", err);
  }
}

export type UserCourseWatchRow = {
  courseId: string;
  title: string;
  watchSeconds: number;
};

export async function getUserCourseWatchTotals(
  userId: string,
  daysBack: number,
  ref: Date = new Date()
): Promise<UserCourseWatchRow[]> {
  const end = utcCalendarDate(ref);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - Math.max(0, daysBack));

  try {
    const grouped = await prisma.userCourseLearningDay.groupBy({
      by: ["courseId"],
      where: {
        userId,
        day: { gte: start, lte: end },
      },
      _sum: { watchSecondsTotal: true },
    });

    if (grouped.length === 0) return [];

    const courseIds = grouped.map((g) => g.courseId);
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, title: true },
    });
    const titleById = new Map(courses.map((c) => [c.id, c.title] as const));

    return grouped
      .map((g) => ({
        courseId: g.courseId,
        title: titleById.get(g.courseId) ?? "Unknown course",
        watchSeconds: g._sum.watchSecondsTotal ?? 0,
      }))
      .sort((a, b) => b.watchSeconds - a.watchSeconds);
  } catch (err) {
    console.error("[learning-activity] getUserCourseWatchTotals failed", err);
    return [];
  }
}

export type AdminUserListRow = {
  id: string;
  email: string;
  name: string | null;
};

export async function adminListUsersForActivity(limit = 200): Promise<AdminUserListRow[]> {
  return prisma.user.findMany({
    select: { id: true, email: true, name: true },
    orderBy: { email: "asc" },
    take: limit,
  });
}
