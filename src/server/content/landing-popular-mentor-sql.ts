import { prisma } from "@/server/db/prisma";

export const MAX_LANDING_POPULAR_MENTORS = 6;

function isMissingLandingPopularColumnError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return msg.includes("landing_popular_order") && msg.includes("does not exist");
}

export async function sqlGetLandingPopularOrderMap(
  mentorIds: string[]
): Promise<Map<string, number>> {
  if (mentorIds.length === 0) return new Map();
  try {
    const rows = await prisma.$queryRawUnsafe<
      { id: string; landing_popular_order: number | null }[]
    >(
      `SELECT id, landing_popular_order FROM mentors WHERE id = ANY($1::text[])`,
      mentorIds
    );
    const map = new Map<string, number>();
    for (const row of rows) {
      if (row.landing_popular_order != null) map.set(row.id, row.landing_popular_order);
    }
    return map;
  } catch (e) {
    if (isMissingLandingPopularColumnError(e)) return new Map();
    throw e;
  }
}

export async function sqlGetLandingPopularOrder(mentorId: string): Promise<number | null> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ landing_popular_order: number | null }[]>(
      `SELECT landing_popular_order FROM mentors WHERE id = $1`,
      mentorId
    );
    return rows[0]?.landing_popular_order ?? null;
  } catch (e) {
    if (isMissingLandingPopularColumnError(e)) return null;
    throw e;
  }
}

export async function sqlGetLandingPopularMentorIds(limit: number): Promise<string[]> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM mentors WHERE landing_popular_order IS NOT NULL ORDER BY landing_popular_order ASC LIMIT $1`,
      limit
    );
    return rows.map((row) => row.id);
  } catch (e) {
    if (isMissingLandingPopularColumnError(e)) return [];
    throw e;
  }
}

export async function sqlCountLandingPopularMentors(): Promise<number> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(*)::bigint AS count FROM mentors WHERE landing_popular_order IS NOT NULL`
    );
    return Number(rows[0]?.count ?? 0);
  } catch (e) {
    if (isMissingLandingPopularColumnError(e)) return 0;
    throw e;
  }
}

export async function sqlMaxLandingPopularOrder(): Promise<number> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ max: number | null }[]>(
      `SELECT MAX(landing_popular_order) AS max FROM mentors`
    );
    return rows[0]?.max ?? 0;
  } catch (e) {
    if (isMissingLandingPopularColumnError(e)) return 0;
    throw e;
  }
}

export async function sqlSetLandingPopularOrder(
  mentorId: string,
  order: number | null
): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE mentors SET landing_popular_order = $1, updated_at = now() WHERE id = $2`,
      order,
      mentorId
    );
  } catch (e) {
    if (isMissingLandingPopularColumnError(e)) return;
    throw e;
  }
}
