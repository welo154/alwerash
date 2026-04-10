import { Prisma, Role } from "@prisma/client";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import { hashPassword } from "./password";

const CreateInstructorSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  name: z.string().min(1).max(100).optional(),
  country: z.string().length(2).optional(),
});

const AssignInstructorSchema = z.object({
  courseId: z.string().min(1),
  instructorId: z.string().min(1),
});

function parse<T>(
  schema: {
    safeParse: (input: unknown) =>
      | { success: true; data: T }
      | { success: false; error: { flatten: () => { formErrors: string[]; fieldErrors: Record<string, string[]> } } };
  },
  input: unknown
): T {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const message =
      flat.formErrors[0] ??
      Object.values(flat.fieldErrors)
        .flat()
        .filter(Boolean)[0] ??
      "Invalid input";
    throw new AppError("BAD_REQUEST", 400, message, flat);
  }
  return parsed.data;
}

function generateTemporaryPassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
  const bytes = randomBytes(16);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

function handlePrismaError(e: unknown): never {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") throw new AppError("CONFLICT", 409, "Email is already registered");
    if (e.code === "P2025") throw new AppError("NOT_FOUND", 404, "Record not found");
  }
  throw e;
}

export async function adminCreateInstructor(input: unknown) {
  const data = parse(CreateInstructorSchema, input);
  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);

  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        country: data.country,
        passwordHash,
        emailVerified: new Date(),
        roles: { create: { role: Role.INSTRUCTOR } },
      },
      select: { id: true, email: true, name: true, country: true, createdAt: true },
    });
    return { user, temporaryPassword };
  } catch (e) {
    handlePrismaError(e);
  }
}

export async function adminListInstructors() {
  return prisma.user.findMany({
    where: { roles: { some: { role: Role.INSTRUCTOR } } },
    select: { id: true, email: true, name: true, country: true, createdAt: true, updatedAt: true },
    orderBy: [{ createdAt: "asc" }],
  });
}

export async function adminAssignInstructorToCourse(input: unknown) {
  const data = parse(AssignInstructorSchema, input);

  const [course, instructorRole] = await Promise.all([
    prisma.course.findUnique({ where: { id: data.courseId }, select: { id: true } }),
    prisma.userRole.findFirst({
      where: { userId: data.instructorId, role: Role.INSTRUCTOR },
      select: { userId: true },
    }),
  ]);

  if (!course) throw new AppError("NOT_FOUND", 404, "Course not found");
  if (!instructorRole) throw new AppError("BAD_REQUEST", 400, "User is not an instructor");

  try {
    const assignment = await prisma.courseInstructor.create({
      data: { courseId: data.courseId, instructorId: data.instructorId },
      select: { courseId: true, instructorId: true, createdAt: true },
    });
    return assignment;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new AppError("CONFLICT", 409, "Instructor already assigned to this course");
    }
    handlePrismaError(e);
  }
}

export async function adminListCourseInstructorAssignments() {
  return prisma.courseInstructor.findMany({
    orderBy: [{ createdAt: "asc" }],
    select: {
      createdAt: true,
      course: { select: { id: true, title: true } },
      instructor: { select: { id: true, email: true, name: true } },
    },
  });
}
