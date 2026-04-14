import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

/**
 * Reads `users.profession` via raw SQL so it works even when the generated
 * Prisma client is out of date (before `prisma generate`). Returns null if
 * the column is missing or the row has no profession.
 */
export async function readUserProfessionFromDb(
  userId: string
): Promise<string | null> {
  try {
    const rows = await prisma.$queryRaw<{ profession: string | null }[]>(
      Prisma.sql`SELECT "profession" FROM "users" WHERE "id" = ${userId} LIMIT 1`
    );
    return rows[0]?.profession ?? null;
  } catch {
    return null;
  }
}
