import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/lib/errors";
import type { StudentRatingCard } from "@/components/students/student-rating-types";

const STORY_SELECT = {
  id: true,
  name: true,
  jobTitle: true,
  quote: true,
  projectImage: true,
  sortOrder: true,
  published: true,
} as const;

export type StudentStoryRecord = Prisma.StudentStoryGetPayload<{ select: typeof STORY_SELECT }>;

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const picked = parts.length >= 2 ? parts.slice(0, 2) : parts;
  const initials = picked.map((part) => part[0] ?? "").join("").toUpperCase();
  return initials.slice(0, 2) || "ST";
}

function toCard(story: { name: string; jobTitle: string; quote: string; projectImage: string | null }): StudentRatingCard {
  return {
    quote: story.quote,
    initials: initialsFromName(story.name),
    name: story.name,
    role: story.jobTitle,
    projectImage: story.projectImage,
  };
}

function requiredText(value: unknown, label: string, max: number): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError("BAD_REQUEST", 400, `${label} is required`);
  }
  const text = value.trim();
  if (text.length > max) {
    throw new AppError("BAD_REQUEST", 400, `${label} must be ${max} characters or fewer`);
  }
  return text;
}

function sortOrderFrom(value: unknown, fallback = 0): number {
  if (value == null || value === "") return fallback;
  const order = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(order) || order < 0 || order > 999) {
    throw new AppError("BAD_REQUEST", 400, "Order must be a whole number from 0 to 999");
  }
  return order;
}

/** Published stories for the public section. Null when the table is not migrated yet. */
export async function publicListStudentStories(): Promise<StudentRatingCard[] | null> {
  try {
    const rows = await prisma.studentStory.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      take: 4,
      select: { name: true, jobTitle: true, quote: true, projectImage: true },
    });
    return rows.map(toCard);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      return null;
    }
    console.warn(
      "[student-stories] unavailable",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

export async function adminListStudentStories(): Promise<StudentStoryRecord[]> {
  return prisma.studentStory.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: STORY_SELECT,
  });
}

export async function adminGetStudentStory(id: string): Promise<StudentStoryRecord> {
  const story = await prisma.studentStory.findUnique({ where: { id }, select: STORY_SELECT });
  if (!story) throw new AppError("NOT_FOUND", 404, "Student story not found");
  return story;
}

export async function adminCreateStudentStory(input: unknown): Promise<StudentStoryRecord> {
  const body = (input ?? {}) as Record<string, unknown>;
  return prisma.studentStory.create({
    data: {
      name: requiredText(body.name, "Name", 80),
      jobTitle: requiredText(body.jobTitle, "Job title", 80),
      quote: requiredText(body.quote, "Review", 800),
      sortOrder: sortOrderFrom(body.sortOrder, 0),
      published: body.published !== false,
    },
    select: STORY_SELECT,
  });
}

export async function adminUpdateStudentStory(id: string, input: unknown): Promise<StudentStoryRecord> {
  await adminGetStudentStory(id);
  const body = (input ?? {}) as Record<string, unknown>;
  return prisma.studentStory.update({
    where: { id },
    data: {
      name: requiredText(body.name, "Name", 80),
      jobTitle: requiredText(body.jobTitle, "Job title", 80),
      quote: requiredText(body.quote, "Review", 800),
      sortOrder: sortOrderFrom(body.sortOrder, 0),
      published: body.published !== false,
    },
    select: STORY_SELECT,
  });
}

export async function adminSetStudentStoryProject(id: string, projectImage: string | null) {
  await adminGetStudentStory(id);
  await prisma.studentStory.update({ where: { id }, data: { projectImage } });
}

export async function adminDeleteStudentStory(id: string) {
  await adminGetStudentStory(id);
  await prisma.studentStory.delete({ where: { id } });
}
