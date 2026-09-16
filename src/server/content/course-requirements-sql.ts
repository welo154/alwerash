import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function sqlGetCourseRequirements(courseId: string): Promise<string[]> {
  try {
    const rows = await prisma.$queryRaw<{ requirements: string[] | null }[]>`
      SELECT requirements FROM courses WHERE id = ${courseId}
    `;
    return Array.isArray(rows[0]?.requirements) ? rows[0].requirements.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export async function sqlSetCourseRequirements(courseId: string, items: string[]): Promise<void> {
  try {
    if (items.length === 0) {
      await prisma.$executeRaw`UPDATE courses SET requirements = ARRAY[]::text[] WHERE id = ${courseId}`;
      return;
    }
    await prisma.$executeRaw`
      UPDATE courses SET requirements = ARRAY[${Prisma.join(items)}]::text[] WHERE id = ${courseId}
    `;
  } catch {
    // requirements column may not exist yet
  }
}

export function parseRequirementLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 30);
}
