// file: src/server/content/public.service.ts
import {
  catalogShowcasePropsFromTrackAggregate,
  type CatalogShowcaseCardProps,
  type LandingShowcaseSlide,
} from "@/components/cards/catalog-showcase-map";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import {
  resolveCourseCoverImage,
  resolveTrackCoverImage,
} from "@/lib/catalog-cover-images";
import { sqlGetLandingPopularMentorIds } from "./landing-popular-mentor-sql";
import type { LandingMostsMentorCardDto } from "@/types/landing-mosts-mentor";
import { getFreeLessonIds, isFreeLesson } from "@/lib/course-access";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import { sqlGetFeaturedMentorIds } from "@/server/content/featured-mentor-sql";
import { sqlGetTrendingCourseIds } from "@/server/content/featured-trending-sql";
import type {
  HomeTrackExplorerBundle,
  HomeTrackMetaFilter,
  HomeTrackPill,
} from "@/types/home-track-explorer";

export type { HomeTrackExplorerBundle, HomeTrackMetaFilter, HomeTrackPill };


function effectiveCoverImage(
  coverImage: string | null,
  introVideoMuxPlaybackId: string | null | undefined,
  title?: string,
  trackSlug?: string | null
): string {
  return resolveCourseCoverImage({
    coverImage,
    introVideoMuxPlaybackId,
    title: title ?? "",
    trackSlug,
  });
}

function isPrismaMissingColumnError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  const metaMsg =
    e instanceof Prisma.PrismaClientKnownRequestError
      ? String((e.meta as { message?: string })?.message ?? "")
      : "";
  return msg.includes("does not exist") || metaMsg.includes("does not exist");
}

function logCatalogError(scope: string, e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error(`[catalog] ${scope}:`, msg);
}

async function catalogRequiresPublished(): Promise<boolean> {
  try {
    const [pubTracks, tracks, pubCourses, courses] = await Promise.all([
      prisma.track.count({ where: { published: true } }),
      prisma.track.count(),
      prisma.course.count({ where: { published: true } }),
      prisma.course.count(),
    ]);
    const hasRows = tracks + courses > 0;
    const hasPublished = pubTracks + pubCourses > 0;
    if (hasRows && !hasPublished) {
      console.warn(
        "[catalog] No published tracks/courses; listing unpublished rows from the database."
      );
    }
    return hasPublished || !hasRows;
  } catch (e) {
    logCatalogError("catalogRequiresPublished", e);
    return true;
  }
}

function publishedWhere(requirePublished: boolean): { published: true } | Record<string, never> {
  return requirePublished ? { published: true } : {};
}

type TrackCourseRow = {
  id: string;
  title: string;
  instructorName: string | null;
  coverImage: string | null;
  introVideoMuxPlaybackId: string | null;
  totalDurationMinutes: number | null;
  featuredMostPlayedOrder: number | null;
  modules: { _count: { lessons: number } }[];
};

type TrackWithCourses = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  order: number;
  featuredOrder: number | null;
  topRatedOrder: number | null;
  activityOrder: number | null;
  courses: TrackCourseRow[];
};

const trackCourseSelect = {
  where: { published: true },
  orderBy: [{ order: "asc" as const }, { createdAt: "asc" as const }],
  select: {
    id: true,
    title: true,
    instructorName: true,
    coverImage: true,
    introVideoMuxPlaybackId: true,
    totalDurationMinutes: true,
    featuredMostPlayedOrder: true,
    modules: { select: { _count: { select: { lessons: true } } } },
  },
};

function buildCourseTilesForTrack(
  track: Pick<TrackWithCourses, "title" | "slug" | "courses">
): LearnPopularTile[] {
  const tagPrimary = track.title.trim().toUpperCase() || "TRACK";
  const sorted = [...track.courses].sort((a, b) => {
    const aPopular = a.featuredMostPlayedOrder;
    const bPopular = b.featuredMostPlayedOrder;
    if (aPopular != null && bPopular != null) return aPopular - bPopular;
    if (aPopular != null) return -1;
    if (bPopular != null) return 1;
    return 0;
  });

  return sorted.map((course) => ({
    id: course.id,
    href: `/course/${course.id}`,
    title: course.title,
    authorLabel: course.instructorName?.trim() || "Instructor",
    tagPrimary,
    coverImageSrc: effectiveCoverImage(
      course.coverImage,
      course.introVideoMuxPlaybackId,
      course.title,
      track.slug
    ),
  }));
}

function buildCourseTilesByTrackSlug(tracks: TrackWithCourses[]): Record<string, LearnPopularTile[]> {
  const out: Record<string, LearnPopularTile[]> = {};
  for (const track of tracks) {
    out[track.slug] = buildCourseTilesForTrack(track);
  }
  return out;
}

function buildShowcaseSlides(tracks: TrackWithCourses[]): LandingShowcaseSlide[] {
  return tracks
    .filter((t) => t.courses.length > 0)
    .map((t) => ({
      slug: t.slug,
      cardProps: {
        ...catalogShowcasePropsFromTrackAggregate({
          title: t.title,
          slug: t.slug,
          courses: t.courses.map((c) => ({
            totalDurationMinutes: c.totalDurationMinutes,
            lessonCount: c.modules.reduce((acc, m) => acc + m._count.lessons, 0),
          })),
        }),
        bottomImageSrc: resolveTrackCoverImage(t.coverImage, t.slug),
        showcaseSlug: t.slug,
      },
    }));
}

async function fetchPublishedTracksWithCourses(): Promise<TrackWithCourses[]> {
  const requirePublished = await catalogRequiresPublished();
  const trackWhere = publishedWhere(requirePublished);
  const courseWhere = publishedWhere(requirePublished);

  try {
    return await prisma.track.findMany({
      where: trackWhere,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        order: true,
        featuredOrder: true,
        topRatedOrder: true,
        activityOrder: true,
        courses: {
          ...trackCourseSelect,
          where: courseWhere,
        },
      },
    });
  } catch (e) {
    logCatalogError("fetchPublishedTracksWithCourses", e);
    if (!isPrismaMissingColumnError(e)) throw e;
    return fetchTracksWithCoursesFallback(requirePublished);
  }
}

async function fetchTracksWithCoursesFallback(
  requirePublished: boolean
): Promise<TrackWithCourses[]> {
  const trackSql = requirePublished
    ? `SELECT id, title, slug, description, "order" FROM tracks WHERE published = true ORDER BY "order" ASC, created_at ASC`
    : `SELECT id, title, slug, description, "order" FROM tracks ORDER BY "order" ASC, created_at ASC`;
  const courseSql = requirePublished
    ? `SELECT id, title, instructor_name, cover_image, track_id FROM courses WHERE published = true ORDER BY created_at ASC`
    : `SELECT id, title, instructor_name, cover_image, track_id FROM courses ORDER BY created_at ASC`;

  const [trackRows, courseRows] = await Promise.all([
    prisma.$queryRawUnsafe<
      { id: string; title: string; slug: string; order: number }[]
    >(trackSql),
    prisma.$queryRawUnsafe<
      {
        id: string;
        title: string;
        instructor_name: string | null;
        cover_image: string | null;
        track_id: string | null;
      }[]
    >(courseSql),
  ]);

  const coursesByTrack = new Map<string, TrackCourseRow[]>();
  for (const course of courseRows) {
    if (!course.track_id) continue;
    const list = coursesByTrack.get(course.track_id) ?? [];
    list.push({
      id: course.id,
      title: course.title,
      instructorName: course.instructor_name,
      coverImage: course.cover_image,
      introVideoMuxPlaybackId: null,
      totalDurationMinutes: null,
      featuredMostPlayedOrder: null,
      modules: [],
    });
    coursesByTrack.set(course.track_id, list);
  }

  return trackRows.map((track) => ({
    id: track.id,
    title: track.title,
    slug: track.slug,
    coverImage: null,
    order: track.order,
    featuredOrder: null,
    topRatedOrder: null,
    activityOrder: null,
    courses: coursesByTrack.get(track.id) ?? [],
  }));
}

function filterTracksByMeta(tracks: TrackWithCourses[], filter: HomeTrackMetaFilter): TrackWithCourses[] {
  const orderField =
    filter === "featured"
      ? "featuredOrder"
      : filter === "topRated"
        ? "topRatedOrder"
        : "activityOrder";
  const filtered = tracks
    .filter((t) => t[orderField] != null)
    .sort((a, b) => (a[orderField] ?? 0) - (b[orderField] ?? 0));
  return filtered;
}

/** Home track explorer: meta-filter carousels + track-name pill links. */
export async function publicGetHomeTrackExplorerBundle(): Promise<HomeTrackExplorerBundle> {
  try {
    const rows = await fetchPublishedTracksWithCourses();
    const trackPills: HomeTrackPill[] = rows.map((t) => ({
      slug: t.slug,
      title: t.title,
      label: t.title.trim().toUpperCase() || "TRACK",
    }));
    const mid = Math.ceil(trackPills.length / 2);

    return {
      heroTracks: rows.map((t) => ({ id: t.id, title: t.title, slug: t.slug })),
      trackPills,
      trackPillRow1: trackPills.slice(0, mid),
      trackPillRow2: trackPills.slice(mid),
      slidesByFilter: {
        featured: buildShowcaseSlides(filterTracksByMeta(rows, "featured")),
        topRated: buildShowcaseSlides(filterTracksByMeta(rows, "topRated")),
        activity: buildShowcaseSlides(filterTracksByMeta(rows, "activity")),
      },
      courseTilesByTrackSlug: buildCourseTilesByTrackSlug(rows),
    };
  } catch (e) {
    logCatalogError("publicGetHomeTrackExplorerBundle", e);
    return {
      heroTracks: [],
      trackPills: [],
      trackPillRow1: [],
      trackPillRow2: [],
      slidesByFilter: { featured: [], topRated: [], activity: [] },
      courseTilesByTrackSlug: {},
    };
  }
}

/** All published tracks as catalog showcase slides (learn page featured tracks carousel). */
export async function publicListTrackShowcaseSlides(): Promise<LandingShowcaseSlide[]> {
  try {
    const rows = await fetchPublishedTracksWithCourses();
    return buildShowcaseSlides(rows);
  } catch (e) {
    logCatalogError("publicListTrackShowcaseSlides", e);
    return [];
  }
}

type PublicTrackListItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  order: number;
};

async function publicListTracksRawSafe(requirePublished = true): Promise<PublicTrackListItem[]> {
  const sql = requirePublished
    ? `SELECT id, title, slug, description, "order" FROM tracks WHERE published = true ORDER BY "order" ASC, created_at ASC`
    : `SELECT id, title, slug, description, "order" FROM tracks ORDER BY "order" ASC, created_at ASC`;
  const rows = await prisma.$queryRawUnsafe<
    {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      order: number;
    }[]
  >(sql);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    coverImage: null,
    order: row.order,
  }));
}

export async function publicListTracks(): Promise<PublicTrackListItem[]> {
  const requirePublished = await catalogRequiresPublished();
  const where = publishedWhere(requirePublished);
  try {
    const rows = await prisma.track.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        order: true,
      },
    });
    return rows.map((row) => ({
      ...row,
      coverImage: resolveTrackCoverImage(row.coverImage, row.slug),
    }));
  } catch (e) {
    logCatalogError("publicListTracks", e);
    if (isPrismaMissingColumnError(e)) {
      const rows = await publicListTracksRawSafe(requirePublished);
      return rows.map((row) => ({
        ...row,
        coverImage: resolveTrackCoverImage(null, row.slug),
      }));
    }
    throw e;
  }
}

/**
 * Published track whose slug matches a landing showcase tile (case-insensitive).
 * Used for deep links / learn filters that still key off a showcase slug.
 */
export async function publicGetShowcaseTrackCardForSlug(
  showcaseSlug: string
): Promise<CatalogShowcaseCardProps | null> {
  try {
    const track = await prisma.track.findFirst({
      where: {
        ...publishedWhere(await catalogRequiresPublished()),
        slug: { equals: showcaseSlug, mode: "insensitive" },
      },
      select: {
        title: true,
        slug: true,
        courses: trackCourseSelect,
      },
    });
    if (!track) return null;

    return catalogShowcasePropsFromTrackAggregate({
      title: track.title,
      slug: track.slug,
      courses: track.courses.map((c) => ({
        totalDurationMinutes: c.totalDurationMinutes,
        lessonCount: c.modules.reduce((acc, m) => acc + m._count.lessons, 0),
      })),
    });
  } catch {
    return null;
  }
}

export type GuestLandingTrackBundle = HomeTrackExplorerBundle;

/** @deprecated Use publicGetHomeTrackExplorerBundle */
export async function publicGetGuestLandingTrackBundle(): Promise<GuestLandingTrackBundle> {
  return publicGetHomeTrackExplorerBundle();
}

export async function publicGetTrackBySlug(slug: string) {
  const requirePublished = await catalogRequiresPublished();
  const track = await prisma.track.findFirst({
    where: {
      ...publishedWhere(requirePublished),
      slug: { equals: slug, mode: "insensitive" },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      order: true,
      courses: {
        where: publishedWhere(requirePublished),
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          summary: true,
          coverImage: true,
          introVideoMuxPlaybackId: true,
          instructorName: true,
          rating: true,
          featuredMostPlayedOrder: true,
          modules: { select: { _count: { select: { lessons: true } } } },
        },
      },
    },
  });

  if (!track) throw new AppError("NOT_FOUND", 404, "Track not found");
  return {
    ...track,
    coverImage: resolveTrackCoverImage(track.coverImage, track.slug),
    courses: track.courses.map(({ modules, introVideoMuxPlaybackId, coverImage, instructorName, ...c }) => ({
      ...c,
      instructorName: instructorName ?? null,
      coverImage: effectiveCoverImage(coverImage, introVideoMuxPlaybackId, c.title, track.slug),
      lessonCount: modules.reduce((acc, m) => acc + m._count.lessons, 0),
    })),
  };
}

/** Middle-card tiles for a track's course listing page. */
export async function publicListTrackCoursesForTile(trackSlug: string): Promise<LearnPopularTile[]> {
  const track = await publicGetTrackBySlug(trackSlug);
  return track.courses.map((c) => ({
    id: c.id,
    href: `/course/${c.id}`,
    title: c.title,
    authorLabel: c.instructorName?.trim() || "Instructor",
    tagPrimary: track.title.toUpperCase(),
    coverImageSrc: c.coverImage,
  }));
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
      totalDurationMinutes: true,
      rating: true,
      updatedAt: true,
      trackId: true,
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

  if (!course) throw new AppError("NOT_FOUND", 404, "Course not found");
  const requirePublished = await catalogRequiresPublished();
  if (requirePublished && !course.published) throw new AppError("NOT_FOUND", 404, "Course not found");
  if (requirePublished && course.track && !course.track.published) {
    throw new AppError("NOT_FOUND", 404, "Course not found");
  }

  return {
    ...course,
    coverImage: effectiveCoverImage(
      course.coverImage,
      course.introVideoMuxPlaybackId,
      course.title,
      course.track?.slug
    ),
  };
}

/** Public preview lesson — only for free intro videos on the marketing course page. */
export async function publicGetPreviewLesson(courseId: string, lessonId: string) {
  const course = await publicGetCourseById(courseId);

  if (!isFreeLesson(lessonId, course.modules)) {
    throw new AppError("FORBIDDEN", 403, "This lesson requires a subscription");
  }

  // Preview lessons are videos only — avoid selecting `article` so this works
  // even when the generated Prisma client is behind the schema.
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      published: true,
      module: { courseId, course: { published: true } },
    },
    select: {
      id: true,
      title: true,
      type: true,
      video: { select: { muxPlaybackId: true } },
      module: {
        select: {
          course: { select: { id: true, title: true } },
        },
      },
    },
  });

  if (!lesson) throw new AppError("NOT_FOUND", 404, "Lesson not found");
  return lesson;
}

export type PublicFreePreviewVideo = {
  lessonId: string;
  title: string;
  type: string;
  streamUrl: string | null;
  posterUrl: string | null;
  articleBody: string | null;
};

/** Free first-section lessons for in-page playback / reading on the public course page. */
export async function publicGetFreePreviewVideos(
  courseId: string
): Promise<PublicFreePreviewVideo[]> {
  const course = await publicGetCourseById(courseId);
  const freeIds = getFreeLessonIds(course.modules);
  if (freeIds.length === 0) return [];

  const lessons = await prisma.lesson.findMany({
    where: {
      id: { in: freeIds },
      published: true,
      module: { courseId, course: { published: true } },
    },
    select: {
      id: true,
      title: true,
      type: true,
      video: { select: { muxPlaybackId: true } },
      article: { select: { body: true } },
    },
  });

  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));

  return freeIds.flatMap((lessonId) => {
    const lesson = byId.get(lessonId);
    if (!lesson) return [];

    const playbackId = lesson.video?.muxPlaybackId ?? null;
    return [
      {
        lessonId,
        title: lesson.title,
        type: lesson.type,
        streamUrl: playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null,
        posterUrl: playbackId
          ? `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1280&height=720&fit_mode=smartcrop`
          : null,
        articleBody: lesson.article?.body?.trim() || null,
      },
    ];
  });
}

/** Distinct users who have progress in any lesson of the given courses. */
async function getStudentCountsByCourseId(courseIds: string[]): Promise<Map<string, number>> {
  if (courseIds.length === 0) return new Map();
  try {
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
  } catch (e) {
    logCatalogError("getStudentCountsByCourseId", e);
    return new Map();
  }
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
    introVideoMuxPlaybackId?: string | null;
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
    coverImage: effectiveCoverImage(c.coverImage, c.introVideoMuxPlaybackId, c.title, c.track?.slug),
    instructorName: c.instructorName,
    instructorImage: c.instructorImage,
    track: c.track,
    lessonCount,
    totalDurationMinutes: c.totalDurationMinutes ?? null,
    rating: c.rating ?? null,
    studentCount,
  };
}

/** "New" section: courses with featuredNewOrder set, ordered by it. Falls back to first 3 from featured list if none set. */
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
        introVideoMuxPlaybackId: true,
        instructorName: true,
        instructorImage: true,
        track: { select: { title: true, slug: true } },
        modules: { select: { _count: { select: { lessons: true } } } },
      },
    });
    if (courses.length > 0) {
      const courseIds = courses.map((c) => c.id);
      const studentCounts = await getStudentCountsByCourseId(courseIds);
      return courses.map((c) =>
        mapCourseToCard(
          { ...c, totalDurationMinutes: undefined, rating: undefined },
          studentCounts.get(c.id) ?? 0
        )
      );
    }
  } catch {
    // featured_new_order column may not exist yet
  }
  return publicListFeaturedCourses(3);
}

/** Learn page “Popular classes” carousel — courses with featuredMostPlayedOrder. */
export const POPULAR_CLASS_TRACK_SLUGS = ["calligraphy", "3d-designs"] as const;

export async function publicListPopularClassCourses(
  limit = 40
): Promise<CourseForCard[]> {
  return publicListMostPlayedCourses(limit);
}

/** "Most Played" section: courses with featuredMostPlayedOrder set, ordered by it. Falls back to featured list if none set. */
export async function publicListMostPlayedCourses(limit = 12): Promise<CourseForCard[]> {
  try {
    const courses = await prisma.course.findMany({
      where: {
        ...publishedWhere(await catalogRequiresPublished()),
        featuredMostPlayedOrder: { not: null },
      },
      orderBy: { featuredMostPlayedOrder: "asc" },
      take: limit,
      select: {
        id: true,
        title: true,
        summary: true,
        coverImage: true,
        introVideoMuxPlaybackId: true,
        instructorName: true,
        instructorImage: true,
        track: { select: { title: true, slug: true } },
        modules: { select: { _count: { select: { lessons: true } } } },
      },
    });
    if (courses.length > 0) {
      const courseIds = courses.map((c) => c.id);
      const studentCounts = await getStudentCountsByCourseId(courseIds);
      return courses.map((c) =>
        mapCourseToCard(
          { ...c, totalDurationMinutes: undefined, rating: undefined },
          studentCounts.get(c.id) ?? 0
        )
      );
    }
  } catch (e) {
    logCatalogError("publicListMostPlayedCourses", e);
  }
  return publicListAllPublishedCourses().then((courses) => courses.slice(0, limit));
}

export const MAX_TRENDING_CLASS_COURSES = 6;

/** Learn page “Trending” carousel — up to 6 courses with featuredTrendingOrder. */
export async function publicListTrendingCourses(
  limit = MAX_TRENDING_CLASS_COURSES
): Promise<CourseForCard[]> {
  try {
    const orderedIds = await sqlGetTrendingCourseIds(limit);
    if (orderedIds.length === 0) {
      return publicListAllPublishedCourses().then((courses) => courses.slice(0, limit));
    }

    const requirePublished = await catalogRequiresPublished();
    const courses = await prisma.course.findMany({
      where: {
        id: { in: orderedIds },
        ...publishedWhere(requirePublished),
      },
      select: {
        id: true,
        title: true,
        summary: true,
        coverImage: true,
        introVideoMuxPlaybackId: true,
        instructorName: true,
        instructorImage: true,
        track: { select: { title: true, slug: true } },
        modules: { select: { _count: { select: { lessons: true } } } },
      },
    });
    const byId = new Map(courses.map((c) => [c.id, c]));
    const ordered = orderedIds
      .map((id) => byId.get(id))
      .filter((c): c is NonNullable<typeof c> => c != null);

    const studentCounts = await getStudentCountsByCourseId(ordered.map((c) => c.id));
    return ordered.map((c) =>
      mapCourseToCard(
        { ...c, totalDurationMinutes: undefined, rating: undefined },
        studentCounts.get(c.id) ?? 0
      )
    );
  } catch (e) {
    logCatalogError("publicListTrendingCourses", e);
  }
  return publicListAllPublishedCourses().then((courses) => courses.slice(0, limit));
}

const publishedCourseCardSelect = {
  id: true,
  title: true,
  summary: true,
  coverImage: true,
  introVideoMuxPlaybackId: true,
  instructorName: true,
  instructorImage: true,
  totalDurationMinutes: true,
  rating: true,
  order: true,
  createdAt: true,
  track: { select: { title: true, slug: true } },
  modules: { select: { _count: { select: { lessons: true } } } },
} as const;

/** All published courses for the Learn page catalog grid. */
export async function publicListAllPublishedCourses(): Promise<CourseForCard[]> {
  const requirePublished = await catalogRequiresPublished();
  try {
    const courses = await prisma.course.findMany({
      where: publishedWhere(requirePublished),
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: publishedCourseCardSelect,
    });
    if (courses.length === 0) return [];

    const courseIds = courses.map((c) => c.id);
    const studentCounts = await getStudentCountsByCourseId(courseIds);
    return courses.map((c) =>
      mapCourseToCard(
        {
          ...c,
          totalDurationMinutes: c.totalDurationMinutes ?? undefined,
          rating: c.rating ?? undefined,
        },
        studentCounts.get(c.id) ?? 0
      )
    );
  } catch (e) {
    logCatalogError("publicListAllPublishedCourses", e);
    return listCoursesCardFallback(requirePublished);
  }
}

async function listCoursesCardFallback(requirePublished: boolean): Promise<CourseForCard[]> {
  const sql = requirePublished
    ? `SELECT id, title, summary, cover_image, instructor_name FROM courses WHERE published = true ORDER BY created_at ASC`
    : `SELECT id, title, summary, cover_image, instructor_name FROM courses ORDER BY created_at ASC`;
  const rows = await prisma.$queryRawUnsafe<
    {
      id: string;
      title: string;
      summary: string | null;
      cover_image: string | null;
      instructor_name: string | null;
    }[]
  >(sql);
  return rows.map((c) =>
    mapCourseToCard(
      {
        id: c.id,
        title: c.title,
        summary: c.summary,
        coverImage: c.cover_image,
        instructorName: c.instructor_name,
        instructorImage: null,
        track: null,
        modules: [],
      },
      0
    )
  );
}

export async function publicListFeaturedCourses(limit = 8): Promise<CourseForCard[]> {
  try {
    const courses = await prisma.course.findMany({
      where: publishedWhere(await catalogRequiresPublished()),
      take: limit,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        title: true,
        summary: true,
        coverImage: true,
        introVideoMuxPlaybackId: true,
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
  } catch (e) {
    logCatalogError("publicListFeaturedCourses", e);
    return [];
  }
}

export async function publicGetSimilarCourses(
  courseId: string,
  trackSlug: string,
  limit = 4
): Promise<CourseForCard[]> {
  try {
    const requirePublished = await catalogRequiresPublished();
    const courses = await prisma.course.findMany({
      where: {
        ...publishedWhere(requirePublished),
        id: { not: courseId },
        track: {
          slug: trackSlug,
          ...(requirePublished ? { published: true } : {}),
        },
      },
      take: limit,
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        summary: true,
        coverImage: true,
        introVideoMuxPlaybackId: true,
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

  const requirePublished = await catalogRequiresPublished();
  const where = publishedWhere(requirePublished);

  const [tracks, courses] = await Promise.all([
    prisma.track.findMany({
      where: {
        ...where,
        title: { contains: q, mode: "insensitive" },
      },
      take: limit,
      orderBy: { title: "asc" },
      select: { id: true, title: true, slug: true },
    }),
    prisma.course.findMany({
      where: {
        ...where,
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

/** Public list of mentors for the Mentors page. */
export async function publicListMentors() {
  return prisma.mentor.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      photo: true,
      certificateName: true,
      aboutMe: true,
    },
  });
}

export type { LandingMostsMentorCardDto };

/** Max mentors on Learn / course page strip — 2 rows × 3. */
export const LEARN_FEATURED_MENTOR_LIMIT = 6;

/** Max mentors on guest/home “Current Mosts” — 2 rows × 3. */
const LANDING_MOSTS_MENTOR_LIMIT = 6;

function mapMentorsToMostsDtos(
  rows: { id: string; name: string; certificateName: string | null }[]
): LandingMostsMentorCardDto[] {
  return rows.map((m, i) => ({
    id: m.id,
    variant: i % 2 === 0 ? "popular" : "watched",
    name: m.name.trim().replace(/\s+/g, " ").toUpperCase(),
    profession: m.certificateName?.trim() || "Mentor",
  }));
}

/** Featured mentors for the Learn / course page (max 6 — two rows of three). */
export async function publicListFeaturedMentors(
  limit = LEARN_FEATURED_MENTOR_LIMIT
): Promise<LandingMostsMentorCardDto[]> {
  try {
    const orderedIds = await sqlGetFeaturedMentorIds(limit);
    if (orderedIds.length === 0) return [];

    const mentors = await prisma.mentor.findMany({
      where: { id: { in: orderedIds } },
      select: { id: true, name: true, certificateName: true },
    });
    const byId = new Map(mentors.map((m) => [m.id, m]));
    const ordered = orderedIds
      .map((id) => byId.get(id))
      .filter((m): m is NonNullable<typeof m> => m != null);

    return mapMentorsToMostsDtos(ordered);
  } catch {
    return [];
  }
}

/**
 * Mentors for the landing “Current Mosts” strip on home/guest.
 * Only mentors tagged “Popular on home page” in admin appear here.
 */
export async function publicListLandingMostsMentors(
  limit = LANDING_MOSTS_MENTOR_LIMIT
): Promise<LandingMostsMentorCardDto[]> {
  try {
    const orderedIds = await sqlGetLandingPopularMentorIds(limit);
    if (orderedIds.length === 0) return [];

    const mentors = await prisma.mentor.findMany({
      where: { id: { in: orderedIds } },
      select: { id: true, name: true, certificateName: true },
    });
    const byId = new Map(mentors.map((m) => [m.id, m]));
    const ordered = orderedIds
      .map((id) => byId.get(id))
      .filter((m): m is NonNullable<typeof m> => m != null);
    return mapMentorsToMostsDtos(ordered);
  } catch {
    return [];
  }
}
