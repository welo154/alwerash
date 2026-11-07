import { describe, expect, it } from "vitest";
import { resolveConnectionLimit, resolveRuntimeConnection, stripEnvValue } from "./connection";

const POOLER = "postgresql://postgres.ref:p%40ss@aws-0-eu-west-1.pooler.supabase.com:6543/postgres";

describe("resolveRuntimeConnection", () => {
  it("returns null without a postgres URL", () => {
    expect(resolveRuntimeConnection({})).toBeNull();
    expect(resolveRuntimeConnection({ DATABASE_URL: "mysql://x" })).toBeNull();
  });

  it("moves Prisma 6 engine parameters out of the URL and into pool options", () => {
    const c = resolveRuntimeConnection({
      NODE_ENV: "production",
      DATABASE_URL: `${POOLER}?pgbouncer=true&connection_limit=1&pool_timeout=20&connect_timeout=15&sslmode=require`,
    })!;
    expect(c.pool.connectionString).toBe(POOLER);
    expect(c.pool.max).toBe(1);
    expect(c.pool.connectionTimeoutMillis).toBe(15_000);
  });

  it("encrypts Supabase connections, and verifies them when a CA is given", () => {
    expect(resolveRuntimeConnection({ DATABASE_URL: POOLER })!.pool.ssl).toEqual({ rejectUnauthorized: false });
    const verified = resolveRuntimeConnection({ DATABASE_URL: POOLER, DATABASE_CA_CERT: "-----BEGIN CERTIFICATE-----\\nabc" })!;
    expect(verified.pool.ssl).toEqual({ ca: "-----BEGIN CERTIFICATE-----\nabc", rejectUnauthorized: true });
  });

  it("uses no TLS for a local database unless asked", () => {
    expect(resolveRuntimeConnection({ DATABASE_URL: "postgresql://u:p@localhost:5432/db" })!.pool.ssl).toBe(false);
    expect(resolveRuntimeConnection({ DATABASE_URL: "postgresql://u:p@localhost/db?sslmode=require" })!.pool.ssl).toEqual({
      rejectUnauthorized: false,
    });
    expect(resolveRuntimeConnection({ DATABASE_URL: `${POOLER}?sslmode=disable` })!.pool.ssl).toBe(false);
  });

  it("keeps passwords containing @, / and ? intact and defaults the port and database", () => {
    const c = resolveRuntimeConnection({ DATABASE_URL: "postgresql://user:a@b/c?d@db.example.com" })!;
    expect(c.pool.connectionString).toBe("postgresql://user:a@b/c?d@db.example.com:5432/postgres");
  });

  it("passes a non-public schema to the adapter", () => {
    expect(resolveRuntimeConnection({ DATABASE_URL: "postgresql://u:p@h/db?schema=app" })!.schema).toBe("app");
    expect(resolveRuntimeConnection({ DATABASE_URL: "postgresql://u:p@h/db?schema=public" })!.schema).toBeUndefined();
  });

  it("falls back to other Vercel/Supabase variable names", () => {
    expect(resolveRuntimeConnection({ POSTGRES_PRISMA_URL: "postgresql://u:p@h/db" })).not.toBeNull();
  });
});

describe("helpers", () => {
  it("cleans pasted env values", () => {
    expect(stripEnvValue(' DATABASE_URL="postgresql://x" ')).toBe("postgresql://x");
    expect(stripEnvValue("﻿'postgresql://y'")).toBe("postgresql://y");
  });

  it("sizes the pool by environment, with a bounded override", () => {
    expect(resolveConnectionLimit({ NODE_ENV: "production" })).toBe(1);
    expect(resolveConnectionLimit({ NODE_ENV: "development" })).toBe(5);
    expect(resolveConnectionLimit({ DB_CONNECTION_LIMIT: "4" })).toBe(4);
    expect(resolveConnectionLimit({ NODE_ENV: "production", DB_CONNECTION_LIMIT: "99" })).toBe(1);
  });
});
