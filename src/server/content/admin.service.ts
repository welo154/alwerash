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
  return prisma.track.findMany({
    ...(schoolId && { where: { schoolId } }),
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { school: { select: { id: true, title: true, slug: true } } },
  });
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
  return prisma.course.findMany({
    where: trackId !== undefined ? (trackId ? { trackId } : { trackId: null }) : undefined,
    orderBy: [{ createdAt: "asc" }],
    include: { track: { select: { id: true, title: true, slug: true } } },
  });
}

export async function adminGetCourse(id: string) {
  const c = await prisma.course.findUnique({
    where: { id },
    include: {
      track: true,
      modules: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
    },
  });
  if (!c) throw new AppError("NOT_FOUND", 404, "Course not found");
  return c;
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

export async function adminUpdateCourse(courseId: string, input: unknown) {
  try {
    const data = parse(CourseUpdateSchema, input);
    return await prisma.course.update({ where: { id: courseId }, data });
  } catch (e) {
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

export async function adminGetModule(id: string) {
  const m = await prisma.module.findUnique({
    where: { id },
    include: {
      course: true,
      lessons: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
    },
  });
  if (!m) throw new AppError("NOT_FOUND", 404, "Module not found");
  return m;
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
