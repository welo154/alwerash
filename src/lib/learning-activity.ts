/** Client-safe learning activity types + formatters (no Prisma). */

export const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export type WeekdayLabel = (typeof WEEKDAY_LABELS)[number];

export type WeeklyDayActivity = {
  dayIndex: number;
  label: WeekdayLabel;
  /** UTC date YYYY-MM-DD */
  dateKey: string;
  watchSeconds: number;
};

export type WeeklyActivitySummary = {
  days: WeeklyDayActivity[];
  weekTotalSeconds: number;
};

export type MonthActivitySummary = {
  year: number;
  monthIndex: number;
  monthTotalSeconds: number;
};

export function formatSecondsAsHhMm(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h${m}m`;
}

/** Sunday 00:00 UTC of the week that contains `d`. */
export function startOfUtcWeek(d: Date): Date {
  const dow = d.getUTCDay();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dow));
}

function dateKeyUtc(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function emptyWeeklyActivitySummary(now: Date = new Date()): WeeklyActivitySummary {
  const start = startOfUtcWeek(now);
  const days: WeeklyDayActivity[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    days.push({
      dayIndex: i,
      label: WEEKDAY_LABELS[i],
      dateKey: dateKeyUtc(d),
      watchSeconds: 0,
    });
  }
  return { days, weekTotalSeconds: 0 };
}
