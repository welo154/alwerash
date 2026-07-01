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
import type { LandingMostsMentorCardDto } from "@/types/landing-mosts-mentor";
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

type TrackCourseRow = {
  id: string;
  title: string;
  instructorName: string | null;
  coverImage: string | null;
  introVideoMuxPlaybackId: string | null;
  totalDurationMinutes: number | null;
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
    modules: { select: { _count: { select: { lessons: true } } } },
  },
};

function buildCourseTilesForTrack(
  track: Pick<TrackWithCourses, "title" | "slug" | "courses">
): LearnPopularTile[] {
  const tagPrimary = track.title.trim().toUpperCase() || "TRACK";
  return track.courses.map((course) => ({
    id: course.id,
    href: `/courses/${course.id}`,
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
  return tracks.map((t) => ({
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
  return prisma.track.findMany({
    where: { published: true },
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
      courses: trackCourseSelect,
    },
  });
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
  return filtered.length > 0 ? filtered : tracks;
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
  } catch {
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
  } catch {
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

async function publicListTracksRawSafe(): Promise<PublicTrackListItem[]> {
  const rows = await prisma.$queryRawUnsafe<
    {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      order: number;
    }[]
  >(
    `SELECT id, title, slug, description, "order" FROM tracks WHERE published = true ORDER BY "order" ASC, created_at ASC`
  );

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
  try {
    const rows = await prisma.track.findMany({
      where: { published: true },
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
    if (isPrismaMissingColumnError(e)) {
      const rows = await publicListTracksRawSafe();
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
        published: true,
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
      courses: {
        where: { published: true },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          summary: true,
          coverImage: true,
          introVideoMuxPlaybackId: true,
          instructorName: true,
          modules: { select: { _count: { select: { lessons: true } } } },
        },
      },
    },
  });

  if (!track || !track.published) throw new AppError("NOT_FOUND", 404, "Track not found");
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
    href: `/courses/${c.id}`,
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

  if (!course || !course.published) throw new AppError("NOT_FOUND", 404, "Course not found");
  if (course.track && !course.track.published) throw new AppError("NOT_FOUND", 404, "Course not found");

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
      where: { published: true, featuredMostPlayedOrder: { not: null } },
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
  } catch {
    // featured_most_played_order column may not exist yet
  }
  return publicListFeaturedCourses(limit);
}

export const MAX_TRENDING_CLASS_COURSES = 6;

/** Learn page “Trending” carousel — up to 6 courses with featuredTrendingOrder. */
export async function publicListTrendingCourses(
  limit = MAX_TRENDING_CLASS_COURSES
): Promise<CourseForCard[]> {
  try {
    const orderedIds = await sqlGetTrendingCourseIds(limit);
    if (orderedIds.length === 0) return [];

    const courses = await prisma.course.findMany({
      where: { id: { in: orderedIds }, published: true },
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
  } catch {
    // featured_trending_order column may not exist yet
  }
  return [];
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

export const LEARN_FEATURED_MENTOR_LIMIT = 8;

const LANDING_MOSTS_MENTOR_LIMIT = 12;

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

/** Featured mentors for the Learn page (max 8 — two rows of four). */
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
 * Mentors for the landing “Current Mosts” strip on home/guest (createdAt asc).
 * Badge alternates for visual rhythm; not stored on Mentor.
 */
export async function publicListLandingMostsMentors(
  limit = LANDING_MOSTS_MENTOR_LIMIT
): Promise<LandingMostsMentorCardDto[]> {
  try {
    const rows = await prisma.mentor.findMany({
      orderBy: { createdAt: "asc" },
      take: limit,
      select: { id: true, name: true, certificateName: true },
    });
    return mapMentorsToMostsDtos(rows);
  } catch {
    return [];
  }
}
