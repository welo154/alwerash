import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import {
  AssignmentCreateSchema,
  AssignmentUpdateSchema,
} from "@/server/content/content.schemas";

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

export async function adminGetCourseAssignment(courseId: string) {
  return prisma.assignment.findFirst({
    where: { courseId },
    include: { _count: { select: { submissions: true } } },
  });
}

export async function adminCreateCourseAssignment(input: unknown) {
  const data = parse(AssignmentCreateSchema, input);
  const course = await prisma.course.findUnique({
    where: { id: data.courseId },
    select: { id: true },
  });
  if (!course) throw new AppError("NOT_FOUND", 404, "Course not found");

  const existing = await prisma.assignment.findFirst({
    where: { courseId: data.courseId },
    select: { id: true },
  });
  if (existing) {
    throw new AppError("CONFLICT", 409, "This course already has a final assignment");
  }

  try {
    return await prisma.assignment.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        instructions: data.instructions,
        rubricJson: data.rubricJson as Prisma.InputJsonValue | undefined,
        published: data.published ?? false,
      },
      include: { _count: { select: { submissions: true } } },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new AppError("CONFLICT", 409, "Assignment already exists for this course");
    }
    throw e;
  }
}

export async function adminUpdateCourseAssignment(courseId: string, input: unknown) {
  const data = parse(AssignmentUpdateSchema, input);
  const assignment = await prisma.assignment.findFirst({
    where: { courseId },
    select: { id: true },
  });
  if (!assignment) throw new AppError("NOT_FOUND", 404, "Assignment not found");

  return prisma.assignment.update({
    where: { id: assignment.id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.instructions !== undefined ? { instructions: data.instructions } : {}),
      ...(data.rubricJson !== undefined
        ? { rubricJson: data.rubricJson as Prisma.InputJsonValue }
        : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
    include: { _count: { select: { submissions: true } } },
  });
}

export async function adminDeleteCourseAssignment(courseId: string) {
  const assignment = await prisma.assignment.findFirst({
    where: { courseId },
    select: { id: true },
  });
  if (!assignment) throw new AppError("NOT_FOUND", 404, "Assignment not found");
  await prisma.assignment.delete({ where: { id: assignment.id } });
  return { ok: true };
}

export async function getPublishedAssignmentForCourse(courseId: string) {
  try {
    return await prisma.assignment.findFirst({
      where: { courseId, published: true },
      select: {
        id: true,
        title: true,
        instructions: true,
        published: true,
      },
    });
  } catch {
    // Prisma client/schema drift or missing course_id column — treat as no assignment.
    return null;
  }
}
