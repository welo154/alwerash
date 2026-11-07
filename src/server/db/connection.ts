/**
 * Runtime database connection settings for the Prisma 7 driver adapter
 * (`@prisma/adapter-pg`, which uses a node-postgres pool).
 *
 * Prisma 6's engine read pool settings from URL parameters (connection_limit,
 * pool_timeout, pgbouncer). node-postgres does not, so they are taken out of
 * the URL here and turned into pool options. Kept free of Prisma imports so it
 * can be unit-tested.
 */
import type { PoolConfig } from "pg";

type Env = Record<string, string | undefined>;

/** URL parameters that only Prisma's old engine understood, or that are handled below. */
const ENGINE_ONLY_PARAMS = [
  "connection_limit",
  "pool_timeout",
  "pgbouncer",
  "connect_timeout",
  "schema",
  "sslmode",
  "sslaccept",
  "sslcert",
  "statement_cache_size",
];

export type RuntimeConnection = {
  pool: PoolConfig;
  /** Postgres schema for generated queries (from `?schema=`), if not "public". */
  schema?: string;
};

/** Remove a pasted `KEY=` prefix, a BOM and wrapping quotes from an env value. */
export function stripEnvValue(raw: string): string {
  let s = raw.trim().replace(/^﻿/, "");
  for (const key of ["DATABASE_URL=", "DIRECT_URL="]) {
    if (s.startsWith(key)) s = s.slice(key.length).trim();
  }
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function firstPostgresUrl(env: Env, names: string[]): string | null {
  for (const name of names) {
    const value = env[name];
    if (!value) continue;
    const cleaned = stripEnvValue(value);
    if (/^postgres(?:ql)?:\/\//i.test(cleaned)) return cleaned;
  }
  return null;
}

/**
 * Pool size per server instance. Overridable with DB_CONNECTION_LIMIT (1–20).
 * The Supabase session pooler (:5432) allows 15 connections in total, so keep
 * this low there; the transaction pooler (:6543) allows more.
 */
export function resolveConnectionLimit(env: Env = process.env): number {
  const raw = env.DB_CONNECTION_LIMIT?.trim();
  if (raw && /^\d+$/.test(raw)) {
    const parsed = Number(raw);
    if (parsed >= 1 && parsed <= 20) return parsed;
  }
  return env.NODE_ENV === "production" ? 1 : 5;
}

/**
 * Split a connection string without `new URL()`: passwords containing `@`, `#`
 * or `/` break the URL parser.
 */
function splitConnectionString(connectionString: string) {
  const protoEnd = connectionString.indexOf("://");
  const protocol = connectionString.slice(0, protoEnd + 3);
  const after = connectionString.slice(protoEnd + 3);
  // The host starts after the last "@" (a password may itself contain "@", "/" or "?")
  // and ends at the first "/" or "?" after it.
  const userEnd = after.lastIndexOf("@");
  const rest = userEnd === -1 ? after : after.slice(userEnd + 1);
  const userinfo = userEnd === -1 ? "" : after.slice(0, userEnd + 1);
  const pathStart = rest.search(/[/?]/);
  const hostPort = pathStart === -1 ? rest : rest.slice(0, pathStart);
  const pathAndQuery = pathStart === -1 ? "" : rest.slice(pathStart);
  const q = pathAndQuery.indexOf("?");
  const path = q === -1 ? pathAndQuery : pathAndQuery.slice(0, q);
  const params = new URLSearchParams(q === -1 ? "" : pathAndQuery.slice(q + 1));

  let host = hostPort;
  let port = "";
  const colon = hostPort.lastIndexOf(":");
  if (colon !== -1 && !hostPort.endsWith("]")) {
    host = hostPort.slice(0, colon);
    port = hostPort.slice(colon + 1);
  }
  return { protocol, userinfo, host, port, path, params };
}

function isLocalHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
}

/**
 * TLS settings.
 *
 * Supabase signs its certificates with its own CA, which is not in Node's
 * trust store. With DATABASE_CA_CERT (the PEM from Supabase → Settings →
 * Database → SSL) the certificate is fully verified. Without it the
 * connection is still encrypted but the certificate is not verified, matching
 * libpq's `sslmode=require` and how the app connected under Prisma 6.
 */
function sslConfig(host: string, sslmode: string | null, env: Env): PoolConfig["ssl"] {
  if (sslmode === "disable") return false;
  const ca = env.DATABASE_CA_CERT?.trim().replace(/\\n/g, "\n");
  if (ca) return { ca, rejectUnauthorized: true };
  if (isLocalHost(host) && !sslmode) return false;
  if (sslmode || host.endsWith(".supabase.com") || host.endsWith(".supabase.co")) {
    return { rejectUnauthorized: false };
  }
  return false;
}

/** Pool configuration for the app's runtime connection, or null when no URL is set. */
export function resolveRuntimeConnection(env: Env = process.env): RuntimeConnection | null {
  const raw = firstPostgresUrl(env, [
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "DIRECT_URL",
    "POSTGRES_URL_NON_POOLING",
  ]);
  if (!raw) return null;

  const { protocol, userinfo, host, port, path, params } = splitConnectionString(raw);
  const sslmode = params.get("sslmode");
  const schema = params.get("schema") ?? undefined;
  const connectSeconds = Number(params.get("connect_timeout") ?? "10");
  for (const name of ENGINE_ONLY_PARAMS) params.delete(name);

  const query = params.toString();
  const connectionString = `${protocol}${userinfo}${host}:${port || "5432"}${path || "/postgres"}${query ? `?${query}` : ""}`;

  return {
    pool: {
      connectionString,
      max: resolveConnectionLimit(env),
      connectionTimeoutMillis: (Number.isFinite(connectSeconds) && connectSeconds > 0 ? connectSeconds : 10) * 1000,
      // Serverless instances freeze between requests; drop idle sockets quickly.
      idleTimeoutMillis: 10_000,
      ssl: sslConfig(host, sslmode, env),
    },
    schema: schema && schema !== "public" ? schema : undefined,
  };
}
