import { prisma } from "@/server/db/prisma";
import type { CourseCatalogTagKey, CourseCatalogTagState } from "@/types/course-catalog-tags";

const TAG_DB_COLUMN: Record<CourseCatalogTagKey, string> = {
  tagGuided: "tag_guided",
  tagDeepDive: "tag_deep_dive",
  tagBasics: "tag_basics",
  tagNew: "tag_new",
  tagTopRated: "tag_top_rated",
};

type TagRow = {
  id: string;
  tag_guided: boolean;
  tag_deep_dive: boolean;
  tag_basics: boolean;
  tag_new: boolean;
  tag_top_rated: boolean;
};

function rowToTags(row: TagRow): CourseCatalogTagState {
  return {
    tagGuided: row.tag_guided,
    tagDeepDive: row.tag_deep_dive,
    tagBasics: row.tag_basics,
    tagNew: row.tag_new,
    tagTopRated: row.tag_top_rated,
  };
}

export const EMPTY_COURSE_TAGS: CourseCatalogTagState = {
  tagGuided: false,
  tagDeepDive: false,
  tagBasics: false,
  tagNew: false,
  tagTopRated: false,
};

export async function sqlGetCourseTagMap(
  courseIds: string[]
): Promise<Map<string, CourseCatalogTagState>> {
  const out = new Map<string, CourseCatalogTagState>();
  if (courseIds.length === 0) return out;

  try {
    const rows = await prisma.$queryRawUnsafe<TagRow[]>(
      `SELECT id, tag_guided, tag_deep_dive, tag_basics, tag_new, tag_top_rated
       FROM courses
       WHERE id = ANY($1::text[])`,
      courseIds
    );
    for (const row of rows) {
      out.set(row.id, rowToTags(row));
    }
  } catch {
    // tag_* columns may not exist yet
  }

  return out;
}

export async function sqlGetCourseTags(courseId: string): Promise<CourseCatalogTagState> {
  const map = await sqlGetCourseTagMap([courseId]);
  return map.get(courseId) ?? EMPTY_COURSE_TAGS;
}

export async function sqlSetCourseTag(
  courseId: string,
  tag: CourseCatalogTagKey,
  enabled: boolean
): Promise<void> {
  const column = TAG_DB_COLUMN[tag];
  await prisma.$executeRawUnsafe(
    `UPDATE courses SET "${column}" = $1, updated_at = now() WHERE id = $2`,
    enabled,
    courseId
  );
}

export async function sqlUpdateCourseTags(
  courseId: string,
  tags: Partial<CourseCatalogTagState>
): Promise<void> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let idx = 0;

  for (const key of Object.keys(TAG_DB_COLUMN) as CourseCatalogTagKey[]) {
    if (tags[key] === undefined) continue;
    idx += 1;
    updates.push(`"${TAG_DB_COLUMN[key]}" = $${idx}`);
    values.push(tags[key]);
  }

  if (updates.length === 0) return;

  values.push(courseId);
  await prisma.$executeRawUnsafe(
    `UPDATE courses SET ${updates.join(", ")}, updated_at = now() WHERE id = $${idx + 1}`,
    ...values
  );
}
