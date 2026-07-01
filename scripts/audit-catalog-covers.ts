import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isMissing(url: string | null | undefined): boolean {
  const v = url?.trim();
  if (!v) return true;
  return !v.startsWith("http") && !v.startsWith("/");
}

async function main() {
  const tracks = await prisma.track.findMany({
    select: { slug: true, coverImage: true, published: true },
  });
  const courses = await prisma.course.findMany({
    select: {
      title: true,
      coverImage: true,
      published: true,
      track: { select: { slug: true } },
    },
  });

  const missingTracks = tracks.filter((t) => isMissing(t.coverImage));
  const missingCourses = courses.filter((c) => isMissing(c.coverImage));

  console.log("Tracks missing cover:", missingTracks.length, "/", tracks.length);
  for (const t of missingTracks) {
    console.log(`  - ${t.slug} (published=${t.published})`);
  }
  console.log("Courses missing cover:", missingCourses.length, "/", courses.length);
  for (const c of missingCourses.slice(0, 20)) {
    console.log(`  - ${c.title} [${c.track?.slug}]`);
  }
  if (missingCourses.length > 20) {
    console.log(`  ... and ${missingCourses.length - 20} more`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
