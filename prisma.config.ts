import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma CLI configuration (migrate, db push, studio, seed).
 *
 * The CLI connects with DIRECT_URL when set: migrations need a direct or
 * session-pooler connection, not the transaction pooler. The app itself
 * connects at runtime through src/server/db/prisma.ts.
 */
const migrationUrl = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Placeholder lets `prisma generate` run on CI and first installs without a database.
    url: migrationUrl || "postgresql://prisma:prisma@127.0.0.1:5432/prisma",
  },
});
