// file: src/server/content/public.service.ts
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";

export async function publicListTracks() {
  return prisma.track.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      order: true,
      school: { select: { id: true, title: true, slug: true } },
    },
  });
}

export async function publicGetTrackBySlug(slug: string) {
  const track = await prisma.track.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      order: true,
      published: true,
      school: { select: { id: true, title: true, slug: true } },
      courses: {
        where: { published: true },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          summary: true,
          coverImage: true,
          modules: { select: { _count: { select: { lessons: true } } } },
        },
      },
    },
  });

  if (!track || !track.published) throw new AppError("NOT_FOUND", 404, "Track not found");
  return {
    ...track,
    courses: track.courses.map(({ modules, ...c }) => ({
      ...c,
      lessonCount: modules.reduce((acc, m) => acc + m._count.lessons, 0),
    })),
  };
}

export async function publicGetCourseById(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      summary: true,
      coverImage: true,
      instructorName: true,
      instructorImage: true,
      introVideoMuxPlaybackId: true,
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
            select: { id: true, title: true, type: true, order: true },
          },
        },
      },
    },
  });

  if (!course || !course.published) throw new AppError("NOT_FOUND", 404, "Course not found");
  if (course.track && !course.track.published) throw new AppError("NOT_FOUND", 404, "Course not found");

  return course;
}

export async function publicListFeaturedCourses(limit = 8) {
  const courses = await prisma.course.findMany({
    where: { published: true },
    take: limit,
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      summary: true,
      coverImage: true,
      instructorName: true,
      instructorImage: true,
      track: { select: { title: true, slug: true } },
      modules: { select: { _count: { select: { lessons: true } } } },
    },
  });
  return courses.map(({ modules, ...c }) => ({
    ...c,
    lessonCount: modules.reduce((acc, m) => acc + m._count.lessons, 0),
  }));
}

export async function publicGetSimilarCourses(courseId: string, trackSlug: string, limit = 4) {
  const courses = await prisma.course.findMany({
    where: {
      published: true,
      id: { not: courseId },
      track: { slug: trackSlug, published: true },
    },
    take: limit,
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      summary: true,
      coverImage: true,
      track: { select: { title: true, slug: true } },
      modules: { select: { _count: { select: { lessons: true } } } },
    },
  });
  return courses.map(({ modules, ...c }) => ({
    ...c,
    lessonCount: modules.reduce((acc, m) => acc + m._count.lessons, 0),
  }));
}

/** Search published tracks and courses by query (title). */
export async function publicSearch(query: string, limit = 10) {
  const q = query.trim().toLowerCase();
  if (!q) return { tracks: [], courses: [] };

  const [tracks, courses] = await Promise.all([
    prisma.track.findMany({
      where: {
        published: true,
        title: { contains: q, mode: "insensitive" },
      },
      take: limit,
      orderBy: { title: "asc" },
      select: { id: true, title: true, slug: true },
    }),
    prisma.course.findMany({
      where: {
        published: true,
        title: { contains: q, mode: "insensitive" },
      },
      take: limit,
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        track: { select: { slug: true, title: true } },
      },
    }),
  ]);

  return { tracks, courses };
}
