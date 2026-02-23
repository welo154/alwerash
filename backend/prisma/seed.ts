/**
 * Prisma seed script: creates (or updates) the first admin user.
 *
 * Run with: npx prisma db seed
 *
 * Required env: ADMIN_EMAIL, ADMIN_PASSWORD
 * Optional env: ADMIN_NAME (default: "Admin")
 *
 * - If no user exists with that email, creates the user with ADMIN role.
 * - If the user exists, updates name and password hash, and ensures ADMIN role exists.
 */
import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/auth/password";

const prisma = new PrismaClient();

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

async function main() {
  const email = mustGetEnv("ADMIN_EMAIL").toLowerCase().trim();
  const password = mustGetEnv("ADMIN_PASSWORD");
  const name = (process.env.ADMIN_NAME ?? "Admin").trim() || "Admin";

  const passwordHash = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
    },
    create: {
      email,
      name,
      passwordHash,
      roles: {
        create: { role: Role.ADMIN },
      },
    },
    select: { id: true, email: true, name: true },
  });

  // Ensure ADMIN role exists even if user was created without it (e.g. via OAuth)
  await prisma.userRole.upsert({
    where: {
      userId_role: { userId: admin.id, role: Role.ADMIN },
    },
    update: {},
    create: { userId: admin.id, role: Role.ADMIN },
  });

  console.log("Seeded admin:", admin.email);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
