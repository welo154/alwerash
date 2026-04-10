/**
 * Set a user's password hash (and ensure email is verified for credentials login).
 *
 * Run (PowerShell):
 *   $env:USER_EMAIL="user@example.com"; $env:NEW_PASSWORD="..."; npx tsx scripts/reset-user-password.ts
 *
 * Or (bash):
 *   USER_EMAIL=user@example.com NEW_PASSWORD='...' npx tsx scripts/reset-user-password.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient();

function must(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

async function main() {
  const email = must("USER_EMAIL").toLowerCase();
  const password = must("NEW_PASSWORD");

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      emailVerified: new Date(),
    },
  });

  console.log(`Password updated for ${user.email}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
