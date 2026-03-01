// file: src/server/content/content.schemas.ts
import { z } from "zod";

// --- Shared ---

/** CUID format (CUID1: 25 chars, CUID2: 24 chars - starts with c, alphanumeric) */
export const Cuid = z.string().regex(/^c[a-z0-9]{20,30}$/i, "Invalid ID format");

/** Slug: lowercase, trimmed, kebab-case */
export const Slug = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(80, "Slug must be at most 80 characters")
  .transform((s) => s.trim().toLowerCase())
  .refine(
    (s) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s),
    "Slug must be lowercase letters, numbers, and hyphens only"
  );

/** URL or empty string (for optional coverImage, etc.). Invalid URLs are treated as undefined. */
export const OptionalUrl = z
  .string()
  .optional()
  .transform((v) => {
    if (!v || (v = v.trim()) === "") return undefined;
    try {
      const url = new URL(v);
      return url.toString().length <= 2000 ? url.toString() : undefined;
    } catch {
      return undefined;
    }
  });

/** Pagination query params */
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// --- School ---

export const SchoolCreateSchema = z.object({
  title: z.string().min(2, "Title too short").max(200),
  slug: Slug,
  description: z.string().max(2000).optional(),
  order: z.number().int().min(0).max(1_000_000).optional(),
  published: z.boolean().optional(),
});

export const SchoolUpdateSchema = SchoolCreateSchema.partial();

// --- Track ---

export const TrackCreateSchema = z.object({
  schoolId: Cuid,
  title: z.string().min(2, "Title too short").max(200),
  slug: Slug,
  description: z.string().max(2000).optional(),
  coverImage: OptionalUrl,
  order: z.number().int().min(0).max(1_000_000).optional(),
  published: z.boolean().optional(),
});

export const TrackUpdateSchema = TrackCreateSchema.partial().omit({ schoolId: true });

// --- Course ---

export const OptionalCuid = z.union([Cuid, z.literal(""), z.undefined()]).transform((v) => (v === "" || v === undefined ? undefined : v));

export const CourseCreateSchema = z.object({
  trackId: OptionalCuid,
  title: z.string().min(2, "Title too short").max(200),
  summary: z.string().max(2000).optional(),
  coverImage: OptionalUrl,
  instructorName: z.string().max(200).optional().transform((v) => (v?.trim() || undefined)),
  instructorImage: OptionalUrl,
  order: z.number().int().min(0).max(1_000_000).optional(),
  published: z.boolean().optional(),
  featuredNewOrder: z.number().int().min(0).max(1_000_000).nullable().optional(),
  featuredMostPlayedOrder: z.number().int().min(0).max(1_000_000).nullable().optional(),
  totalDurationMinutes: z.number().int().min(0).max(1_000_000).nullable().optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
});

export const CourseUpdateSchema = CourseCreateSchema.partial().extend({
  trackId: z.union([Cuid, z.literal("")]).optional().transform((v) => (v === "" ? null : v)),
});

// --- Module ---

export const ModuleCreateSchema = z.object({
  courseId: Cuid,
  title: z.string().min(2, "Title too short").max(200),
  order: z.number().int().min(0).max(1_000_000).optional(),
});

export const ModuleUpdateSchema = ModuleCreateSchema.partial().omit({ courseId: true });

// --- Lesson ---

export const LessonTypeEnum = z.enum(["VIDEO", "ARTICLE", "RESOURCE"]);

export const LessonCreateSchema = z.object({
  moduleId: Cuid,
  title: z.string().min(2, "Title too short").max(200),
  type: LessonTypeEnum.optional(),
  order: z.number().int().min(0).max(1_000_000).optional(),
  published: z.boolean().optional(),
});

export const LessonUpdateSchema = LessonCreateSchema.partial().omit({ moduleId: true });

// --- Assignment ---

export const AssignmentCreateSchema = z.object({
  lessonId: Cuid,
  title: z.string().min(2, "Title too short").max(200),
  instructions: z.string().max(10_000).optional(),
  rubricJson: z.record(z.unknown()).optional(),
  published: z.boolean().optional(),
});

export const AssignmentUpdateSchema = AssignmentCreateSchema.partial().omit({ lessonId: true });
