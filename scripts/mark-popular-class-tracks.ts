/**
 * Mark all published courses in given tracks as "Popular classes"
 * (featured_most_played_order on courses).
 *
 * Dry run:
 *   npx tsx scripts/mark-popular-class-tracks.ts
 *
 * Apply:
 *   npx tsx scripts/mark-popular-class-tracks.ts --execute
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EXECUTE = process.argv.includes("--execute");

/** Tracks whose courses appear in Learn → Popular classes. */
export const POPULAR_CLASS_TRACK_SLUGS = ["calligraphy", "3d-designs"] as const;

async function main() {
  const tracks = await prisma.track.findMany({
    where: { slug: { in: [...POPULAR_CLASS_TRACK_SLUGS] }, published: true },
    orderBy: { order: "asc" },
    include: {
      courses: {
        where: { published: true },
        orderBy: { order: "asc" },
        select: { id: true, title: true, featuredMostPlayedOrder: true },
      },
    },
  });

  const trackCourses = tracks.flatMap((t) =>
    t.courses.map((c) => ({ ...c, trackSlug: t.slug, trackTitle: t.title }))
  );

  const trackCourseIds = new Set(trackCourses.map((c) => c.id));

  console.log(`\nPopular class tracks — ${EXECUTE ? "EXECUTE" : "DRY-RUN"}\n`);
  console.log(`Tracks: ${tracks.map((t) => t.slug).join(", ")}`);
  console.log(`Courses to mark: ${trackCourses.length}\n`);

  let order = 0;
  for (const course of trackCourses) {
    order += 1;
    const nextOrder = order;
    if (course.featuredMostPlayedOrder === nextOrder) {
      console.log(`  = ${nextOrder} ${course.title} (${course.trackSlug})`);
      continue;
    }
    console.log(`  + ${nextOrder} ${course.title} (${course.trackSlug})`);
    if (EXECUTE) {
      await prisma.course.update({
        where: { id: course.id },
        data: { featuredMostPlayedOrder: nextOrder },
      });
    }
  }

  const others = await prisma.course.findMany({
    where: {
      published: true,
      featuredMostPlayedOrder: { not: null },
      id: { notIn: [...trackCourseIds] },
    },
    orderBy: { featuredMostPlayedOrder: "asc" },
    select: { id: true, title: true, featuredMostPlayedOrder: true },
  });

  let bump = order;
  for (const course of others) {
    bump += 1;
    if (course.featuredMostPlayedOrder === bump) continue;
    console.log(`  ~ ${bump} ${course.title} (reorder existing popular)`);
    if (EXECUTE) {
      await prisma.course.update({
        where: { id: course.id },
        data: { featuredMostPlayedOrder: bump },
      });
    }
  }

  if (!EXECUTE) console.log("\nDry run only. Re-run with --execute to apply.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
