/**
 * Prisma client for command-line scripts and the seed.
 *
 * Prisma 7 requires a driver adapter, so a bare PrismaClient no longer
 * connects. This uses the same connection settings as the app
 * (src/server/db/connection.ts), with a slightly larger pool for batch work.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { resolveRuntimeConnection } from "../../src/server/db/connection";

export function createScriptPrismaClient(): PrismaClient {
  const connection = resolveRuntimeConnection({
    ...process.env,
    DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT ?? "5",
  });
  if (!connection) throw new Error("DATABASE_URL is not set (or does not start with postgresql://).");
  return new PrismaClient({
    adapter: new PrismaPg(connection.pool, connection.schema ? { schema: connection.schema } : undefined),
  });
}
