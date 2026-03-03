/**
 * 1. Applies the course–mentor migration (adds mentor_id to courses if missing).
 * 2. Assigns a mentor to every course that doesn't have one.
 *
 * Run from your terminal (where DB is reachable): npm run scripts:apply-course-mentor-and-assign
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MIGRATION_SQL = [
  `ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "mentor_id" TEXT`,
  `CREATE INDEX IF NOT EXISTS "courses_mentor_id_idx" ON "courses"("mentor_id")`,
  // FK: run only if not exists (ignore error if it already exists)
];

async function applyMigration() {
  console.log("Applying course–mentor migration...");
  for (const sql of MIGRATION_SQL) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log("  OK:", sql.slice(0, 60) + "...");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("already exists")) {
        console.log("  (already exists):", sql.slice(0, 50) + "...");
      } else {
        throw e;
      }
    }
  }
  // Add FK separately (may fail if already exists)
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "courses" ADD CONSTRAINT "courses_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "mentors"("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
    console.log("  OK: Foreign key added.");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("already exists")) {
      console.log("  (FK already exists)");
    } else {
      throw e;
    }
  }
  console.log("Migration applied.\n");
}

async function assignMentors() {
  const mentors = await prisma.mentor.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, photo: true },
  });
  if (mentors.length === 0) {
    console.log("No mentors in the system. Run: npm run scripts:setup-mentors");
    return;
  }

  const rows = await prisma.$queryRaw<{ id: string; title: string }[]>`
    SELECT id, title FROM courses WHERE mentor_id IS NULL ORDER BY created_at ASC
  `;

  if (rows.length === 0) {
    console.log("All courses already have a mentor assigned.");
    return;
  }

  let assigned = 0;
  for (let i = 0; i < rows.length; i++) {
    const course = rows[i];
    const mentor = mentors[i % mentors.length];
    await prisma.$executeRaw`
      UPDATE courses
      SET mentor_id = ${mentor.id},
          instructor_name = ${mentor.name},
          instructor_image = ${mentor.photo},
          updated_at = now()
      WHERE id = ${course.id}
    `;
    console.log(`Assigned ${mentor.name} → ${course.title}`);
    assigned++;
  }
  console.log(`\nDone. Assigned mentors to ${assigned} course(s).`);
}

async function main() {
  await applyMigration();
  await assignMentors();
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
