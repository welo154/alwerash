import "dotenv/config";
import { PrismaClient } from "@prisma/client";

function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL!;
  const url = new URL(raw.replace(/^postgresql:\/\//, "http://"));
  const limit = Number(url.searchParams.get("connection_limit") ?? "0");
  if (!Number.isFinite(limit) || limit < 15) {
    url.searchParams.set("connection_limit", "15");
  }
  url.searchParams.set("pool_timeout", "30");
  if (url.port === "5432") url.searchParams.delete("pgbouncer");
  return url.toString().replace(/^http:\/\//, "postgresql://");
}

async function main() {
  const prisma = new PrismaClient({
    datasources: { db: { url: resolveDatabaseUrl() } },
  });
  await Promise.all([
    prisma.$queryRawUnsafe("SELECT 1"),
    prisma.$queryRawUnsafe("SELECT 2"),
    prisma.$queryRawUnsafe("SELECT 3"),
    prisma.$queryRawUnsafe("SELECT 4"),
    prisma.$queryRawUnsafe("SELECT 5"),
    prisma.$queryRawUnsafe("SELECT 6"),
  ]);
  console.log("OK: 6 parallel queries");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("FAIL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
