/**
 * One-time backfill: set emailVerified = createdAt for all users where emailVerified is null.
 * Run after enabling email verification so existing users can still sign in.
 *
 * Usage: npx tsx scripts/backfill-email-verified.ts
 */
import { prisma } from "../src/server/db/prisma";

async function main() {
  const users = await prisma.user.findMany({
    where: { emailVerified: null },
    select: { id: true, createdAt: true },
  });

  if (users.length === 0) {
    console.log("No users to backfill.");
    return;
  }

  let updated = 0;
  for (const u of users) {
    await prisma.user.update({
      where: { id: u.id },
      data: { emailVerified: u.createdAt },
    });
    updated++;
  }
  console.log(`Backfilled emailVerified for ${updated} user(s).`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
