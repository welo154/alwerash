/**
 * Adds users.bio and users.skills if missing.
 * Uses the app Prisma client so local DATABASE_URL pooler remapping applies.
 *
 *   npx tsx scripts/apply-user-bio-skills.ts
 */
import { prisma } from "../src/server/db/prisma";

async function main() {
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" TEXT`
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "skills" TEXT[] DEFAULT ARRAY[]::TEXT[]`
  );
  console.log("Ensured users.bio and users.skills columns exist.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
