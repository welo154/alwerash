// file: src/server/db/prisma.ts
import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton. Reused in development to avoid creating new instances on hot reload.
 * In production a single instance is used.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
