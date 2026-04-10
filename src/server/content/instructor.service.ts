import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";

export async function instructorListCourses(actorUserId: string) {
  const courses = await prisma.course.findMany({
    where: { instructors: { some: { instructorId: actorUserId } } },
    select: { id: true, title: true },
    orderBy: [{ createdAt: "asc" }],
  });

  const withCounts = await Promise.all(
    courses.map(async (course) => {
      const attendees = await prisma.lessonProgress.findMany({
        where: {
          lesson: {
            published: true,
            module: { courseId: course.id },
          },
        },
        select: { userId: true },
        distinct: ["userId"],
      });
      return { ...course, attendeeCount: attendees.length };
    })
  );

  return withCounts;
}

export async function instructorGetCourseLearners(
  actorUserId: string,
  courseId: string,
  isAdmin: boolean
) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, title: true },
  });
  if (!course) throw new AppError("NOT_FOUND", 404, "Course not found");

  const assignment = await prisma.courseInstructor.findFirst({
    where: { courseId, instructorId: actorUserId },
    select: { courseId: true },
  });
  if (!assignment && !isAdmin) throw new AppError("FORBIDDEN", 403, "Forbidden");

  const learnersWithProgress = await prisma.lessonProgress.findMany({
    where: {
      lesson: {
        published: true,
        module: { courseId },
      },
    },
    select: { userId: true },
    distinct: ["userId"],
  });

  const learnerIds = learnersWithProgress.map((row) => row.userId);
  const learners = learnerIds.length
    ? await prisma.user.findMany({
        where: { id: { in: learnerIds } },
        select: { id: true, name: true, email: true },
        orderBy: [{ name: "asc" }, { email: "asc" }],
      })
    : [];

  return {
    course,
    learners,
  };
}
