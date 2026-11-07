import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { createScriptPrismaClient } from "./lib/prisma-client";

const prisma = createScriptPrismaClient();

async function main() {
  await prisma.$queryRawUnsafe("SELECT 1");
  console.log("OK: database reachable");
}

main()
  .catch((e) => {
    console.error("FAIL:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
