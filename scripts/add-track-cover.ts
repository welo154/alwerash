/**
 * Adds cover_image column to tracks table.
 * Run: npx tsx scripts/add-track-cover.ts
 */
import { PrismaClient } from "@prisma/client";
import { createScriptPrismaClient } from "./lib/prisma-client";

const prisma = createScriptPrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "cover_image" TEXT'
  );
  console.log("Added cover_image column to tracks table.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
