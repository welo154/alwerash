import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

/** No 0/O or 1/I, so a code read off a printed certificate is not mistyped. */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 12;

export function generateCertificateCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    code += CODE_ALPHABET[bytes[i]! % CODE_ALPHABET.length];
  }
  return code;
}

export function normalizeCertificateCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function certificatePath(code: string): string {
  return `/certificates/${encodeURIComponent(code)}`;
}

function recipientNameFor(user: { name: string | null; email: string }): string {
  return user.name?.trim() || user.email.split("@")[0] || "Learner";
}

/**
 * Issues the course certificate for an approved final submission. Safe to call
 * again for the same learner and course: the existing certificate is returned.
 */
export async function issueCertificateForSubmission(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      userId: true,
      user: { select: { name: true, email: true } },
      assignment: {
        select: {
          course: {
            select: {
              id: true,
              title: true,
              mentor: {
                select: { name: true, certificateName: true, signatureImage: true },
              },
            },
          },
        },
      },
    },
  });
  const course = submission?.assignment.course;
  if (!submission || !course) return null;

  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId: submission.userId, courseId: course.id } },
  });
  if (existing) return existing;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await prisma.certificate.create({
        data: {
          code: generateCertificateCode(),
          userId: submission.userId,
          courseId: course.id,
          submissionId: submission.id,
          recipientName: recipientNameFor(submission.user),
          courseTitle: course.title,
          mentorName: course.mentor?.name ?? null,
          mentorTitle: course.mentor?.certificateName?.trim() || null,
          signatureImage: course.mentor?.signatureImage ?? null,
        },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
        throw error;
      }
      const raced = await prisma.certificate.findUnique({
        where: { userId_courseId: { userId: submission.userId, courseId: course.id } },
      });
      if (raced) return raced;
    }
  }
  throw new Error("Could not allocate a unique certificate code");
}

export async function getCertificateByCode(rawCode: string) {
  const code = normalizeCertificateCode(rawCode);
  if (!code) return null;
  return prisma.certificate.findUnique({
    where: { code },
    select: {
      code: true,
      recipientName: true,
      courseTitle: true,
      mentorName: true,
      mentorTitle: true,
      signatureImage: true,
      issuedAt: true,
      course: { select: { id: true, published: true } },
    },
  });
}

export async function listCertificatesForUser(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    orderBy: { issuedAt: "desc" },
    select: { code: true, courseTitle: true, issuedAt: true },
  });
}

export async function getCertificateForLearnerCourse(userId: string, courseId: string) {
  return prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { code: true },
  });
}
