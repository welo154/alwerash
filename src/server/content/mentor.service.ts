import { SubmissionStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";

const ReviewSubmissionSchema = z.object({
  feedback: z.string().min(1).max(10_000),
  grade: z.number().int().min(0).max(100).optional(),
  status: z.enum(["REVIEWED", "NEEDS_CHANGES"]),
});

function mentorCourseWhere(mentorId: string) {
  return { mentorId };
}

function mentorSubmissionWhere(mentorId: string, courseId?: string) {
  return {
    assignment: {
      course: {
        mentorId,
        ...(courseId ? { id: courseId } : {}),
      },
    },
  };
}

async function countLearnersForCourse(courseId: string) {
  const rows = await prisma.lessonProgress.findMany({
    where: {
      lesson: { published: true, module: { courseId } },
    },
    select: { userId: true },
    distinct: ["userId"],
  });
  return rows.length;
}

export async function mentorListCourses(mentorId: string) {
  const courses = await prisma.course.findMany({
    where: mentorCourseWhere(mentorId),
    select: { id: true, title: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const withCounts = await Promise.all(
    courses.map(async (course) => {
      const [attendeeCount, pendingSubmissions] = await Promise.all([
        countLearnersForCourse(course.id),
        prisma.submission.count({
          where: {
            status: SubmissionStatus.SUBMITTED,
            assignment: { courseId: course.id },
          },
        }),
      ]);
      return { ...course, attendeeCount, pendingSubmissions };
    })
  );

  return withCounts;
}

export async function mentorGetDashboardStats(mentorId: string) {
  const courses = await prisma.course.findMany({
    where: mentorCourseWhere(mentorId),
    select: { id: true },
  });
  const courseIds = courses.map((c) => c.id);

  const [pendingSubmissions, reviewedThisWeek, learnerRows] = await Promise.all([
    prisma.submission.count({
      where: {
        status: SubmissionStatus.SUBMITTED,
        ...mentorSubmissionWhere(mentorId),
      },
    }),
    prisma.submission.count({
      where: {
        status: SubmissionStatus.REVIEWED,
        updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        ...mentorSubmissionWhere(mentorId),
      },
    }),
    courseIds.length
      ? prisma.lessonProgress.findMany({
          where: {
            lesson: { published: true, module: { courseId: { in: courseIds } } },
          },
          select: { userId: true },
          distinct: ["userId"],
        })
      : Promise.resolve([]),
  ]);

  return {
    courseCount: courses.length,
    totalLearners: learnerRows.length,
    pendingSubmissions,
    reviewedThisWeek,
  };
}

export async function mentorGetCourseDetail(mentorId: string, courseId: string) {
  const course = await prisma.course.findFirst({
    where: { id: courseId, ...mentorCourseWhere(mentorId) },
    select: { id: true, title: true },
  });
  if (!course) throw new AppError("NOT_FOUND", 404, "Course not found");

  const learnersWithProgress = await prisma.lessonProgress.findMany({
    where: {
      lesson: { published: true, module: { courseId } },
    },
    select: { userId: true },
    distinct: ["userId"],
  });

  const learnerIds = learnersWithProgress.map((r) => r.userId);
  const learners = learnerIds.length
    ? await prisma.user.findMany({
        where: { id: { in: learnerIds } },
        select: { id: true, name: true, email: true },
        orderBy: [{ name: "asc" }, { email: "asc" }],
      })
    : [];

  const submissions = await mentorListSubmissions(mentorId, { courseId });

  return { course, learners, submissions };
}

export async function mentorListSubmissions(
  mentorId: string,
  filters?: { status?: SubmissionStatus; courseId?: string }
) {
  return prisma.submission.findMany({
    where: {
      ...mentorSubmissionWhere(mentorId, filters?.courseId),
      ...(filters?.status ? { status: filters.status } : {}),
    },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { id: true, name: true, email: true } },
      assignment: {
        select: {
          title: true,
          course: { select: { id: true, title: true } },
        },
      },
    },
  });
}

export async function mentorGetSubmission(mentorId: string, submissionId: string) {
  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, ...mentorSubmissionWhere(mentorId) },
    include: {
      user: { select: { id: true, name: true, email: true } },
      files: { select: { id: true, fileKey: true, mime: true, size: true, createdAt: true } },
      assignment: {
        select: {
          id: true,
          title: true,
          instructions: true,
          course: { select: { id: true, title: true } },
        },
      },
    },
  });
  if (!submission) throw new AppError("NOT_FOUND", 404, "Submission not found");
  return submission;
}

export async function mentorReviewSubmission(
  mentorId: string,
  submissionId: string,
  input: unknown
) {
  const data = ReviewSubmissionSchema.parse(input);
  const existing = await prisma.submission.findFirst({
    where: { id: submissionId, ...mentorSubmissionWhere(mentorId) },
    select: { id: true },
  });
  if (!existing) throw new AppError("NOT_FOUND", 404, "Submission not found");

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      instructorFeedback: data.feedback,
      grade: data.grade ?? null,
      status: data.status,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      files: { select: { id: true, fileKey: true, mime: true, size: true } },
      assignment: {
        select: {
          title: true,
          course: { select: { id: true, title: true } },
        },
      },
    },
  });

  const courseId = updated.assignment.course?.id;
  if (updated.user.email && courseId) {
    const { getAppBaseUrl, sendLearnerCapstoneReviewedEmail } = await import(
      "@/server/email/resend.client"
    );
    const feedbackUrl = `${getAppBaseUrl()}/learn/${courseId}#final-assignment`;
    void sendLearnerCapstoneReviewedEmail({
      to: updated.user.email,
      courseTitle: updated.assignment.course?.title ?? "your course",
      assignmentTitle: updated.assignment.title,
      feedback: data.feedback,
      grade: data.grade ?? null,
      feedbackUrl,
    }).catch((err) => console.error("[email] learner notify failed:", err));
  }

  return updated;
}

export async function mentorOwnsSubmissionCourse(mentorId: string, submissionId: string) {
  const row = await prisma.submission.findFirst({
    where: { id: submissionId, ...mentorSubmissionWhere(mentorId) },
    select: { id: true },
  });
  return Boolean(row);
}
