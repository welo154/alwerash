import { Prisma, SubmissionStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";

export const SUBMISSION_STATUSES = Object.values(SubmissionStatus);

export function parseSubmissionStatus(raw: string | undefined): SubmissionStatus | undefined {
  return SUBMISSION_STATUSES.find((s) => s === raw);
}

export async function adminListSubmissions(filters?: {
  status?: SubmissionStatus;
  courseId?: string;
}) {
  return prisma.submission.findMany({
    where: {
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.courseId ? { assignment: { courseId: filters.courseId } } : {}),
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 500,
    select: {
      id: true,
      status: true,
      grade: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { id: true, name: true, email: true } },
      certificate: { select: { code: true } },
      assignment: {
        select: {
          title: true,
          course: {
            select: { id: true, title: true, mentor: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });
}

export async function adminSubmissionStatusCounts(courseId?: string) {
  const rows = await prisma.submission.groupBy({
    by: ["status"],
    where: courseId ? { assignment: { courseId } } : undefined,
    _count: { _all: true },
  });
  const counts = Object.fromEntries(SUBMISSION_STATUSES.map((s) => [s, 0])) as Record<
    SubmissionStatus,
    number
  >;
  for (const row of rows) counts[row.status] = row._count._all;
  const total = rows.reduce((sum, row) => sum + row._count._all, 0);
  return { counts, total };
}

export async function adminPendingSubmissionCount() {
  return prisma.submission.count({ where: { status: SubmissionStatus.SUBMITTED } });
}

export async function adminGetSubmission(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      files: { select: { id: true, fileKey: true, mime: true, size: true, createdAt: true } },
      certificate: { select: { code: true, issuedAt: true } },
      assignment: {
        select: {
          id: true,
          title: true,
          instructions: true,
          course: {
            select: { id: true, title: true, mentor: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });
  if (!submission) throw new AppError("NOT_FOUND", 404, "Submission not found");
  return submission;
}

/** Courses that have a final assignment, for the submissions/certificates filters. */
export async function adminListAssignmentCourses() {
  return prisma.course.findMany({
    where: { assignments: { some: {} } },
    select: { id: true, title: true },
    orderBy: [{ title: "asc" }],
  });
}

export async function adminListCertificates(filters?: { courseId?: string; q?: string }) {
  const q = filters?.q?.trim();
  const where: Prisma.CertificateWhereInput = {
    ...(filters?.courseId ? { courseId: filters.courseId } : {}),
    ...(q
      ? {
          OR: [
            { recipientName: { contains: q, mode: "insensitive" } },
            { code: { contains: q.toUpperCase() } },
            { courseTitle: { contains: q, mode: "insensitive" } },
            { user: { email: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };
  return prisma.certificate.findMany({
    where,
    orderBy: { issuedAt: "desc" },
    take: 500,
    select: {
      id: true,
      code: true,
      recipientName: true,
      courseTitle: true,
      mentorName: true,
      signatureImage: true,
      issuedAt: true,
      submissionId: true,
      user: { select: { email: true } },
    },
  });
}

export async function adminCertificateTotals() {
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const [total, thisMonth] = await Promise.all([
    prisma.certificate.count(),
    prisma.certificate.count({ where: { issuedAt: { gte: monthStart } } }),
  ]);
  return { total, thisMonth };
}
