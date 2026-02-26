/**
 * Create a learner (subscriber) account.
 * Run: npx tsx scripts/create-learner.ts
 * Or: npx tsx scripts/create-learner.ts ahwaleed@gmail.com "Alwerash2025$"
 */
import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient();
const EMAIL = (process.argv[2] ?? "ahwaleed@gmail.com").toLowerCase().trim();
const PASSWORD = process.argv[3] ?? "Alwerash2025$";

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