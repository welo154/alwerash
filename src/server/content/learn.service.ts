/**
 * Content for subscribed users: course list and course with lessons/videos for learning.
 */
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";

export async function listCoursesForLearning() {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      summary: true,
      coverImage: true,
      track: { select: { title: true, slug: true } },
    },
  });
}

/**
 * Get course with modules and lessons including video playback IDs for the learning page.
 */
export async function getCourseForLearning(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      summary: true,
      coverImage: true,
      published: true,
      track: { select: { published: true, slug: true, title: true } },
      modules: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          order: true,
          lessons: {
            where: { published: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
            select: {
              id: true,
              title: true,
              type: true,
              order: true,
              video: {
                select: { muxPlaybackId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!course || !course.published) throw new AppError("NOT_FOUND", 404, "Course not found");
  if (course.track && !course.track.published) throw new AppError("NOT_FOUND", 404, "Course not found");

  return course;
}

/**
 * Get a single lesson for the learn flow. Verifies lesson belongs to course and is published.
 */
export async function getLessonForLearning(lessonId: string, courseId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId, published: true },
    select: {
      id: true,
      title: true,
      type: true,
      order: true,
      moduleId: true,
      video: { select: { muxPlaybackId: true } },
      module: {
        select: {
          id: true,
          title: true,
          order: true,
          courseId: true,
          course: {
            select: {
              id: true,
              title: true,
              published: true,
              track: { select: { published: true } },
            },
          },
        },
      },
    },
  });

  if (!lesson || lesson.module.courseId !== courseId) throw new AppError("NOT_FOUND", 404, "Lesson not found");
  if (!lesson.module.course.published) throw new AppError("NOT_FOUND", 404, "Course not found");
  if (lesson.module.course.track && !lesson.module.course.track.published) throw new AppError("NOT_FOUND", 404, "Course not found");

  return lesson;
}
