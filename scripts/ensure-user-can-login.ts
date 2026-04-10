/**
 * Set email_verified and password for a user (credentials login).
 *
 *   $env:USER_EMAIL="user@example.com"; $env:NEW_PASSWORD='...'; npx tsx scripts/ensure-user-can-login.ts
 */
import "dotenv/config";
import { prisma } from "../src/server/db/prisma";
import { hashPassword } from "../src/server/auth/password";

function must(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

async function main() {
  const email = must("USER_EMAIL").toLowerCase();
  const password = must("NEW_PASSWORD");

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, emailVerified: true, passwordHash: true },
  });

  if (!user) {
    console.error(`No user found: ${email}`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      emailVerified: new Date(),
    },
  });

  console.log(`Updated ${user.email}: email verified + new password hash set.`);
  console.log("Sign in with USER_EMAIL and NEW_PASSWORD from this run.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
