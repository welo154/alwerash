import { prisma } from "@/server/db/prisma";

function isMissingTrendingColumnError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return msg.includes("featured_trending_order") && msg.includes("does not exist");
}

export async function sqlGetTrendingOrderMap(courseIds: string[]): Promise<Map<string, number>> {
  if (courseIds.length === 0) return new Map();
  try {
    const rows = await prisma.$queryRawUnsafe<
      { id: string; featured_trending_order: number | null }[]
    >(
      `SELECT id, featured_trending_order FROM courses WHERE id = ANY($1::text[])`,
      courseIds
    );
    const map = new Map<string, number>();
    for (const row of rows) {
      if (row.featured_trending_order != null) {
        map.set(row.id, row.featured_trending_order);
      }
    }
    return map;
  } catch (e) {
    if (isMissingTrendingColumnError(e)) return new Map();
    throw e;
  }
}

export async function sqlGetTrendingOrder(courseId: string): Promise<number | null> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ featured_trending_order: number | null }[]>(
      `SELECT featured_trending_order FROM courses WHERE id = $1`,
      courseId
    );
    return rows[0]?.featured_trending_order ?? null;
  } catch (e) {
    if (isMissingTrendingColumnError(e)) return null;
    throw e;
  }
}

export async function sqlGetTrendingCourseIds(limit: number): Promise<string[]> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM courses WHERE published = true AND featured_trending_order IS NOT NULL ORDER BY featured_trending_order ASC LIMIT $1`,
      limit
    );
    return rows.map((row) => row.id);
  } catch (e) {
    if (isMissingTrendingColumnError(e)) return [];
    throw e;
  }
}

export async function sqlCountTrendingCourses(): Promise<number> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(*)::bigint AS count FROM courses WHERE featured_trending_order IS NOT NULL`
    );
    return Number(rows[0]?.count ?? 0);
  } catch (e) {
    if (isMissingTrendingColumnError(e)) return 0;
    throw e;
  }
}

export async function sqlMaxTrendingOrder(): Promise<number> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ max: number | null }[]>(
      `SELECT MAX(featured_trending_order) AS max FROM courses`
    );
    return rows[0]?.max ?? 0;
  } catch (e) {
    if (isMissingTrendingColumnError(e)) return 0;
    throw e;
  }
}

export async function sqlSetTrendingOrder(courseId: string, order: number | null): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE courses SET featured_trending_order = $1, updated_at = now() WHERE id = $2`,
      order,
      courseId
    );
  } catch (e) {
    if (isMissingTrendingColumnError(e)) return;
    throw e;
  }
}
