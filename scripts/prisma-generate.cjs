/**
 * Run `prisma generate` even when DATABASE_URL / DIRECT_URL are not set yet
 * (common on the first Vercel install before project env vars are wired).
 */
const { spawnSync } = require("child_process");

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://prisma:prisma@127.0.0.1:5432/prisma";
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

const result = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
