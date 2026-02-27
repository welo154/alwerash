import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      published: true,
      modules: {
        select: {
          id: true,
          title: true,
          lessons: { select: { id: true, title: true, published: true, type: true } },
        },
      },
    },
  });
  for (const c of courses) {
    const totalLessons = c.modules.reduce((n, m) => n + m.lessons.length, 0);
    const publishedLessons = c.modules.reduce(
      (n, m) => n + m.lessons.filter((l) => l.published).length,
      0
    );
    console.log(`${c.title} (id: ${c.id})`);
    console.log(`  published: ${c.published}, lessons: ${publishedLessons}/${totalLessons}`);
    for (const m of c.modules) {
      for (const l of m.lessons) {
        console.log(`    ${m.title} → ${l.title} (published: ${l.published})`);
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
