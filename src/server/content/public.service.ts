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

/** Distinct users who have progress in any lesson of the given courses. */
async function getStudentCountsByCourseId(courseIds: string[]): Promise<Map<string, number>> {
  if (courseIds.length === 0) return new Map();
  const rows = await prisma.$queryRaw<{ course_id: string; count: bigint }[]>`
    SELECT m.course_id, COUNT(DISTINCT lp.user_id)::bigint as count
    FROM lesson_progress lp
    JOIN lessons l ON l.id = lp.lesson_id
    JOIN modules m ON m.id = l.module_id
    WHERE m.course_id = ANY(${courseIds}::text[])
    GROUP BY m.course_id
  `;
  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(row.course_id, Number(row.count));
  }
  return map;
}

export type CourseForCard = {
  id: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  instructorName: string | null;
  instructorImage: string | null;
  track: { title: string; slug: string } | null;
  lessonCount: number;
  totalDurationMinutes: number | null;
  rating: number | null;
  studentCount: number;
};

function mapCourseToCard(
  c: {
    id: string;
    title: string;
    summary: string | null;
    coverImage: string | null;
    instructorName: string | null;
    instructorImage: string | null;
    track: { title: string; slug: string } | null;
    modules: { _count: { lessons: number } }[];
    totalDurationMinutes?: number | null;
    rating?: number | null;
  },
  studentCount: number
): CourseForCard {
  const lessonCount = c.modules.reduce((acc, m) => acc + m._count.lessons, 0);
  return {
    id: c.id,
    title: c.title,
    summary: c.summary,
    coverImage: c.coverImage,
    instructorName: c.instructorName,
    instructorImage: c.instructorImage,
    track: c.track,
    lessonCount,
    totalDurationMinutes: c.totalDurationMinutes ?? null,
    rating: c.rating ?? null,
    studentCount,
  };
}

/** "New" section: courses with featuredNewOrder set, ordered by it. Falls back to first 3 from featured list if query fails (e.g. migration not applied). */
export async function publicListNewCourses(): Promise<CourseForCard[]> {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true, featuredNewOrder: { not: null } },
      orderBy: { featuredNewOrder: "asc" },
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
    const courseIds = courses.map((c) => c.id);
    const studentCounts = await getStudentCountsByCourseId(courseIds);
    return courses.map((c) =>
      mapCourseToCard(
        { ...c, totalDurationMinutes: undefined, rating: undefined },
        studentCounts.get(c.id) ?? 0
      )
    );
  } catch {
    const fallback = await publicListFeaturedCourses(3);
    return fallback;
  }
}

/** "Most Played" section: courses with featuredMostPlayedOrder set, ordered by it. Falls back to featured list if query fails. */
export async function publicListMostPlayedCourses(limit = 12): Promise<CourseForCard[]> {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true, featuredMostPlayedOrder: { not: null } },
      orderBy: { featuredMostPlayedOrder: "asc" },
      take: limit,
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
    const courseIds = courses.map((c) => c.id);
    const studentCounts = await getStudentCountsByCourseId(courseIds);
    return courses.map((c) =>
      mapCourseToCard(
        { ...c, totalDurationMinutes: undefined, rating: undefined },
        studentCounts.get(c.id) ?? 0
      )
    );
  } catch {
    return publicListFeaturedCourses(limit);
  }
}

export async function publicListFeaturedCourses(limit = 8): Promise<CourseForCard[]> {
  try {
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
        totalDurationMinutes: true,
        rating: true,
        modules: { select: { _count: { select: { lessons: true } } } },
      },
    });
    const courseIds = courses.map((c) => c.id);
    const studentCounts = await getStudentCountsByCourseId(courseIds);
    return courses.map((c) =>
      mapCourseToCard(
        { ...c, totalDurationMinutes: c.totalDurationMinutes ?? undefined, rating: c.rating ?? undefined },
        studentCounts.get(c.id) ?? 0
      )
    );
  } catch {
    return [];
  }
}

export async function publicGetSimilarCourses(
  courseId: string,
  trackSlug: string,
  limit = 4
): Promise<CourseForCard[]> {
  try {
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
        instructorName: true,
        instructorImage: true,
        track: { select: { title: true, slug: true } },
        totalDurationMinutes: true,
        rating: true,
        modules: { select: { _count: { select: { lessons: true } } } },
      },
    });
    const courseIds = courses.map((c) => c.id);
    const studentCounts = await getStudentCountsByCourseId(courseIds);
    return courses.map((c) =>
      mapCourseToCard(
        { ...c, totalDurationMinutes: c.totalDurationMinutes ?? undefined, rating: c.rating ?? undefined },
        studentCounts.get(c.id) ?? 0
      )
    );
  } catch {
    return [];
  }
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
