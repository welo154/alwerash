/**
 * Minimal payloads must parse: every optional field may be left out entirely.
 * Zod 4 made `z.union([..., z.undefined()])` a required key, which silently
 * broke "create course" without a track or mentor; these tests guard that.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("@/server/db/prisma", () => ({ prisma: {} }));

const s = await import("./content.schemas");
const { UpsertSubmissionSchema } = await import("@/server/learning/submission.service");
const { RegisterInput } = await import("@/server/auth/auth.service");
const { updateLessonProgressBodySchema } = await import("@/server/learning/progress.schemas");

const CUID = "ckxyz1234567890abcdefghij";

function ok(schema: { safeParse: (v: unknown) => { success: boolean; error?: { issues: unknown[] } } }, value: unknown) {
  const res = schema.safeParse(value);
  expect(res.success, JSON.stringify(res.error?.issues)).toBe(true);
}

describe("minimal payloads parse", () => {
  it("track", () => ok(s.TrackCreateSchema, { title: "Design", slug: "design" }));
  it("course without track or mentor", () => ok(s.CourseCreateSchema, { title: "Intro to Figma" }));
  it("course with an empty track (form 'none')", () => {
    const res = s.CourseCreateSchema.safeParse({ title: "Intro", trackId: "", mentorId: "" });
    expect(res.success).toBe(true);
    expect(res.data?.trackId).toBeUndefined();
  });
  it("course update with nothing", () => ok(s.CourseUpdateSchema, {}));
  it("module", () => ok(s.ModuleCreateSchema, { courseId: CUID, title: "Module 1" }));
  it("lesson", () => ok(s.LessonCreateSchema, { moduleId: CUID, title: "Lesson 1" }));
  it("assignment", () => ok(s.AssignmentCreateSchema, { courseId: CUID, title: "Final project" }));
  it("mentor update", () => ok(s.MentorUpdateSchema, {}));
  it("submission draft with no link", () => ok(UpsertSubmissionSchema, {}));
  it("submission with an empty link", () => {
    const res = UpsertSubmissionSchema.safeParse({ externalLink: "  " });
    expect(res.success).toBe(true);
    expect(res.data?.externalLink).toBeUndefined();
  });
  it("registration without name or country", () => ok(RegisterInput, { email: "A@B.co", password: "Abcdefghij1" }));
  it("progress with position only", () => ok(updateLessonProgressBodySchema, { positionSeconds: 12 }));
});

describe("still rejects bad input", () => {
  it("course with a malformed track id", () => {
    expect(s.CourseCreateSchema.safeParse({ title: "Intro", trackId: "not a cuid!" }).success).toBe(false);
  });
  it("submission with a non-URL link", () => {
    expect(UpsertSubmissionSchema.safeParse({ externalLink: "javascript:alert(1)" }).success).toBe(false);
  });
});
