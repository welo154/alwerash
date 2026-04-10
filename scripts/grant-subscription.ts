/**
 * Grant active ALL_ACCESS entitlement to a user by email (same as free subscribe flow).
 *
 * PowerShell:
 *   $env:USER_EMAIL="user@example.com"; $env:SUBSCRIPTION_MONTHS="12"; npx tsx scripts/grant-subscription.ts
 *
 * SUBSCRIPTION_MONTHS defaults to 12.
 */
import "dotenv/config";
import { prisma } from "../src/server/db/prisma";
import { createFreeEntitlement } from "../src/server/subscription/subscribe.service";

function must(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

async function main() {
  const email = must("USER_EMAIL").toLowerCase();
  const months = Math.max(1, Math.min(120, Number(process.env.SUBSCRIPTION_MONTHS ?? "12") || 12));

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  const { expiresAt } = await createFreeEntitlement(user.id, months);
  console.log(`Granted ALL_ACCESS to ${user.email} until ${expiresAt.toISOString()} (${months} month(s)).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
