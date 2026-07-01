/**
 * Apply thematic cover images to all published tracks and courses.
 *
 * Dry run (default):
 *   npm run scripts:apply-catalog-covers
 *
 * Apply changes:
 *   npm run scripts:apply-catalog-covers -- --execute
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import {
  catalogCoverUrlForCourse,
  catalogCoverUrlForTrack,
} from "../src/lib/catalog-cover-images";

const prisma = new PrismaClient();
const EXECUTE = process.argv.includes("--execute");

async function main() {
  const tracks = await prisma.track.findMany({
    where: { published: true },
    select: { id: true, title: true, slug: true, coverImage: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const courses = await prisma.course.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      coverImage: true,
      track: { select: { slug: true } },
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  let tracksUpdated = 0;
  let coursesUpdated = 0;

  console.log(`\nCatalog cover images — ${EXECUTE ? "EXECUTE" : "DRY-RUN"}\n`);

  for (const track of tracks) {
    const url = catalogCoverUrlForTrack(track.slug, track.title);
    if (track.coverImage?.trim() === url) continue;
    tracksUpdated++;
    console.log(`  track  + ${track.slug}`);
    if (EXECUTE) {
      await prisma.track.update({
        where: { id: track.id },
        data: { coverImage: url },
      });
    }
  }

  for (const course of courses) {
    const url = catalogCoverUrlForCourse(course.title, course.track?.slug);
    if (course.coverImage?.trim() === url) continue;
    coursesUpdated++;
    console.log(`  course + ${course.title}`);
    if (EXECUTE) {
      await prisma.course.update({
        where: { id: course.id },
        data: { coverImage: url },
      });
    }
  }

  console.log(`\nTracks to update: ${tracksUpdated}`);
  console.log(`Courses to update: ${coursesUpdated}`);
  if (!EXECUTE) {
    console.log("\nDry run only. Re-run with --execute to apply.\n");
  } else {
    console.log("\nCover images applied.\n");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
