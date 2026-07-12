import { SubmissionStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { getMentorIdForUser } from "@/server/auth/mentor-context";

const UpsertSubmissionSchema = z.object({
  textAnswer: z.string().max(50_000).optional(),
  externalLink: z
    .string()
    .max(2000)
    .optional()
    .transform((v) => (v?.trim() || undefined))
    .pipe(z.union([z.string().url(), z.undefined()])),
});

export async function getSubmissionForUser(assignmentId: string, userId: string) {
  return prisma.submission.findFirst({
    where: { assignmentId, userId },
    include: {
      files: { select: { id: true, fileKey: true, mime: true, size: true, createdAt: true } },
      assignment: {
        select: {
          id: true,
          title: true,
          instructions: true,
          courseId: true,
          lessonId: true,
        },
      },
    },
  });
}

export async function getLearnerSubmissionForCourse(courseId: string, userId: string) {
  const assignment = await prisma.assignment.findFirst({
    where: { courseId, published: true },
    select: { id: true },
  });
  if (!assignment) return null;
  return getSubmissionForUser(assignment.id, userId);
}

async function assertAssignmentAccessible(assignmentId: string) {
  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, published: true },
    select: {
      id: true,
      courseId: true,
      course: { select: { id: true, published: true } },
      lessonId: true,
      lesson: {
        select: {
          published: true,
          module: { select: { courseId: true } },
        },
      },
    },
  });
  if (!assignment) {
    throw new AppError("NOT_FOUND", 404, "Assignment not found");
  }
  if (assignment.courseId) {
    if (!assignment.course?.published) {
      throw new AppError("NOT_FOUND", 404, "Assignment not found");
    }
    return assignment;
  }
  if (assignment.lessonId) {
    if (!assignment.lesson?.published) {
      throw new AppError("NOT_FOUND", 404, "Assignment not found");
    }
    return assignment;
  }
  throw new AppError("NOT_FOUND", 404, "Assignment not found");
}

export async function upsertSubmissionDraft(
  assignmentId: string,
  userId: string,
  input: unknown
) {
  const data = UpsertSubmissionSchema.parse(input);
  await assertAssignmentAccessible(assignmentId);

  const existing = await prisma.submission.findFirst({
    where: { assignmentId, userId },
    select: { id: true, status: true },
  });

  if (existing && existing.status !== SubmissionStatus.DRAFT && existing.status !== SubmissionStatus.NEEDS_CHANGES) {
    throw new AppError("BAD_REQUEST", 400, "This submission can no longer be edited");
  }

  const payload = {
    textAnswer: data.textAnswer?.trim() || null,
    externalLink: data.externalLink?.trim() || null,
    status: SubmissionStatus.DRAFT,
  };

  if (existing) {
    return prisma.submission.update({
      where: { id: existing.id },
      data: payload,
      include: { files: true },
    });
  }

  return prisma.submission.create({
    data: {
      assignmentId,
      userId,
      ...payload,
    },
    include: { files: true },
  });
}

export async function submitSubmission(assignmentId: string, userId: string) {
  await assertAssignmentAccessible(assignmentId);

  const submission = await prisma.submission.findFirst({
    where: { assignmentId, userId },
    include: { files: true },
  });
  if (!submission) {
    throw new AppError("BAD_REQUEST", 400, "Save a draft or upload a file before submitting");
  }
  if (submission.status !== SubmissionStatus.DRAFT && submission.status !== SubmissionStatus.NEEDS_CHANGES) {
    throw new AppError("BAD_REQUEST", 400, "Submission already sent for review");
  }

  if (submission.files.length === 0) {
    throw new AppError("BAD_REQUEST", 400, "Upload a photo or PDF before submitting");
  }

  return prisma.submission.update({
    where: { id: submission.id },
    data: { status: SubmissionStatus.SUBMITTED },
    include: { files: true },
  });
}

export async function canAccessSubmissionFile(
  fileKey: string,
  actorUserId: string,
  actorRoles: string[]
) {
  const file = await prisma.submissionFile.findFirst({
    where: { fileKey },
    select: {
      userId: true,
      submission: {
        select: {
          assignment: {
            select: {
              course: { select: { mentorId: true } },
              lesson: {
                select: { module: { select: { course: { select: { mentorId: true } } } } },
              },
            },
          },
        },
      },
    },
  });
  if (!file) return false;
  if (actorRoles.includes("ADMIN")) return true;
  if (file.userId === actorUserId) return true;

  const mentorId = await getMentorIdForUser(actorUserId);
  if (!mentorId) return false;
  const courseMentorId =
    file.submission.assignment.course?.mentorId ??
    file.submission.assignment.lesson?.module.course.mentorId ??
    null;
  return courseMentorId === mentorId;
}

export async function addSubmissionFile(
  submissionId: string,
  userId: string,
  file: { fileKey: string; mime: string; size: number }
) {
  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, userId },
    select: { id: true, status: true },
  });
  if (!submission) throw new AppError("NOT_FOUND", 404, "Submission not found");
  if (submission.status !== SubmissionStatus.DRAFT && submission.status !== SubmissionStatus.NEEDS_CHANGES) {
    throw new AppError("BAD_REQUEST", 400, "Cannot add files to a submitted assignment");
  }

  return prisma.submissionFile.create({
    data: {
      submissionId,
      userId,
      fileKey: file.fileKey,
      mime: file.mime,
      size: file.size,
    },
  });
}
