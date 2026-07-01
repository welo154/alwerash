/**
 * Import catalog tracks 4–17: mentors → tracks → courses.
 * Does NOT create modules, lessons, videos, or article content.
 *
 * Dry run (default):
 *   npm run scripts:import-catalog-tracks-4-17
 *
 * Apply changes:
 *   npm run scripts:import-catalog-tracks-4-17 -- --execute
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { CATALOG_TRACKS_4_17 } from "./catalog/tracks-4-17.data";
import { printCatalogSummary, runCatalogImport } from "./lib/catalog-import";

const prisma = new PrismaClient();
const EXECUTE = process.argv.includes("--execute");
const LABEL = "Catalog tracks 4–17 import";

async function main() {
  const summary = await runCatalogImport(
    prisma,
    CATALOG_TRACKS_4_17,
    EXECUTE,
    LABEL
  );
  printCatalogSummary(summary, LABEL, EXECUTE);
  if (summary.validationErrors.length > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
