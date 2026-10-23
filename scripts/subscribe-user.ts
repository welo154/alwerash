/**
 * Grant subscription (entitlement) to a user by email so they can access course content.
 * Run: npx tsx scripts/subscribe-user.ts <email>
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

if (!process.argv[2]) {
  console.error("Usage: npx tsx scripts/subscribe-user.ts <email>");
  process.exit(1);
}

const prisma = new PrismaClient();
const EMAIL = process.argv[2].toLowerCase().trim();

function addMonths(date: Date, months: number): Date {
  const out = new Date(date);
  out.setMonth(out.getMonth() + months);
  return out;
}

async function main() {
  const user = await prisma.user.findUnique({ where: { email: EMAIL }, select: { id: true, email: true } });
  if (!user) {
    console.error("User not found:", EMAIL);
    process.exit(1);
  }

  const now = new Date();
  const expiresAt = addMonths(now, 12);

  await prisma.entitlement.upsert({
    where: { userId_product: { userId: user.id, product: "ALL_ACCESS" } },
    create: {
      userId: user.id,
      product: "ALL_ACCESS",
      status: "ACTIVE",
      expiresAt,
    },
    update: {
      status: "ACTIVE",
      expiresAt,
      updatedAt: now,
    },
  });

  console.log("Subscribed:", user.email, "— ALL_ACCESS until", expiresAt.toISOString().slice(0, 10));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
