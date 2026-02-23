/**
 * Deletes user mazenhesham172@gmail.com from the database.
 * Run: npx tsx scripts/delete-user.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EMAIL = "mazenhesham172@gmail.com";

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
