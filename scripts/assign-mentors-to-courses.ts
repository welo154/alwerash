/**
 * Assigns a mentor to every course that doesn't have one.
 * Distributes courses round-robin among existing mentors and syncs instructor name/photo.
 * Uses raw SQL so it works even if mentor_id column was added but Prisma client is stale.
 *
 * Run: npm run scripts:assign-mentors-to-courses
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const mentors = await prisma.mentor.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, photo: true },
  });
  if (mentors.length === 0) {
    console.log("No mentors in the system. Add mentors first (e.g. npm run scripts:setup-mentors).");
    return;
  }

  // Find courses without mentor (raw SQL in case mentor_id column exists in DB but not in client)
  type Row = { id: string; title: string };
  let coursesWithoutMentor: Row[];
  try {
    coursesWithoutMentor = await prisma.$queryRaw<Row[]>`
      SELECT id, title FROM courses
      WHERE mentor_id IS NULL
      ORDER BY created_at ASC
    `;
  } catch (e) {
    console.log("mentor_id column may not exist. Run: npx prisma migrate deploy");
    return;
  }

  if (coursesWithoutMentor.length === 0) {
    console.log("All courses already have a mentor assigned.");
    return;
  }

  let assigned = 0;
  for (let i = 0; i < coursesWithoutMentor.length; i++) {
    const course = coursesWithoutMentor[i];
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
  console.log(`Done. Assigned mentors to ${assigned} course(s).`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
