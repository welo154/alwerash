// file: src/server/db/prisma.ts
import { PrismaClient } from "@prisma/client";

const LOCAL_MIN_CONNECTION_LIMIT = 10;
const POOL_TIMEOUT_SECONDS = 20;
const isServerless = Boolean(process.env.VERCEL);

/**
 * Vercel env values are often pasted with wrapping quotes or a DATABASE_URL= prefix.
 */
function stripEnvValue(raw: string): string {
  let s = raw.trim().replace(/^\uFEFF/, "");
  if (s.startsWith("DATABASE_URL=")) s = s.slice("DATABASE_URL=".length).trim();
  if (s.startsWith("DIRECT_URL=")) s = s.slice("DIRECT_URL=".length).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

/**
 * Serverless: one Prisma connection per lambda + Supabase transaction pooler (:6543).
 * Session mode (:5432) with connection_limit=15 exhausts pool_size 15 across lambdas
 * (EMAXCONNSESSION) and the catalog renders empty.
 */
function applyPoolSettings(
  connectionString: string,
  role: "runtime" | "direct",
): string {
  const match = connectionString.match(/^(postgres(?:ql)?:\/\/)(.+)$/i);
  if (!match) return connectionString;
  const protocol =
    match[1].toLowerCase() === "postgres://" ? "postgres://" : "postgresql://";
  try {
    const url = new URL(`http://${match[2]}`);
    const isSupabasePooler = url.hostname.includes("pooler.supabase.com");

    if (role === "runtime" && isServerless) {
      url.searchParams.set("connection_limit", "1");
      url.searchParams.set("pool_timeout", String(POOL_TIMEOUT_SECONDS));
      if (isSupabasePooler && (url.port === "5432" || url.port === "")) {
        url.port = "6543";
      }
      if (url.port === "6543") {
        url.searchParams.set("pgbouncer", "true");
      }
    } else if (role === "runtime") {
      const limit = Number(url.searchParams.get("connection_limit") ?? "0");
      if (!Number.isFinite(limit) || limit < LOCAL_MIN_CONNECTION_LIMIT) {
        url.searchParams.set("connection_limit", String(LOCAL_MIN_CONNECTION_LIMIT));
      }
      url.searchParams.set("pool_timeout", "30");
      if (url.port === "5432") {
        url.searchParams.delete("pgbouncer");
      }
    } else {
      url.searchParams.delete("pgbouncer");
      url.searchParams.set("connection_limit", "1");
    }

    const rest = url.toString().replace(/^http:\/\//, "");
    return `${protocol}${rest}`;
  } catch {
    return connectionString;
  }
}

function firstPostgresUrl(
  role: "runtime" | "direct",
  ...candidates: Array<string | undefined>
): string | null {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const cleaned = stripEnvValue(candidate);
    if (/^postgres(?:ql)?:\/\//i.test(cleaned)) {
      return applyPoolSettings(cleaned, role);
    }
  }
  return null;
}

function resolveDatabaseUrl(): string | null {
  return firstPostgresUrl(
    "runtime",
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.DIRECT_URL,
    process.env.POSTGRES_URL_NON_POOLING,
  );
}

function resolveDirectUrl(databaseUrl: string): string {
  return (
    firstPostgresUrl(
      "direct",
      process.env.DIRECT_URL,
      process.env.POSTGRES_URL_NON_POOLING,
      process.env.DATABASE_URL,
    ) ?? databaseUrl
  );
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const url = resolveDatabaseUrl();
  if (!url) {
    const sample = stripEnvValue(process.env.DATABASE_URL ?? "").slice(0, 24);
    throw new Error(
      `DATABASE_URL must start with postgresql:// (got ${sample ? JSON.stringify(sample) : "empty"}). In Vercel → Settings → Environment Variables, paste the Supabase pooler URI with no quotes, then Redeploy.`,
    );
  }

  process.env.DATABASE_URL = url;
  process.env.DIRECT_URL = resolveDirectUrl(url);

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
