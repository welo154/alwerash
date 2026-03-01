// file: src/server/content/admin.service.ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import {
  SchoolCreateSchema,
  SchoolUpdateSchema,
  TrackCreateSchema,
  TrackUpdateSchema,
  CourseCreateSchema,
  CourseUpdateSchema,
  ModuleCreateSchema,
  ModuleUpdateSchema,
  LessonCreateSchema,
  LessonUpdateSchema,
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

// --- Schools ---
export async function adminListSchools() {
  return prisma.school.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
}

export async function adminGetSchool(id: string) {
  const s = await prisma.school.findUnique({
    where: { id },
    include: { tracks: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] } },
  });
  if (!s) throw new AppError("NOT_FOUND", 404, "School not found");
  return s;
}

export async function adminCreateSchool(input: unknown) {
  try {
    return await prisma.school.create({ data: parse(SchoolCreateSchema, input) });
  } catch (e) {
    handlePrismaError(e);
  }
}

export async function adminUpdateSchool(schoolId: string, input: unknown) {
  try {
    return await prisma.school.update({ where: { id: schoolId }, data: parse(SchoolUpdateSchema, input) });
  } catch (e) {
    handlePrismaError(e);
  }
}

export async function adminDeleteSchool(schoolId: string) {
  try {
    await prisma.school.delete({ where: { id: schoolId } });
  } catch (e) {
    handlePrismaError(e);
  }
  return { ok: true as const };
}

// --- Tracks ---
export async function adminListTracks(schoolId?: string) {
  try {
    return await prisma.track.findMany({
      ...(schoolId && { where: { schoolId } }),
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      include: { school: { select: { id: true, title: true, slug: true } } },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const metaMsg = e instanceof Prisma.PrismaClientKnownRequestError ? (e.meta as { message?: string })?.message : undefined;
    if (msg?.includes("does not exist") || metaMsg?.includes("does not exist")) {
      return adminListTracksRawSafe(schoolId);
    }
    throw e;
  }
}

/** Tracks list when DB is missing school_id / cover_image columns. */
async function adminListTracksRawSafe(schoolId?: string) {
  const rows = await prisma.$queryRawUnsafe<
    { id: string; title: string; slug: string; description: string | null; order: number; published: boolean; created_at: Date; updated_at: Date }[]
  >(
    `SELECT id, title, slug, description, "order", published, created_at, updated_at FROM tracks ORDER BY "order" ASC, created_at ASC`
  );
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    order: row.order,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    schoolId: null as unknown as string,
    coverImage: null as string | null,
    school: null as { id: string; title: string; slug: string } | null,
  }));
}

export async function adminGetTrack(id: string) {
  const t = await prisma.track.findUnique({ where: { id }, include: { school: true } });
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
    return await prisma.course.findMany({
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
        createdAt: true,
        updatedAt: true,
        track: { select: { id: true, title: true, slug: true } },
      },
    });
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
        createdAt: true,
        updatedAt: true,
        track: true,
        modules: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
      },
    });
    if (!c) throw new AppError("NOT_FOUND", 404, "Course not found");
    return {
      ...c,
      featuredNewOrder: null as number | null,
      featuredMostPlayedOrder: null as number | null,
      totalDurationMinutes: null as number | null,
      rating: null as number | null,
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
    return await prisma.course.create({
      data: { ...data, trackId: data.trackId ?? null },
    });
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

  try {
    if (featuredUpdates.length > 0) {
      await runUpdate(featuredUpdates, featuredValues);
      return courseFindRawSafe(courseId);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (!msg?.includes("does not exist")) throw e;
    // featured_* columns don't exist; fall back to base columns only
  }

  if (baseUpdates.length === 0) return courseFindRawSafe(courseId);
  await runUpdate(baseUpdates, baseValues);
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
  return {
    ...course,
    track: null as { id: string; title: string; slug: string; schoolId: string | null; school: unknown } | null,
    modules,
    featuredNewOrder: null as number | null,
    featuredMostPlayedOrder: null as number | null,
    totalDurationMinutes: null as number | null,
    rating: null as number | null,
  };
}

export async function adminUpdateCourse(courseId: string, input: unknown) {
  const data = parse(CourseUpdateSchema, input) as Record<string, unknown>;
  try {
    return await prisma.course.update({ where: { id: courseId }, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const metaMsg = e instanceof Prisma.PrismaClientKnownRequestError ? (e.meta as { message?: string })?.message : undefined;
    if (msg?.includes("does not exist") || metaMsg?.includes("does not exist")) {
      return courseUpdateRawSafe(courseId, data);
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

/** Lesson with optional video (and optionally latest videoUpload for status). */
export type LessonWithVideoUpload = ModuleWithLessons["lessons"][number] & {
  video?: { id: string; muxPlaybackId: string } | null;
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
