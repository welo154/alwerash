/**
 * Content for subscribed users: course list and course with lessons/videos for learning.
 */
import { resolveCourseCoverImage } from "@/lib/catalog-cover-images";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";

export type CourseForLearningWithProgress = {
  id: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  track: { title: string; slug: string } | null;
  trackId: string | null;
  order: number;
  unlocked: boolean;
  completed: boolean;
};

/**
 * Get course with modules and lessons including video playback IDs for the learning page.
 */
export async function getCourseForLearning(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      titleAr: true,
      summary: true,
      coverImage: true,
      instructorName: true,
      instructorNameAr: true,
      published: true,
      comingSoon: true,
      track: { select: { id: true, published: true, slug: true, title: true } },
      instructors: {
        orderBy: { createdAt: "asc" },
        take: 1,
        select: {
          instructor: {
            select: { name: true, nameAr: true, profession: true },
          },
        },
      },
      modules: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          titleAr: true,
          order: true,
          lessons: {
            where: { published: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
            select: {
              id: true,
              title: true,
              titleAr: true,
              type: true,
              order: true,
              video: { select: { lessonId: true } },
            },
          },
        },
      },
    },
  });

  if (!course || !course.published) throw new AppError("NOT_FOUND", 404, "Course not found");
  if (course.track && !course.track.published) throw new AppError("NOT_FOUND", 404, "Course not found");

  // Normalize for client: ensure arrays and serializable types (enum -> string)
  const modules = (course.modules ?? []).map((m) => ({
    id: m.id,
    title: m.title,
    titleAr: m.titleAr,
    order: m.order,
    lessons: (m.lessons ?? []).map((l) => ({
      id: l.id,
      title: l.title,
      titleAr: l.titleAr,
      type: String(l.type),
      order: l.order,
      video: l.video ? { hasVideo: true } : null,
    })),
  }));

  return {
    id: course.id,
    title: course.title,
    titleAr: course.titleAr,
    summary: course.summary,
    coverImage: resolveCourseCoverImage({
      coverImage: course.coverImage,
      title: course.title,
      trackSlug: course.track?.slug,
    }),
    published: course.published,
    comingSoon: course.comingSoon,
    track: course.track,
    instructorName:
      course.instructors[0]?.instructor.name?.trim() ||
      course.instructorName?.trim() ||
      null,
    instructorNameAr:
      course.instructors[0]?.instructor.nameAr?.trim() ||
      course.instructorNameAr?.trim() ||
      null,
    instructorProfession: course.instructors[0]?.instructor.profession?.trim() || null,
    modules,
  };
}
