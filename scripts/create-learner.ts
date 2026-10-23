/**
 * Create a learner (subscriber) account.
 * Run: npx tsx scripts/create-learner.ts <email> <password>
 */
import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient();
const [rawEmail, PASSWORD] = process.argv.slice(2);

if (!rawEmail || !PASSWORD) {
  console.error("Usage: npx tsx scripts/create-learner.ts <email> <password>");
  process.exit(1);
}
if (PASSWORD.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const EMAIL = rawEmail.toLowerCase().trim();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (existing) {
    console.log("Email already registered:", EMAIL);
    return;
  }

  const passwordHash = await hashPassword(PASSWORD);
  const user = await prisma.user.create({
    data: {
      email: EMAIL,
      passwordHash,
      roles: { create: { role: Role.LEARNER } },
    },
    select: { id: true, email: true, createdAt: true },
  });

  console.log("Created learner account:", user.email, "(id:", user.id + ")");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
