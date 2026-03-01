/**
 * Ensures featured columns exist, then adds the first few published courses to "New" and "Most played".
 *
 * Usage: npx tsx scripts/add-featured-courses.ts
 */
import { prisma } from "../src/server/db/prisma";

async function main() {
  // Add columns if missing (idempotent)
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "featured_new_order" INTEGER`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "featured_most_played_order" INTEGER`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "total_duration_minutes" INTEGER`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "rating" DOUBLE PRECISION`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "courses_featured_new_order_idx" ON "courses"("featured_new_order")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "courses_featured_most_played_order_idx" ON "courses"("featured_most_played_order")`);
    console.log("Migration columns/indexes ensured.");
  } catch (e) {
    console.error("Could not add columns. Run: npm run db:deploy");
    throw e;
  }

  const courses = await prisma.$queryRawUnsafe<
    { id: string; title: string }[]
  >(
    `SELECT id, title FROM courses WHERE published = true ORDER BY created_at ASC LIMIT 6`
  );
  if (courses.length === 0) {
    console.log("No published courses found.");
    return;
  }

  for (let i = 0; i < Math.min(3, courses.length); i++) {
    await prisma.$executeRawUnsafe(
      `UPDATE courses SET "featured_new_order" = $1, "updated_at" = now() WHERE id = $2`,
      i + 1,
      courses[i].id
    );
    console.log("New (order " + (i + 1) + "):", courses[i].title);
  }
  for (let i = 0; i < Math.min(4, courses.length); i++) {
    await prisma.$executeRawUnsafe(
      `UPDATE courses SET "featured_most_played_order" = $1, "updated_at" = now() WHERE id = $2`,
      i + 1,
      courses[i].id
    );
    console.log("Most played (order " + (i + 1) + "):", courses[i].title);
  }
  console.log("Done. Refresh the home page to see New and Most played sections.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
