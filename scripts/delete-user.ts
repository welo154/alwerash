/**
 * Deletes a user from the database.
 * Run: npx tsx scripts/delete-user.ts <email>
 */
import { PrismaClient } from "@prisma/client";

if (!process.argv[2]) {
  console.error("Usage: npx tsx scripts/delete-user.ts <email>");
  process.exit(1);
}

const prisma = new PrismaClient();

const EMAIL = process.argv[2].toLowerCase().trim();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
  });

  if (!user) {
    console.log(`User ${EMAIL} not found.`);
    return;
  }

  await prisma.user.delete({
    where: { id: user.id },
  });

  console.log(`Deleted user ${EMAIL} from database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
