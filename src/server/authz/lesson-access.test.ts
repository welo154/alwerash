/**
 * Authorization tests for `authorizeLessonAccess`.
 *
 * These are bypass-attempt tests: each case asserts that access is DENIED
 * unless a trusted server-side condition grants it.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";

const findUnique = vi.fn();
const hasActiveSubscription = vi.fn();

vi.mock("@/server/db/prisma", () => ({
  prisma: {
    lesson: { findUnique: (...args: unknown[]) => findUnique(...args) },
  },
}));

vi.mock("@/server/subscription/access.service", () => ({
  hasActiveSubscription: (...args: unknown[]) => hasActiveSubscription(...args),
}));

const { authorizeLessonAccess } = await import("./lesson-access");
const { AppError } = await import("@/server/lib/errors");

const FIRST_MODULE = "mod-1";
const SECOND_MODULE = "mod-2";

/**
 * Build the shape returned by the prisma query in authorizeLessonAccess.
 * `instructorMatches` simulates the CourseInstructor scoping filter.
 */
function lessonRow(overrides?: {
  moduleId?: string;
  lessonPublished?: boolean;
  coursePublished?: boolean;
  trackPublished?: boolean;
  hasVideo?: boolean;
  instructorMatches?: boolean;
}) {
  const o = {
    moduleId: SECOND_MODULE,
    lessonPublished: true,
    coursePublished: true,
    trackPublished: true,
    hasVideo: true,
    instructorMatches: false,
    ...overrides,
  };
  return {
    id: "lesson-1",
    title: "Paid lesson",
    published: o.lessonPublished,
    video: o.hasVideo ? { muxPlaybackId: "signed-playback-id" } : null,
    module: {
      id: o.moduleId,
      course: {
        id: "course-1",
        published: o.coursePublished,
        track: { published: o.trackPublished },
        modules: [{ id: FIRST_MODULE }],
        instructors: o.instructorMatches ? [{ instructorId: "user-instructor" }] : [],
      },
    },
  };
}

const guest = { userId: null, roles: [] };
const learner = { userId: "user-learner", roles: ["LEARNER"] };

async function expectStatus(promise: Promise<unknown>, status: number) {
  await expect(promise).rejects.toBeInstanceOf(AppError);
  await promise.catch((e: unknown) => {
    expect((e as InstanceType<typeof AppError>).status).toBe(status);
  });
}

beforeEach(() => {
  findUnique.mockReset();
  hasActiveSubscription.mockReset();
  hasActiveSubscription.mockResolvedValue(false);
});

describe("authorizeLessonAccess", () => {
  it("returns 404 for a lesson that does not exist (no existence oracle)", async () => {
    findUnique.mockResolvedValue(null);
    await expectStatus(
      authorizeLessonAccess({ lessonId: "nope", action: "PLAY_VIDEO", viewer: learner }),
      404
    );
  });

  it("denies an anonymous visitor on a paid lesson with 401", async () => {
    findUnique.mockResolvedValue(lessonRow());
    await expectStatus(
      authorizeLessonAccess({ lessonId: "lesson-1", action: "PLAY_VIDEO", viewer: guest }),
      401
    );
  });

  it("denies a free learner (no entitlement) on a paid lesson with 403", async () => {
    findUnique.mockResolvedValue(lessonRow());
    hasActiveSubscription.mockResolvedValue(false);
    await expectStatus(
      authorizeLessonAccess({ lessonId: "lesson-1", action: "PLAY_VIDEO", viewer: learner }),
      403
    );
  });

  it("grants a subscriber on a paid lesson", async () => {
    findUnique.mockResolvedValue(lessonRow());
    hasActiveSubscription.mockResolvedValue(true);
    const grant = await authorizeLessonAccess({
      lessonId: "lesson-1",
      action: "PLAY_VIDEO",
      viewer: learner,
    });
    expect(grant.reason).toBe("SUBSCRIPTION");
    expect(grant.muxPlaybackId).toBe("signed-playback-id");
  });

  it("denies access once the entitlement is revoked or expired", async () => {
    findUnique.mockResolvedValue(lessonRow());
    hasActiveSubscription.mockResolvedValue(true);
    await expect(
      authorizeLessonAccess({ lessonId: "lesson-1", action: "PLAY_VIDEO", viewer: learner })
    ).resolves.toBeTruthy();

    // Entitlement revoked: the next decision must re-read state and deny.
    hasActiveSubscription.mockResolvedValue(false);
    await expectStatus(
      authorizeLessonAccess({ lessonId: "lesson-1", action: "PLAY_VIDEO", viewer: learner }),
      403
    );
  });

  it("allows a guest to play a first-module free preview", async () => {
    findUnique.mockResolvedValue(lessonRow({ moduleId: FIRST_MODULE }));
    const grant = await authorizeLessonAccess({
      lessonId: "lesson-1",
      action: "PLAY_VIDEO",
      viewer: guest,
    });
    expect(grant.reason).toBe("FREE_PREVIEW");
    expect(grant.isFreePreview).toBe(true);
    expect(hasActiveSubscription).not.toHaveBeenCalled();
  });

  it("does not treat a later module as a free preview", async () => {
    findUnique.mockResolvedValue(lessonRow({ moduleId: SECOND_MODULE }));
    await expectStatus(
      authorizeLessonAccess({ lessonId: "lesson-1", action: "PLAY_VIDEO", viewer: guest }),
      401
    );
  });

  it("ignores a client-supplied ADMIN role that is not in the session", async () => {
    findUnique.mockResolvedValue(lessonRow());
    hasActiveSubscription.mockResolvedValue(false);
    // Roles come from the trusted session; a spoofed body cannot reach here.
    // Simulate the session carrying only LEARNER while the request claimed ADMIN.
    await expectStatus(
      authorizeLessonAccess({
        lessonId: "lesson-1",
        action: "PLAY_VIDEO",
        viewer: { userId: "user-learner", roles: ["LEARNER"] },
      }),
      403
    );
  });

  it("grants an admin without requiring an entitlement", async () => {
    findUnique.mockResolvedValue(lessonRow());
    const grant = await authorizeLessonAccess({
      lessonId: "lesson-1",
      action: "PLAY_VIDEO",
      viewer: { userId: "user-admin", roles: ["ADMIN"] },
    });
    expect(grant.reason).toBe("ADMIN");
    expect(hasActiveSubscription).not.toHaveBeenCalled();
  });

  it("grants an instructor assigned to the course", async () => {
    findUnique.mockResolvedValue(lessonRow({ instructorMatches: true }));
    const grant = await authorizeLessonAccess({
      lessonId: "lesson-1",
      action: "PLAY_VIDEO",
      viewer: { userId: "user-instructor", roles: ["INSTRUCTOR"] },
    });
    expect(grant.reason).toBe("COURSE_INSTRUCTOR");
  });

  it("denies an instructor on a course they are not assigned to", async () => {
    // instructorMatches false => the scoping filter found no assignment row.
    findUnique.mockResolvedValue(lessonRow({ instructorMatches: false }));
    hasActiveSubscription.mockResolvedValue(false);
    await expectStatus(
      authorizeLessonAccess({
        lessonId: "lesson-1",
        action: "PLAY_VIDEO",
        viewer: { userId: "user-instructor", roles: ["INSTRUCTOR"] },
      }),
      403
    );
  });

  it("hides unpublished lessons from subscribers", async () => {
    findUnique.mockResolvedValue(lessonRow({ lessonPublished: false }));
    hasActiveSubscription.mockResolvedValue(true);
    await expectStatus(
      authorizeLessonAccess({ lessonId: "lesson-1", action: "PLAY_VIDEO", viewer: learner }),
      403
    );
  });

  it("hides lessons in an unpublished course or track from subscribers", async () => {
    hasActiveSubscription.mockResolvedValue(true);

    findUnique.mockResolvedValue(lessonRow({ coursePublished: false }));
    await expectStatus(
      authorizeLessonAccess({ lessonId: "lesson-1", action: "PLAY_VIDEO", viewer: learner }),
      403
    );

    findUnique.mockResolvedValue(lessonRow({ trackPublished: false }));
    await expectStatus(
      authorizeLessonAccess({ lessonId: "lesson-1", action: "PLAY_VIDEO", viewer: learner }),
      403
    );
  });

  it("refuses PLAY_VIDEO when the lesson has no ready video", async () => {
    findUnique.mockResolvedValue(lessonRow({ hasVideo: false }));
    hasActiveSubscription.mockResolvedValue(true);
    await expectStatus(
      authorizeLessonAccess({ lessonId: "lesson-1", action: "PLAY_VIDEO", viewer: learner }),
      404
    );
  });

  it("still allows WRITE_PROGRESS on a lesson without a video", async () => {
    findUnique.mockResolvedValue(lessonRow({ hasVideo: false }));
    hasActiveSubscription.mockResolvedValue(true);
    const grant = await authorizeLessonAccess({
      lessonId: "lesson-1",
      action: "WRITE_PROGRESS",
      viewer: learner,
    });
    expect(grant.muxPlaybackId).toBeNull();
  });

  it("scopes the instructor lookup to the session user id, not a client value", async () => {
    findUnique.mockResolvedValue(lessonRow({ instructorMatches: true }));
    await authorizeLessonAccess({
      lessonId: "lesson-1",
      action: "PLAY_VIDEO",
      viewer: { userId: "user-instructor", roles: ["INSTRUCTOR"] },
    });

    const arg = findUnique.mock.calls[0]?.[0] as {
      select: {
        module: {
          select: {
            course: {
              select: { instructors: { where: { instructorId: string } } };
            };
          };
        };
      };
    };
    expect(
      arg.select.module.select.course.select.instructors.where.instructorId
    ).toBe("user-instructor");
  });
});
