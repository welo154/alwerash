import "dotenv/config";
import { createScriptPrismaClient } from "./lib/prisma-client";

async function main() {
  // Six parallel queries need a pool of at least six connections.
  process.env.DB_CONNECTION_LIMIT = "6";
  const prisma = createScriptPrismaClient();
  await Promise.all([
    prisma.$queryRawUnsafe("SELECT 1"),
    prisma.$queryRawUnsafe("SELECT 2"),
    prisma.$queryRawUnsafe("SELECT 3"),
    prisma.$queryRawUnsafe("SELECT 4"),
    prisma.$queryRawUnsafe("SELECT 5"),
    prisma.$queryRawUnsafe("SELECT 6"),
  ]);
  console.log("OK: 6 parallel queries");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("FAIL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
