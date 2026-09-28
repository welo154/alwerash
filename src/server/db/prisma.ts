import { PrismaClient } from "@prisma/client";
import { isPoolExhaustedText, silencePoolErrors } from "@/server/db/silence-pool-errors";
import { beginQuery, reportPoolDegraded } from "@/server/observability/query-timing";

silencePoolErrors();

const isDev = process.env.NODE_ENV !== "production";

/**
 * Prisma's client-side pool size.
 *
 * A pool of 1 makes every query wait for the one before it, which silently
 * serializes the `Promise.all` concurrency in page code. Overridable via
 * DB_CONNECTION_LIMIT so that effect can be measured against a real database
 * without editing code; the historical defaults are unchanged.
 *
 * The Supabase session pooler (:5432) has a total pool_size of 15 shared across
 * all clients, so check the pooler mode before raising this much.
 */
function resolveConnectionLimit(): number {
  const raw = process.env.DB_CONNECTION_LIMIT?.trim();
  if (raw && /^\d+$/.test(raw)) {
    const parsed = Number(raw);
    if (parsed >= 1 && parsed <= 20) return parsed;
  }
  return isDev ? 5 : 1;
}

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

function errorText(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name} ${error.message} ${error.stack ?? ""}`;
  }
  return String(error);
}

function isPoolError(error: unknown): boolean {
  return isPoolExhaustedText(errorText(error));
}

function emptyQueryResult(operation: string): unknown {
  switch (operation) {
    case "findMany":
    case "$queryRaw":
    case "$queryRawUnsafe":
      return [];
    case "count":
    case "$executeRaw":
    case "$executeRawUnsafe":
      return 0;
    case "aggregate":
    case "groupBy":
      return {};
    default:
      return null;
  }
}

/** Avoid `new URL()` — passwords with `@` / `#` make that parser fail and skip pool settings. */
function rewriteRuntimeUrl(connectionString: string): string {
  const protoEnd = connectionString.indexOf("://");
  if (protoEnd < 0) return connectionString;
  const protocol = connectionString.slice(0, protoEnd + 3);
  const after = connectionString.slice(protoEnd + 3);
  const slash = after.indexOf("/");
  const hostPart = slash === -1 ? after : after.slice(0, slash);
  const pathAndQuery = slash === -1 ? "" : after.slice(slash);

  const at = hostPart.lastIndexOf("@");
  const userinfo = at === -1 ? "" : hostPart.slice(0, at + 1);
  const hostPort = at === -1 ? hostPart : hostPart.slice(at + 1);

  let host = hostPort;
  let port = "";
  const colon = hostPort.lastIndexOf(":");
  if (colon !== -1 && !hostPort.endsWith("]")) {
    host = hostPort.slice(0, colon);
    port = hostPort.slice(colon + 1);
  }

  const isPooler = host.includes("pooler.supabase.com");
  if (isPooler) {
    port = "6543";
  } else if (!port) {
    port = "5432";
  }

  const qIndex = pathAndQuery.indexOf("?");
  const path = qIndex === -1 ? pathAndQuery || "/postgres" : pathAndQuery.slice(0, qIndex);
  const query = qIndex === -1 ? "" : pathAndQuery.slice(qIndex + 1);
  const params = new URLSearchParams(query);
  params.set("connection_limit", String(resolveConnectionLimit()));
  params.set("pool_timeout", "20");
  if (port === "6543") {
    params.set("pgbouncer", "true");
  }
  if (isPooler && !params.get("sslmode")) {
    params.set("sslmode", "require");
  }
  if (!params.get("connect_timeout")) {
    params.set("connect_timeout", "10");
  }

  return `${protocol}${userinfo}${host}:${port}${path}?${params.toString()}`;
}

function rewriteDirectUrl(connectionString: string): string {
  const protoEnd = connectionString.indexOf("://");
  if (protoEnd < 0) return connectionString;
  const protocol = connectionString.slice(0, protoEnd + 3);
  const after = connectionString.slice(protoEnd + 3);
  const slash = after.indexOf("/");
  const hostPart = slash === -1 ? after : after.slice(0, slash);
  const pathAndQuery = slash === -1 ? "" : after.slice(slash);
  const qIndex = pathAndQuery.indexOf("?");
  const path = qIndex === -1 ? pathAndQuery : pathAndQuery.slice(0, qIndex);
  const query = qIndex === -1 ? "" : pathAndQuery.slice(qIndex + 1);
  const params = new URLSearchParams(query);
  params.delete("pgbouncer");
  params.set("connection_limit", "1");
  return `${protocol}${hostPart}${path}?${params.toString()}`;
}

function firstPostgresUrl(...candidates: Array<string | undefined>): string | null {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const cleaned = stripEnvValue(candidate);
    if (/^postgres(?:ql)?:\/\//i.test(cleaned)) return cleaned;
  }
  return null;
}

function resolveDatabaseUrl(): string | null {
  const raw = firstPostgresUrl(
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.DIRECT_URL,
    process.env.POSTGRES_URL_NON_POOLING,
  );
  return raw ? rewriteRuntimeUrl(raw) : null;
}

function resolveDirectUrl(databaseUrl: string): string {
  const raw = firstPostgresUrl(
    process.env.DIRECT_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL,
  );
  return raw ? rewriteDirectUrl(raw) : databaseUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPoolBroken?: boolean;
};

function createClient(): PrismaClient {
  const url = resolveDatabaseUrl();
  if (!url) {
    const sample = stripEnvValue(process.env.DATABASE_URL ?? "").slice(0, 24);
    throw new Error(
      `DATABASE_URL must start with postgresql:// (got ${sample ? JSON.stringify(sample) : "empty"}).`,
    );
  }

  process.env.DATABASE_URL = url;
  process.env.DIRECT_URL = resolveDirectUrl(url);

  const base = new PrismaClient({
    datasources: { db: { url } },
    errorFormat: "minimal",
    log: [{ emit: "event", level: "error" }],
  });

  const extended = base.$extends({
    query: {
      async $allOperations({ model, operation, args, query }) {
        const finish = beginQuery(model, operation);

        if (globalForPrisma.prismaPoolBroken) {
          finish?.({ shortCircuited: true });
          return emptyQueryResult(operation);
        }
        try {
          const result = await query(args);
          finish?.({ rows: Array.isArray(result) ? result.length : undefined });
          return result;
        } catch (error) {
          if (!isPoolError(error)) {
            finish?.({ failed: true });
            throw error;
          }
          globalForPrisma.prismaPoolBroken = true;
          finish?.({ failed: true });
          reportPoolDegraded();
          return emptyQueryResult(operation);
        }
      },
    },
  });

  return extended as unknown as PrismaClient;
}

function getClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createClient();
  globalForPrisma.prisma = client;
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

if (isDev) {
  getClient();
}
