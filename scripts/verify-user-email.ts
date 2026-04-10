/**
 * Mark a user's email as verified (for credentials login).
 *
 *   $env:USER_EMAIL="user@example.com"; npx tsx scripts/verify-user-email.ts
 */
import "dotenv/config";
import { prisma } from "../src/server/db/prisma";

function must(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

async function main() {
  const email = must("USER_EMAIL").toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, emailVerified: true },
  });

  if (!user) {
    console.error(`No user found: ${email}`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  console.log(`Email verified for ${user.email}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
