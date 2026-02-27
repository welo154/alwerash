/**
 * Week 4 — Progress tracking: request/response schemas for lesson and course progress APIs.
 */
import { z } from "zod";

/** Body for PATCH/POST lesson progress (debounced position + optional duration for completion). */
export const updateLessonProgressBodySchema = z.object({
  positionSeconds: z.number().min(0).finite(),
  durationSeconds: z.number().min(0).finite().optional(),
});

export type UpdateLessonProgressBody = z.infer<typeof updateLessonProgressBodySchema>;

/** GET /api/learning/progress/lesson/[lessonId] — resume playback. */
export const lessonProgressResponseSchema = z.object({
  lessonId: z.string(),
  lastPositionSeconds: z.number(),
  completedAt: z.string().datetime().nullable(),
});

export type LessonProgressResponse = z.infer<typeof lessonProgressResponseSchema>;

/** GET /api/learning/progress/course/[courseId] — course progress %. */
export const moduleProgressSchema = z.object({
  moduleId: z.string(),
  title: z.string(),
  completedCount: z.number(),
  totalCount: z.number(),
  percent: z.number().min(0).max(100),
});

export const courseProgressResponseSchema = z.object({
  courseId: z.string(),
  completedCount: z.number(),
  totalCount: z.number(),
  progressPercent: z.number().min(0).max(100),
  modules: z.array(moduleProgressSchema).optional(),
});

export type CourseProgressResponse = z.infer<typeof courseProgressResponseSchema>;
export type ModuleProgress = z.infer<typeof moduleProgressSchema>;
