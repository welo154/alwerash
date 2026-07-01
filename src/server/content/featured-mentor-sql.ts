import { prisma } from "@/server/db/prisma";

export const MAX_FEATURED_MENTORS = 8;

function isMissingFeaturedColumnError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return msg.includes("featured_order") && msg.includes("does not exist");
}

export async function sqlGetFeaturedOrderMap(mentorIds: string[]): Promise<Map<string, number>> {
  if (mentorIds.length === 0) return new Map();
  try {
    const rows = await prisma.$queryRawUnsafe<
      { id: string; featured_order: number | null }[]
    >(
      `SELECT id, featured_order FROM mentors WHERE id = ANY($1::text[])`,
      mentorIds
    );
    const map = new Map<string, number>();
    for (const row of rows) {
      if (row.featured_order != null) map.set(row.id, row.featured_order);
    }
    return map;
  } catch (e) {
    if (isMissingFeaturedColumnError(e)) return new Map();
    throw e;
  }
}

export async function sqlGetFeaturedOrder(mentorId: string): Promise<number | null> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ featured_order: number | null }[]>(
      `SELECT featured_order FROM mentors WHERE id = $1`,
      mentorId
    );
    return rows[0]?.featured_order ?? null;
  } catch (e) {
    if (isMissingFeaturedColumnError(e)) return null;
    throw e;
  }
}

export async function sqlGetFeaturedMentorIds(limit: number): Promise<string[]> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM mentors WHERE featured_order IS NOT NULL ORDER BY featured_order ASC LIMIT $1`,
      limit
    );
    return rows.map((row) => row.id);
  } catch (e) {
    if (isMissingFeaturedColumnError(e)) return [];
    throw e;
  }
}

export async function sqlCountFeaturedMentors(): Promise<number> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(*)::bigint AS count FROM mentors WHERE featured_order IS NOT NULL`
    );
    return Number(rows[0]?.count ?? 0);
  } catch (e) {
    if (isMissingFeaturedColumnError(e)) return 0;
    throw e;
  }
}

export async function sqlMaxFeaturedOrder(): Promise<number> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ max: number | null }[]>(
      `SELECT MAX(featured_order) AS max FROM mentors`
    );
    return rows[0]?.max ?? 0;
  } catch (e) {
    if (isMissingFeaturedColumnError(e)) return 0;
    throw e;
  }
}

export async function sqlSetFeaturedOrder(mentorId: string, order: number | null): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE mentors SET featured_order = $1, updated_at = now() WHERE id = $2`,
      order,
      mentorId
    );
  } catch (e) {
    if (isMissingFeaturedColumnError(e)) return;
    throw e;
  }
}
