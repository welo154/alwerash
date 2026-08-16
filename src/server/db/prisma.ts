// file: src/server/db/prisma.ts
import { PrismaClient } from "@prisma/client";

const MIN_CONNECTION_LIMIT = 15;
const POOL_TIMEOUT_SECONDS = 30;

function resolveDatabaseUrl(): string | null {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw.replace(/^postgresql:\/\//, "http://"));
    const limit = Number(url.searchParams.get("connection_limit") ?? "0");
    if (!Number.isFinite(limit) || limit < MIN_CONNECTION_LIMIT) {
      url.searchParams.set("connection_limit", String(MIN_CONNECTION_LIMIT));
    }
    url.searchParams.set("pool_timeout", String(POOL_TIMEOUT_SECONDS));
    if (url.port === "5432") {
      url.searchParams.delete("pgbouncer");
    }
    return url.toString().replace(/^http:\/\//, "postgresql://");
  } catch {
    return raw;
  }
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const url = resolveDatabaseUrl();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Vercel → Settings → Environment Variables (Production and Preview), then Redeploy.",
    );
  }

  const client = new PrismaClient({
    datasources: { db: { url } },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
  globalForPrisma.prisma = client;
  return client;
}

/** Lazy Prisma client — constructed on first query, not at import. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
