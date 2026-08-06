import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export type UserProfileFields = {
  name: string | null;
  profession: string | null;
  bio: string | null;
  skills: string[];
};

/**
 * Reads profile fields via raw SQL so bio/skills work even before
 * `prisma generate` picks up new columns. Falls back gracefully.
 */
export async function readUserProfileFromDb(
  userId: string
): Promise<UserProfileFields | null> {
  try {
    const rows = await prisma.$queryRaw<
      {
        name: string | null;
        profession: string | null;
        bio: string | null;
        skills: string[] | null;
      }[]
    >(
      Prisma.sql`
        SELECT "name", "profession", "bio", "skills"
        FROM "users"
        WHERE "id" = ${userId}
        LIMIT 1
      `
    );
    const row = rows[0];
    if (!row) return null;
    return {
      name: row.name,
      profession: row.profession,
      bio: row.bio,
      skills: row.skills ?? [],
    };
  } catch {
    // Older schema without bio/skills — read what we can
    try {
      const rows = await prisma.$queryRaw<
        { name: string | null; profession: string | null }[]
      >(
        Prisma.sql`
          SELECT "name", "profession"
          FROM "users"
          WHERE "id" = ${userId}
          LIMIT 1
        `
      );
      const row = rows[0];
      if (!row) return null;
      return {
        name: row.name,
        profession: row.profession,
        bio: null,
        skills: [],
      };
    } catch {
      return null;
    }
  }
}
