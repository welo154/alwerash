import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { AppError } from "@/server/lib/errors";
import { beginQuery, reportPoolExhausted } from "@/server/observability/query-timing";
import { resolveRuntimeConnection, stripEnvValue } from "@/server/db/connection";

function errorText(error: unknown): string {
  if (error instanceof Error) {
    const cause = (error as Error & { cause?: unknown }).cause;
    return `${error.name} ${error.message} ${cause instanceof Error ? cause.message : ""}`;
  }
  return String(error);
}

/**
 * Connection-pool exhaustion: the app's own pool (node-postgres timeout, or
 * Prisma's P2024) or the Supabase pooler refusing clients. Matched narrowly:
 * any other database error must surface as-is.
 */
const POOL_MARKERS = [
  "P2024",
  "Timed out fetching a new connection from the connection pool",
  "timeout exceeded when trying to connect",
  "EMAXCONNSESSION",
  "MaxClientsInSessionMode",
  "max clients reached",
];

export function isPoolExhaustedError(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  if (code === "P2024") return true;
  const text = errorText(error);
  return POOL_MARKERS.some((marker) => text.includes(marker));
}

const POOL_RETRY_DELAYS_MS = [200, 500];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Thrown when the pool stays exhausted after retries. Callers see a 503 instead
 * of an empty result, so an outage never looks like "no courses" or "not subscribed".
 */
export class DatabaseUnavailableError extends AppError {
  constructor(cause: unknown) {
    super("UNAVAILABLE", 503, "The database is busy. Please try again in a moment.");
    this.cause = cause;
  }
}

/** Bump when client construction changes so dev hot reload drops the old instance. */
const PRISMA_CLIENT_REV = 4;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaRev?: number;
};

function createClient(): PrismaClient {
  const connection = resolveRuntimeConnection();
  if (!connection) {
    const sample = stripEnvValue(process.env.DATABASE_URL ?? "").slice(0, 24);
    throw new Error(
      `DATABASE_URL must start with postgresql:// (got ${sample ? JSON.stringify(sample) : "empty"}).`,
    );
  }

  // Prisma 7 connects through a driver adapter; the pool settings come from
  // src/server/db/connection.ts (size, timeouts, TLS).
  const adapter = new PrismaPg(connection.pool, connection.schema ? { schema: connection.schema } : undefined);

  const base = new PrismaClient({
    adapter,
    errorFormat: "minimal",
    log: [{ emit: "event", level: "error" }],
  });

  const extended = base.$extends({
    query: {
      async $allOperations({ model, operation, args, query }) {
        const finish = beginQuery(model, operation);
        let lastError: unknown;
        for (let attempt = 0; attempt <= POOL_RETRY_DELAYS_MS.length; attempt++) {
          if (attempt > 0) await sleep(POOL_RETRY_DELAYS_MS[attempt - 1]);
          try {
            const result = await query(args);
            finish?.({ rows: Array.isArray(result) ? result.length : undefined });
            return result;
          } catch (error) {
            if (!isPoolExhaustedError(error)) {
              finish?.({ failed: true });
              throw error;
            }
            lastError = error;
          }
        }
        finish?.({ failed: true });
        reportPoolExhausted(model, operation);
        throw new DatabaseUnavailableError(lastError);
      },
    },
  });

  return extended as unknown as PrismaClient;
}

function getClient(): PrismaClient {
  if (globalForPrisma.prismaRev !== PRISMA_CLIENT_REV) {
    void globalForPrisma.prisma?.$disconnect();
    globalForPrisma.prisma = undefined;
    globalForPrisma.prismaRev = PRISMA_CLIENT_REV;
  }
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

// Warm the client in local development only; tests and builds must be able to
// import this module without a database URL.
if (process.env.NODE_ENV === "development") {
  getClient();
}
