/**
 * Removes ADMIN role from mazenhesham172@gmail.com
 * Run: npx tsx scripts/remove-admin-role.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EMAIL = "mazenhesham172@gmail.com";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    include: { roles: true },
  });

  if (!user) {
    console.log(`User ${EMAIL} not found.`);
    return;
  }

  const adminRole = user.roles.find((r) => r.role === "ADMIN");
  if (!adminRole) {
    console.log(`User ${EMAIL} does not have ADMIN role.`);
    return;
  }

  await prisma.userRole.delete({
    where: { id: adminRole.id },
  });

  console.log(`Removed ADMIN role from ${EMAIL}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
