/**
 * "Continue learning" cards on /home: courses the user has started (lesson progress exists)
 * and that still have at least one incomplete published lesson.
 */
import { prisma } from "@/server/db/prisma";
import {
  getCompletedLessonIds,
  getOrderedLessonIds,
  isCourseCompleted,
  type CourseWithOrderedLessons,
} from "@/server/progress/course-progress.service";

const ESTIMATED_MINUTES: Record<string, number> = {
  VIDEO: 10,
  ARTICLE: 5,
  RESOURCE: 5,
};

export type ContinueLearningCardDto = {
  titleInstructorLine: string;
  lectureLine: string;
  topicTitle: string;
  continueHref: string;
};

function lessonKindLabel(type: string): string {
  if (type === "VIDEO") return "LECTURE";
  if (type === "ARTICLE") return "READING";
  return "RESOURCE";
}

function formatLectureLine(type: string): string {
  const mins = ESTIMATED_MINUTES[type] ?? 5;
  return `${lessonKindLabel(type)} - ${mins}mins`;
}

function instructorDisplayName(course: { instructorName: string | null }): string {
  const named = course.instructorName?.trim();
  if (named) return named;
  return "Instructor";
}

function toCourseWithOrderedLessons(course: {
  id: string;
  modules: Array<{
    id: string;
    title: string;
    order: number;
    lessons: Array<{ id: string; title: string; type: string; order: number }>;
  }>;
}): CourseWithOrderedLessons {
  return {
    id: course.id,
    modules: course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      order: m.order,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        type: String(l.type),
        order: l.order,
      })),
    })),
  };
}

function findLessonMeta(
  shaped: CourseWithOrderedLessons,
  lessonId: string
): { title: string; type: string } | null {
  for (const mod of shaped.modules) {
    for (const lesson of mod.lessons) {
      if (lesson.id === lessonId) {
        return { title: lesson.title, type: lesson.type };
      }
    }
  }
  return null;
}

/**
 * Up to `limit` (default 3) published courses where the user has any lesson progress,
 * most recently touched first, each pointing at the first incomplete lesson in course order.
 */
export async function getContinueLearningCardsForUser(
  userId: string,
  limit = 3
): Promise<ContinueLearningCardDto[]> {
  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId },
    select: {
      updatedAt: true,
      lesson: {
        select: {
          module: {
            select: {
              course: {
                select: { id: true, published: true },
              },
            },
          },
        },
      },
    },
  });

  const lastTouchByCourse = new Map<string, Date>();
  for (const row of progressRows) {
    const course = row.lesson.module.course;
    if (!course.published) continue;
    const prev = lastTouchByCourse.get(course.id);
    if (!prev || row.updatedAt > prev) {
      lastTouchByCourse.set(course.id, row.updatedAt);
    }
  }

  const courseIdsOrdered = [...lastTouchByCourse.entries()]
    .sort((a, b) => b[1].getTime() - a[1].getTime())
    .map(([id]) => id);

  const cards: ContinueLearningCardDto[] = [];

  for (const courseId of courseIdsOrdered) {
    if (cards.length >= limit) break;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        published: true,
        instructorName: true,
        modules: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            order: true,
            lessons: {
              where: { published: true },
              orderBy: { order: "asc" },
              select: { id: true, title: true, type: true, order: true },
            },
          },
        },
      },
    });

    if (!course || !course.published) continue;

    const shaped = toCourseWithOrderedLessons(course);
    const orderedIds = getOrderedLessonIds(shaped);
    if (orderedIds.length === 0) continue;

    const completed = await getCompletedLessonIds(userId, orderedIds);
    if (isCourseCompleted(orderedIds, completed)) continue;

    const nextLessonId = orderedIds.find((id) => !completed.has(id));
    if (!nextLessonId) continue;

    const meta = findLessonMeta(shaped, nextLessonId);
    if (!meta) continue;

    const who = instructorDisplayName(course);
    const titleLine = `${course.title.trim()} -\n${who}`;

    cards.push({
      titleInstructorLine: titleLine,
      lectureLine: formatLectureLine(meta.type),
      topicTitle: meta.title.toUpperCase(),
      continueHref: `/courses/${course.id}`,
    });
  }

  return cards;
}
