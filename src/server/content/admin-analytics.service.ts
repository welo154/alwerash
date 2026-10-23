import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

type CourseSumRow = { course_id: string; seconds: bigint | number | null; learners: bigint | number };

export type CourseWatchTime = {
  courseId: string;
  title: string;
  published: boolean;
  seconds: number;
  minutes: number;
  learners: number;
};

/**
 * Watch time is recorded twice: per lesson in `lesson_progress` and per day in
 * `user_course_learning_days`. Older viewing predates the daily table, and the
 * daily rows outlive deleted lessons, so each course takes the larger of the two.
 */
export async function adminWatchTimeByCourse() {
  const [daily, lessons, courses] = await Promise.all([
    prisma.$queryRaw<CourseSumRow[]>(Prisma.sql`
      SELECT course_id,
             SUM(watch_seconds_total)::bigint AS seconds,
             COUNT(DISTINCT user_id)::bigint AS learners
      FROM user_course_learning_days
      GROUP BY course_id
    `),
    prisma.$queryRaw<CourseSumRow[]>(Prisma.sql`
      SELECT m.course_id,
             SUM(lp.watch_seconds)::bigint AS seconds,
             COUNT(DISTINCT lp.user_id) FILTER (WHERE lp.watch_seconds > 0)::bigint AS learners
      FROM lesson_progress lp
      JOIN lessons l ON l.id = lp.lesson_id
      JOIN modules m ON m.id = l.module_id
      GROUP BY m.course_id
    `),
    prisma.course.findMany({
      select: { id: true, title: true, published: true },
    }),
  ]);

  const dailyById = new Map(daily.map((r) => [r.course_id, r]));
  const lessonsById = new Map(lessons.map((r) => [r.course_id, r]));

  const rows: CourseWatchTime[] = courses.map((c) => {
    const d = dailyById.get(c.id);
    const l = lessonsById.get(c.id);
    const seconds = Math.max(Number(d?.seconds ?? 0), Number(l?.seconds ?? 0));
    const learners = Math.max(Number(d?.learners ?? 0), Number(l?.learners ?? 0));
    return {
      courseId: c.id,
      title: c.title,
      published: c.published,
      seconds,
      minutes: Math.round(seconds / 60),
      learners,
    };
  });

  rows.sort((a, b) => b.seconds - a.seconds || a.title.localeCompare(b.title));

  const totalSeconds = rows.reduce((sum, r) => sum + r.seconds, 0);
  return {
    courses: rows,
    totalSeconds,
    totalMinutes: Math.round(totalSeconds / 60),
  };
}
