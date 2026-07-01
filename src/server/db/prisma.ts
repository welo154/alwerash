// file: src/server/db/prisma.ts
import { PrismaClient } from "@prisma/client";

const MIN_CONNECTION_LIMIT = 15;
const POOL_TIMEOUT_SECONDS = 30;

/**
 * Normalize DATABASE_URL pool settings for Supabase Session pooler.
 * Prevents pool timeouts when pages run parallel queries (e.g. /home Promise.all).
 * Stale dev-server processes may otherwise keep connection_limit=1 from an old .env.
 */
function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }

  try {
    const url = new URL(raw.replace(/^postgresql:\/\//, "http://"));
    const limit = Number(url.searchParams.get("connection_limit") ?? "0");
    if (!Number.isFinite(limit) || limit < MIN_CONNECTION_LIMIT) {
      url.searchParams.set("connection_limit", String(MIN_CONNECTION_LIMIT));
    }
    url.searchParams.set("pool_timeout", String(POOL_TIMEOUT_SECONDS));
    // Session pooler (5432): pgbouncer=true is for transaction pooler (:6543) only.
    if (url.port === "5432") {
      url.searchParams.delete("pgbouncer");
    }
    return url.toString().replace(/^http:\/\//, "postgresql://");
  } catch {
    return raw;
  }
}

/**
 * Prisma client singleton. Reused in development to avoid creating new instances on hot reload.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: resolveDatabaseUrl() },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
