/**
 * Publish all lessons in a course (so they appear for learners).
 * Run: npx tsx scripts/publish-course-lessons.ts "After Effects"
 * Or:  npx tsx scripts/publish-course-lessons.ts <courseId>
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const courseArg = process.argv[2]?.trim();
if (!courseArg) {
  console.error("Usage: npx tsx scripts/publish-course-lessons.ts \"Course title\" | <courseId>");
  process.exit(1);
}

async function main() {
  const isCuid = courseArg.length >= 20 && /^c[a-z0-9]+$/i.test(courseArg);
  const course = await prisma.course.findFirst({
    where: isCuid ? { id: courseArg } : { title: { contains: courseArg, mode: "insensitive" } },
    select: { id: true, title: true, modules: { select: { id: true, title: true } } },
  });
  if (!course) {
    console.error("Course not found:", courseArg);
    process.exit(1);
  }

  const moduleIds = course.modules.map((m) => m.id);
  const result = await prisma.lesson.updateMany({
    where: { moduleId: { in: moduleIds } },
    data: { published: true },
  });

  console.log("Course:", course.title);
  console.log("Published", result.count, "lesson(s).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
