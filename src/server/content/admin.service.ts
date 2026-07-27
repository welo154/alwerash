// file: src/server/content/admin.service.ts
import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { hashPassword } from "@/server/auth/password";
import type { CourseCatalogTagKey, CourseCatalogTagState } from "@/types/course-catalog-tags";
import {
  EMPTY_COURSE_TAGS,
  sqlGetCourseTagMap,
  sqlGetCourseTags,
  sqlSetCourseTag,
  sqlUpdateCourseTags,
} from "./course-catalog-tags-sql";
import {
  sqlCountFeaturedMentors,
  sqlGetFeaturedOrder,
  sqlGetFeaturedOrderMap,
  sqlMaxFeaturedOrder,
  sqlSetFeaturedOrder,
  MAX_FEATURED_MENTORS,
} from "./featured-mentor-sql";
import {
  sqlCountTrendingCourses,
  sqlGetTrendingOrder,
  sqlGetTrendingOrderMap,
  sqlMaxTrendingOrder,
  sqlSetTrendingOrder,
} from "./featured-trending-sql";
import {
  sqlCountLandingPopularMentors,
  sqlGetLandingPopularOrder,
  sqlGetLandingPopularOrderMap,
  sqlMaxLandingPopularOrder,
  sqlSetLandingPopularOrder,
  MAX_LANDING_POPULAR_MENTORS,
} from "./landing-popular-mentor-sql";
import {
  TrackCreateSchema,
  TrackUpdateSchema,
  CourseCreateSchema,
  CourseUpdateSchema,
  ModuleCreateSchema,
  ModuleUpdateSchema,
  LessonCreateSchema,
  LessonUpdateSchema,
  LessonArticleUpsertSchema,
  MentorCreateSchema,
  MentorUpdateSchema,
} from "./content.schemas";

function handlePrismaError(e: unknown): never {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") throw new AppError("CONFLICT", 409, "Unique constraint violation");
    if (e.code === "P2025") throw new AppError("NOT_FOUND", 404, "Record not found");
  }
  throw e;
}

function parse<T>(schema: { safeParse: (v: unknown) => { success: true; data: T } | { success: false; error: { flatten: () => { formErrors: string[]; fieldErrors: Record<string, string[]> } } } }, input: unknown): T {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const msg =
      flat.formErrors[0] ??
      Object.values(flat.fieldErrors).flat().filter(Boolean)[0] ??
      "Invalid input";
    throw new AppError("BAD_REQUEST", 400, msg, flat);
  }
  return parsed.data;
}

// --- Tracks ---
export async function adminListTracks() {
  return prisma.track.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function adminGetTrack(id: string) {
  const t = await prisma.track.findUnique({
    where: { id },
    include: {
      courses: {
        select: { id: true, title: true, published: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!t) throw new AppError("NOT_FOUND", 404, "Track not found");
  return t;
}

export async function adminCreateTrack(input: unknown) {
  try {
    return await prisma.track.create({ data: parse(TrackCreateSchema, input) });
  } catch (e) {
    handlePrismaError(e);
  }
}

export async function adminUpdateTrack(trackId: string, input: unknown) {
  try {
    return await prisma.track.update({ where: { id: trackId }, data: parse(TrackUpdateSchema, input) });
  } catch (e) {
    handlePrismaError(e);
  }
}

export async function adminDeleteTrack(trackId: string) {
  try {
    await prisma.track.delete({ where: { id: trackId } });
  } catch (e) {
    handlePrismaError(e);
  }
  return { ok: true as const };
}

// --- Courses ---
export async function adminListCourses(trackId?: string) {
  try {
    const rows = await prisma.course.findMany({
      where: trackId !== undefined ? (trackId ? { trackId } : { trackId: null }) : undefined,
      orderBy: [{ createdAt: "asc" }],
      select: {
        id: true,
        trackId: true,
        title: true,
        summary: true,
        coverImage: true,
        order: true,
        published: true,
        featuredMostPlayedOrder: true,
        createdAt: true,
        updatedAt: true,
        track: { select: { id: true, title: true, slug: true } },
      },
    });
    const trendingById = await sqlGetTrendingOrderMap(rows.map((c) => c.id));
    const tagsById = await sqlGetCourseTagMap(rows.map((c) => c.id));
    return rows.map((c) => ({
      ...c,
      ...tagsById.get(c.id) ?? EMPTY_COURSE_TAGS,
      featuredTrendingOrder: trendingById.get(c.id) ?? null,
    }));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const metaMsg = e instanceof Prisma.PrismaClientKnownRequestError ? (e.meta as { message?: string })?.message : undefined;
    if (msg?.includes("does not exist") || metaMsg?.includes("does not exist")) {
      return adminListCoursesRawSafe(trackId);
    }
    throw e;
  }
}

/** Courses list when DB is missing order / featured / track relation columns. */
async function adminListCoursesRawSafe(trackId?: string) {
  const where =
    trackId !== undefined ? (trackId ? "WHERE track_id = $1" : "WHERE track_id IS NULL") : "";
  const args = trackId ? [trackId] : [];
  const rows = await prisma.$queryRawUnsafe<
    { id: string; track_id: string | null; title: string; summary: string | null; cover_image: string | null; published: boolean; created_at: Date; updated_at: Date }[]
  >(
    `SELECT id, track_id, title, summary, cover_image, published, created_at, updated_at FROM courses ${where} ORDER BY created_at ASC`,
    ...args
  );
  return rows.map((row) => ({
    id: row.id,
    trackId: row.track_id,
    title: row.title,
    summary: row.summary,
    coverImage: row.cover_image,
    order: 0,
    published: row.published,
    featuredMostPlayedOrder: null as number | null,
    featuredTrendingOrder: null as number | null,
    tagGuided: false,
    tagDeepDive: false,
    tagBasics: false,
    tagNew: false,
    tagTopRated: false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    track: null as { id: string; title: string; slug: string } | null,
  }));
}

export async function adminGetCourse(id: string) {
  try {
    const c = await prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        trackId: true,
        title: true,
        summary: true,
        coverImage: true,
        instructorName: true,
        instructorImage: true,
        introVideoMuxPlaybackId: true,
        order: true,
        published: true,
        featuredNewOrder: true,
        featuredMostPlayedOrder: true,
        totalDurationMinutes: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        track: true,
        modules: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
      },
    });
    if (!c) throw new AppError("NOT_FOUND", 404, "Course not found");
    // Optional: get mentorId from DB if column exists (for course–mentor link)
    let mentorId: string | null = null;
    try {
      const rows = await prisma.$queryRaw<{ mentor_id: string | null }[]>`SELECT mentor_id FROM courses WHERE id = ${id}`;
      mentorId = rows[0]?.mentor_id ?? null;
    } catch {
      // mentor_id column may not exist yet (run prisma migrate deploy)
    }
    const tags = await sqlGetCourseTags(id);
    return {
      ...c,
      ...tags,
      mentorId,
      featuredTrendingOrder: await sqlGetTrendingOrder(id),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const metaMsg = e instanceof Prisma.PrismaClientKnownRequestError ? (e.meta as { message?: string })?.message : undefined;
    if (msg?.includes("does not exist") || metaMsg?.includes("does not exist")) {
      return adminGetCourseSafeFallback(id);
    }
    throw e;
  }
}

export async function adminCreateCourse(input: unknown) {
  try {
    const data = parse(CourseCreateSchema, input);
    const mentorId = data.mentorId ?? null;
    let instructorName = data.instructorName ?? null;
    let instructorImage = data.instructorImage ?? null;
    if (mentorId) {
      const mentor = await prisma.mentor.findUnique({ where: { id: mentorId }, select: { name: true, photo: true } });
      if (mentor) {
        instructorName = mentor.name;
        instructorImage = mentor.photo;
      }
    }
    const { mentorId: _m, trackId, ...rest } = data;
    const course = await prisma.course.create({
      data: {
        ...rest,
        trackId: trackId ?? null,
        instructorName: instructorName ?? undefined,
        instructorImage: instructorImage ?? undefined,
      },
    });
    if (mentorId) {
      try {
        await prisma.$executeRaw`UPDATE courses SET mentor_id = ${mentorId} WHERE id = ${course.id}`;
      } catch {
        // mentor_id column may not exist yet
      }
    }
    return course;
  } catch (e) {
    handlePrismaError(e);
  }
}

/** When migration (featured_new_order etc.) is not applied, update via raw SQL. Tries featured columns first so New/Most played show when migration is applied. */
async function courseUpdateRawSafe(courseId: string, data: Record<string, unknown>) {
  const baseUpdates: string[] = [];
  const baseValues: unknown[] = [];
  let idx = 0;
  const set = (col: string, v: unknown) => {
    if (v === undefined) return;
    idx += 1;
    baseUpdates.push(`"${col}" = $${idx}`);
    baseValues.push(v);
  };
  set("track_id", data.trackId ?? null);
  set("title", data.title);
  set("summary", data.summary);
  set("cover_image", data.coverImage);
  set("published", Boolean(data.published));

  const runUpdate = (updates: string[], values: unknown[]) => {
    if (updates.length === 0) return Promise.resolve();
    const lastIdx = values.length + 1;
    const allValues = [...values, courseId];
    return prisma.$executeRawUnsafe(
      `UPDATE courses SET ${updates.join(", ")}, "updated_at" = now() WHERE id = $${lastIdx}`,
      ...allValues
    );
  };

  const featuredUpdates = [...baseUpdates];
  const featuredValues = [...baseValues];
  let featuredIdx = idx;
  if (data.featuredNewOrder !== undefined) {
    featuredIdx += 1;
    featuredUpdates.push(`"featured_new_order" = $${featuredIdx}`);
    featuredValues.push(data.featuredNewOrder === null || data.featuredNewOrder === "" ? null : Number(data.featuredNewOrder));
  }
  if (data.featuredMostPlayedOrder !== undefined) {
    featuredIdx += 1;
    featuredUpdates.push(`"featured_most_played_order" = $${featuredIdx}`);
    featuredValues.push(data.featuredMostPlayedOrder === null || data.featuredMostPlayedOrder === "" ? null : Number(data.featuredMostPlayedOrder));
  }
  if (data.featuredTrendingOrder !== undefined) {
    featuredIdx += 1;
    featuredUpdates.push(`"featured_trending_order" = $${featuredIdx}`);
    featuredValues.push(data.featuredTrendingOrder === null || data.featuredTrendingOrder === "" ? null : Number(data.featuredTrendingOrder));
  }
  const tagPatch: Partial<CourseCatalogTagState> = {};
  if (data.tagGuided !== undefined) tagPatch.tagGuided = Boolean(data.tagGuided);
  if (data.tagDeepDive !== undefined) tagPatch.tagDeepDive = Boolean(data.tagDeepDive);
  if (data.tagBasics !== undefined) tagPatch.tagBasics = Boolean(data.tagBasics);
  if (data.tagNew !== undefined) tagPatch.tagNew = Boolean(data.tagNew);
  if (data.tagTopRated !== undefined) tagPatch.tagTopRated = Boolean(data.tagTopRated);

  try {
    if (featuredUpdates.length > 0) {
      await runUpdate(featuredUpdates, featuredValues);
      if (Object.keys(tagPatch).length > 0) {
        try {
          await sqlUpdateCourseTags(courseId, tagPatch);
        } catch {
          // tag_* columns may not exist yet
        }
      }
      return courseFindRawSafe(courseId);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (!msg?.includes("does not exist")) throw e;
    // featured_* columns don't exist; fall back to base columns only
  }

  if (baseUpdates.length === 0) {
    if (Object.keys(tagPatch).length > 0) {
      try {
        await sqlUpdateCourseTags(courseId, tagPatch);
      } catch {
        // tag_* columns may not exist yet
      }
    }
    return courseFindRawSafe(courseId);
  }
  await runUpdate(baseUpdates, baseValues);
  if (Object.keys(tagPatch).length > 0) {
    try {
      await sqlUpdateCourseTags(courseId, tagPatch);
    } catch {
      // tag_* columns may not exist yet
    }
  }
  return courseFindRawSafe(courseId);
}

/** Fetch course by id using only columns from the init migration so fallback works on any DB. */
async function courseFindRawSafe(courseId: string) {
  const rows = await prisma.$queryRawUnsafe<
    { id: string; track_id: string | null; title: string; summary: string | null; cover_image: string | null; published: boolean; created_at: Date; updated_at: Date }[]
  >(
    `SELECT id, track_id, title, summary, cover_image, published, created_at, updated_at FROM courses WHERE id = $1`,
    courseId
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    trackId: row.track_id,
    title: row.title,
    summary: row.summary,
    coverImage: row.cover_image,
    instructorName: null as string | null,
    instructorImage: null as string | null,
    introVideoMuxPlaybackId: null as string | null,
    order: 0,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Load course for admin detail page when DB is missing featured_* / total_duration_minutes / rating columns. */
async function adminGetCourseSafeFallback(id: string) {
  const course = await courseFindRawSafe(id);
  if (!course) throw new AppError("NOT_FOUND", 404, "Course not found");
  const modules = await prisma.module.findMany({
    where: { courseId: id },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const tags = await sqlGetCourseTags(id);
  return {
    ...course,
    mentorId: null as string | null,
    track: null as { id: string; title: string; slug: string } | null,
    modules,
    featuredNewOrder: null as number | null,
    featuredMostPlayedOrder: null as number | null,
    featuredTrendingOrder: null as number | null,
    totalDurationMinutes: null as number | null,
    rating: null as number | null,
    ...tags,
  };
}

export async function adminUpdateCourse(courseId: string, input: unknown) {
  const data = parse(CourseUpdateSchema, input) as Record<string, unknown> & { mentorId?: string | null };
  let updateData = { ...data };
  let mentorIdToSet: string | null | undefined = data.mentorId;
  if (data.mentorId !== undefined) {
    const mentorId = data.mentorId || null;
    if (mentorId) {
      const mentor = await prisma.mentor.findUnique({ where: { id: mentorId }, select: { name: true, photo: true } });
      if (mentor) {
        updateData = { ...updateData, instructorName: mentor.name, instructorImage: mentor.photo };
      }
    }
  }
  // Don't pass mentorId, trending order, or catalog tags to Prisma (client may lag behind migrations).
  const {
    mentorId: _m,
    featuredTrendingOrder: trendingOrderToSet,
    tagGuided,
    tagDeepDive,
    tagBasics,
    tagNew,
    tagTopRated,
    ...dataForPrisma
  } = updateData;
  const tagPatch: Partial<CourseCatalogTagState> = {};
  if (tagGuided !== undefined) tagPatch.tagGuided = Boolean(tagGuided);
  if (tagDeepDive !== undefined) tagPatch.tagDeepDive = Boolean(tagDeepDive);
  if (tagBasics !== undefined) tagPatch.tagBasics = Boolean(tagBasics);
  if (tagNew !== undefined) tagPatch.tagNew = Boolean(tagNew);
  if (tagTopRated !== undefined) tagPatch.tagTopRated = Boolean(tagTopRated);
  try {
    const updated = await prisma.course.update({ where: { id: courseId }, data: dataForPrisma });
    if (mentorIdToSet !== undefined) {
      try {
        await prisma.$executeRaw`UPDATE courses SET mentor_id = ${mentorIdToSet} WHERE id = ${courseId}`;
      } catch {
        // mentor_id column may not exist yet
      }
    }
    if (trendingOrderToSet !== undefined) {
      await sqlSetTrendingOrder(
        courseId,
        trendingOrderToSet === null || trendingOrderToSet === "" ? null : Number(trendingOrderToSet)
      );
    }
    if (Object.keys(tagPatch).length > 0) {
      try {
        await sqlUpdateCourseTags(courseId, tagPatch);
      } catch {
        // tag_* columns may not exist yet
      }
    }
    const tags = await sqlGetCourseTags(courseId);
    return {
      ...updated,
      ...tags,
      featuredTrendingOrder: await sqlGetTrendingOrder(courseId),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const metaMsg = e instanceof Prisma.PrismaClientKnownRequestError ? (e.meta as { message?: string })?.message : undefined;
    if (msg?.includes("does not exist") || metaMsg?.includes("does not exist")) {
      return courseUpdateRawSafe(courseId, dataForPrisma);
    }
    handlePrismaError(e);
  }
}

export async function adminDeleteCourse(courseId: string) {
  try {
    await prisma.course.delete({ where: { id: courseId } });
  } catch (e) {
    handlePrismaError(e);
  }
  return { ok: true as const };
}

/** Toggle Learn page “Popular classes” visibility for a course. */
export async function adminSetCoursePopular(courseId: string, popular: boolean) {
  if (!popular) {
    try {
      return await prisma.course.update({
        where: { id: courseId },
        data: { featuredMostPlayedOrder: null },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const metaMsg =
        e instanceof Prisma.PrismaClientKnownRequestError
          ? (e.meta as { message?: string })?.message
          : undefined;
      if (msg?.includes("does not exist") || metaMsg?.includes("does not exist")) {
        return courseUpdateRawSafe(courseId, { featuredMostPlayedOrder: null });
      }
      handlePrismaError(e);
    }
  }

  const existing = await prisma.course.findUnique({
    where: { id: courseId },
    select: { featuredMostPlayedOrder: true },
  });
  if (existing?.featuredMostPlayedOrder != null) {
    return prisma.course.findUniqueOrThrow({ where: { id: courseId } });
  }

  const nextOrder =
    ((await prisma.course.aggregate({ _max: { featuredMostPlayedOrder: true } }))._max
      .featuredMostPlayedOrder ?? 0) + 1;

  try {
    return await prisma.course.update({
      where: { id: courseId },
      data: { featuredMostPlayedOrder: nextOrder },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const metaMsg =
      e instanceof Prisma.PrismaClientKnownRequestError
        ? (e.meta as { message?: string })?.message
        : undefined;
    if (msg?.includes("does not exist") || metaMsg?.includes("does not exist")) {
      return courseUpdateRawSafe(courseId, { featuredMostPlayedOrder: nextOrder });
    }
    handlePrismaError(e);
  }
}

export const MAX_TRENDING_COURSES = 6;

/** Toggle Learn page “Trending” carousel (max {@link MAX_TRENDING_COURSES} courses). */
export async function adminSetCourseTrending(courseId: string, trending: boolean) {
  if (!trending) {
    await sqlSetTrendingOrder(courseId, null);
    return prisma.course.findUniqueOrThrow({ where: { id: courseId } });
  }

  const existingOrder = await sqlGetTrendingOrder(courseId);
  if (existingOrder != null) {
    return prisma.course.findUniqueOrThrow({ where: { id: courseId } });
  }

  const trendingCount = await sqlCountTrendingCourses();
  if (trendingCount >= MAX_TRENDING_COURSES) {
    throw new AppError(
      "BAD_REQUEST",
      400,
      `Trending list is full (max ${MAX_TRENDING_COURSES} courses). Remove one first.`
    );
  }

  const nextOrder = (await sqlMaxTrendingOrder()) + 1;
  await sqlSetTrendingOrder(courseId, nextOrder);
  return prisma.course.findUniqueOrThrow({ where: { id: courseId } });
}

/** Toggle a learn catalog filter tag on a course. */
export async function adminSetCourseTag(
  courseId: string,
  tag: CourseCatalogTagKey,
  enabled: boolean
) {
  await sqlSetCourseTag(courseId, tag, enabled);
  return prisma.course.findUniqueOrThrow({ where: { id: courseId } });
}

// --- Modules ---
export async function adminListModules(courseId?: string) {
  return prisma.module.findMany({
    where: courseId ? { courseId } : undefined,
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export type ModuleWithLessons = Prisma.ModuleGetPayload<{
  include: { course: true; lessons: true };
}>;

/** Lesson with optional video, article, and optionally latest videoUpload for status. */
export type LessonWithVideoUpload = ModuleWithLessons["lessons"][number] & {
  video?: { id: string; muxPlaybackId: string } | null;
  article?: { id: string; body: string } | null;
  videoUploads?: { id: string; status: string }[];
};

export async function adminGetModule(id: string): Promise<Omit<ModuleWithLessons, "lessons"> & { lessons: LessonWithVideoUpload[] }> {
  const m = await prisma.module.findUnique({
    where: { id },
    include: {
      course: {
        select: {
          id: true,
          trackId: true,
          title: true,
          summary: true,
          coverImage: true,
          instructorName: true,
          instructorImage: true,
          introVideoMuxPlaybackId: true,
          order: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      lessons: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        include: {
          video: { select: { id: true, muxPlaybackId: true } },
          article: { select: { id: true, body: true } },
          videoUploads: { take: 1, orderBy: { createdAt: "desc" }, select: { id: true, status: true } },
        },
      },
    },
  });
  if (!m) throw new AppError("NOT_FOUND", 404, "Module not found");
  return m as Omit<ModuleWithLessons, "lessons"> & { lessons: LessonWithVideoUpload[] };
}

export async function adminCreateModule(input: unknown) {
  try {
    return await prisma.module.create({ data: parse(ModuleCreateSchema, input) });
  } catch (e) {
    handlePrismaError(e);
  }
}

export async function adminUpdateModule(moduleId: string, input: unknown) {
  try {
    return await prisma.module.update({ where: { id: moduleId }, data: parse(ModuleUpdateSchema, input) });
  } catch (e) {
    handlePrismaError(e);
  }
}

export async function adminDeleteModule(moduleId: string) {
  try {
    await prisma.module.delete({ where: { id: moduleId } });
  } catch (e) {
    handlePrismaError(e);
  }
  return { ok: true as const };
}

// --- Lessons ---
export async function adminListLessons(moduleId?: string) {
  return prisma.lesson.findMany({
    where: moduleId ? { moduleId } : undefined,
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function adminGetLesson(id: string) {
  const l = await prisma.lesson.findUnique({ where: { id }, include: { module: true } });
  if (!l) throw new AppError("NOT_FOUND", 404, "Lesson not found");
  return l;
}

export async function adminCreateLesson(input: unknown) {
  try {
    return await prisma.lesson.create({ data: parse(LessonCreateSchema, input) });
  } catch (e) {
    handlePrismaError(e);
  }
}

export async function adminUpdateLesson(lessonId: string, input: unknown) {
  try {
    return await prisma.lesson.update({ where: { id: lessonId }, data: parse(LessonUpdateSchema, input) });
  } catch (e) {
    handlePrismaError(e);
  }
}

export async function adminDeleteLesson(lessonId: string) {
  try {
    await prisma.lesson.delete({ where: { id: lessonId } });
  } catch (e) {
    handlePrismaError(e);
  }
  return { ok: true as const };
}

/** Remove the video link from a lesson so a new video can be uploaded. */
export async function adminRemoveLessonVideo(lessonId: string) {
  try {
    await prisma.lessonVideo.deleteMany({ where: { lessonId } });
  } catch (e) {
    handlePrismaError(e);
  }
  return { ok: true as const };
}

/** Create or update article body for an ARTICLE lesson. */
export async function adminUpsertLessonArticle(lessonId: string, input: unknown) {
  const data = parse(LessonArticleUpsertSchema, input);
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, type: true },
  });
  if (!lesson) throw new AppError("NOT_FOUND", 404, "Lesson not found");
  if (lesson.type !== "ARTICLE") {
    throw new AppError("BAD_REQUEST", 400, "Only ARTICLE lessons can have article content");
  }
  try {
    return await prisma.lessonArticle.upsert({
      where: { lessonId },
      create: { lessonId, body: data.body },
      update: { body: data.body },
      select: { id: true, lessonId: true, body: true },
    });
  } catch (e) {
    handlePrismaError(e);
  }
}

// --- Mentors ---

export { MAX_FEATURED_MENTORS, MAX_LANDING_POPULAR_MENTORS };

export async function adminListMentors() {
  const rows = await prisma.mentor.findMany({ orderBy: { createdAt: "asc" } });
  const mentorIds = rows.map((m) => m.id);
  const [featuredById, landingPopularById] = await Promise.all([
    sqlGetFeaturedOrderMap(mentorIds),
    sqlGetLandingPopularOrderMap(mentorIds),
  ]);
  return rows.map((m) => ({
    ...m,
    featuredOrder: featuredById.get(m.id) ?? null,
    landingPopularOrder: landingPopularById.get(m.id) ?? null,
  }));
}

export async function adminGetMentor(id: string) {
  const m = await prisma.mentor.findUnique({ where: { id } });
  if (!m) throw new AppError("NOT_FOUND", 404, "Mentor not found");
  return {
    ...m,
    featuredOrder: await sqlGetFeaturedOrder(id),
    landingPopularOrder: await sqlGetLandingPopularOrder(id),
  };
}

/** Toggle Learn page featured mentor strip (max {@link MAX_FEATURED_MENTORS}). */
export async function adminSetMentorFeatured(mentorId: string, featured: boolean) {
  if (!featured) {
    await sqlSetFeaturedOrder(mentorId, null);
    return adminGetMentor(mentorId);
  }

  const existingOrder = await sqlGetFeaturedOrder(mentorId);
  if (existingOrder != null) {
    return adminGetMentor(mentorId);
  }

  const featuredCount = await sqlCountFeaturedMentors();
  if (featuredCount >= MAX_FEATURED_MENTORS) {
    throw new AppError(
      "BAD_REQUEST",
      400,
      `Featured mentor list is full (max ${MAX_FEATURED_MENTORS}). Remove one first.`
    );
  }

  const nextOrder = (await sqlMaxFeaturedOrder()) + 1;
  await sqlSetFeaturedOrder(mentorId, nextOrder);
  return adminGetMentor(mentorId);
}

/** Toggle guest home “Current Mosts” mentor strip (max {@link MAX_LANDING_POPULAR_MENTORS}). */
export async function adminSetMentorLandingPopular(mentorId: string, popular: boolean) {
  if (!popular) {
    await sqlSetLandingPopularOrder(mentorId, null);
    return adminGetMentor(mentorId);
  }

  const existingOrder = await sqlGetLandingPopularOrder(mentorId);
  if (existingOrder != null) {
    return adminGetMentor(mentorId);
  }

  const popularCount = await sqlCountLandingPopularMentors();
  if (popularCount >= MAX_LANDING_POPULAR_MENTORS) {
    throw new AppError(
      "BAD_REQUEST",
      400,
      `Popular home mentor list is full (max ${MAX_LANDING_POPULAR_MENTORS}). Remove one first.`
    );
  }

  const nextOrder = (await sqlMaxLandingPopularOrder()) + 1;
  await sqlSetLandingPopularOrder(mentorId, nextOrder);
  return adminGetMentor(mentorId);
}

export async function adminCreateMentor(input: unknown) {
  const data = parse(MentorCreateSchema, input);
  const passwordHash = await hashPassword(data.password);

  try {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash,
          emailVerified: new Date(),
          roles: { create: { role: Role.MENTOR } },
        },
        select: { id: true },
      });

      return tx.mentor.create({
        data: {
          name: data.name,
          photo: data.photo,
          certificateName: data.certificateName,
          aboutMe: data.aboutMe,
          userId: user.id,
          ...(data.featuredOrder !== undefined ? { featuredOrder: data.featuredOrder } : {}),
          ...(data.landingPopularOrder !== undefined
            ? { landingPopularOrder: data.landingPopularOrder }
            : {}),
        },
      });
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new AppError("CONFLICT", 409, "Email is already registered");
    }
    handlePrismaError(e);
  }
}

export async function adminUpdateMentor(mentorId: string, input: unknown) {
  const data = parse(MentorUpdateSchema, input) as Record<string, unknown> & {
    featuredOrder?: number | null;
    landingPopularOrder?: number | null;
  };
  const {
    featuredOrder: featuredOrderToSet,
    landingPopularOrder: landingPopularOrderToSet,
    ...dataForPrisma
  } = data;
  try {
    const updated = await prisma.mentor.update({
      where: { id: mentorId },
      data: dataForPrisma,
    });
    if (featuredOrderToSet !== undefined) {
      await sqlSetFeaturedOrder(
        mentorId,
        featuredOrderToSet === null ? null : Number(featuredOrderToSet)
      );
    }
    if (landingPopularOrderToSet !== undefined) {
      await sqlSetLandingPopularOrder(
        mentorId,
        landingPopularOrderToSet === null ? null : Number(landingPopularOrderToSet)
      );
    }
    return {
      ...updated,
      featuredOrder: await sqlGetFeaturedOrder(mentorId),
      landingPopularOrder: await sqlGetLandingPopularOrder(mentorId),
    };
  } catch (e) {
    handlePrismaError(e);
  }
}

export async function adminDeleteMentor(mentorId: string) {
  try {
    await prisma.mentor.delete({ where: { id: mentorId } });
  } catch (e) {
    handlePrismaError(e);
  }
  return { ok: true as const };
}
