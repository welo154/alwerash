import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const coursesWithVideo = await prisma.course.findMany({
    where: {
      modules: {
        some: {
          lessons: {
            some: {
              video: { isNot: null },
            },
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      published: true,
      modules: {
        select: {
          title: true,
          lessons: {
            where: { video: { isNot: null } },
            select: { id: true, title: true, type: true },
          },
        },
      },
    },
  });

  if (coursesWithVideo.length === 0) {
    console.log("No courses have lessons with video (Mux asset) attached.\n");
    return;
  }

  console.log("Courses that have video:\n");
  for (const c of coursesWithVideo) {
    const lessonCount = c.modules.reduce((n, m) => n + m.lessons.length, 0);
    console.log(`- ${c.title} (published: ${c.published}, ${lessonCount} lesson(s) with video)`);
    for (const m of c.modules) {
      for (const l of m.lessons) {
        console.log(`    • ${m.title} → ${l.title}`);
      }
    }
    console.log("");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
