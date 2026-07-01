/**
 * Import Design Fundamentals track: mentors → track → courses.
 * Does NOT create modules, lessons, videos, or article content.
 *
 * Dry run (default):
 *   npx tsx scripts/import-design-fundamentals.ts
 *   npm run scripts:import-design-fundamentals
 *
 * Apply changes:
 *   npx tsx scripts/import-design-fundamentals.ts --execute
 *   npm run scripts:import-design-fundamentals -- --execute
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EXECUTE = process.argv.includes("--execute");

const TRACK = {
  title: "Design Fundamentals",
  slug: "design-fundamentals",
  description:
    "A beginner-friendly track covering the essential foundations of design, including color theory, design thinking, drawing, layout, typography, and design history.",
  order: 1,
  published: true,
} as const;

const MENTOR_NAMES = [
  "Yamen El Gamal",
  "Dr. Mohamed Beiatia",
  "Dr. Ahmed Wahby",
  "Mohamed Abdelkhalek",
  "Moira Ali",
  "Rana Wasef",
  "Farida Falafel",
  "Kholoud Khaled",
] as const;

type CourseSeed = {
  title: string;
  level: string;
  mainMentor: string;
  secondaryMentor?: string;
  reference?: string | null;
  summary: string;
  order: number;
  published: boolean;
};

const COURSES: CourseSeed[] = [
  {
    title: "Color Theory for Designers",
    level: "Beginner",
    mainMentor: "Yamen El Gamal",
    secondaryMentor: "Dr. Mohamed Beiatia",
    reference: "Color Theory for Noobs | Beginner Guide - YouTube",
    summary: "Learn how to use matching colors in a poster to evoke a specific feeling.",
    order: 1,
    published: true,
  },
  {
    title: "Design Thinking, Research, Inspiration, Project Approach & Creative Block",
    level: "Beginner",
    mainMentor: "Dr. Ahmed Wahby",
    reference: "https://www.youtube.com/watch?v=gHGN6hs2gZY",
    summary: "A guide and roadmap on how to approach different design projects.",
    order: 2,
    published: true,
  },
  {
    title: "Drawing Fundamentals",
    level: "Beginner",
    mainMentor: "Mohamed Abdelkhalek",
    secondaryMentor: "Yamen El Gamal",
    reference: "Drawabox.com",
    summary: "Learn how to draw in 2-point and 3-point perspectives and build basic shapes.",
    order: 3,
    published: true,
  },
  {
    title: "Layout, Composition and Principles of Visual Design",
    level: "Beginner",
    mainMentor: "Yamen El Gamal",
    secondaryMentor: "Moira Ali",
    reference: "https://www.youtube.com/watch?v=yV0pdDSSVvU",
    summary: "Understand different Gestalt laws and visual design principles.",
    order: 4,
    published: true,
  },
  {
    title: "Typography Basics",
    level: "Beginner",
    mainMentor: "Rana Wasef",
    secondaryMentor: "Farida Falafel",
    reference: null,
    summary: "Understand the dynamics of type and layout and how they complement each other.",
    order: 5,
    published: true,
  },
  {
    title: "Design History for Designers",
    level: "Beginner",
    mainMentor: "Dr. Ahmed Wahby",
    secondaryMentor: "Kholoud Khaled",
    reference: "GUC lecs",
    summary: "Enrich your knowledge about design history and different schools of design.",
    order: 6,
    published: true,
  },
];

type Summary = {
  mode: "dry-run" | "execute";
  mentorsCreated: string[];
  mentorsReused: string[];
  trackAction: "created" | "reused" | "skipped";
  trackId: string | null;
  coursesCreated: string[];
  coursesSkipped: { title: string; reason: string }[];
  validationErrors: string[];
};

function buildCourseSummary(course: CourseSeed): string {
  const parts: string[] = [`Level: ${course.level}.`, course.summary.trim()];
  if (course.secondaryMentor?.trim()) {
    parts.push(`Secondary mentor: ${course.secondaryMentor.trim()}.`);
  }
  if (course.reference?.trim()) {
    parts.push(`Reference: ${course.reference.trim()}.`);
  }
  return parts.join(" ");
}

function validateCourses(): string[] {
  const errors: string[] = [];
  const mentorSet = new Set<string>(MENTOR_NAMES);

  for (const course of COURSES) {
    if (!mentorSet.has(course.mainMentor)) {
      errors.push(`Course "${course.title}": unknown main mentor "${course.mainMentor}".`);
    }
    if (course.secondaryMentor && !mentorSet.has(course.secondaryMentor)) {
      errors.push(`Course "${course.title}": unknown secondary mentor "${course.secondaryMentor}".`);
    }
  }

  const titles = new Set<string>();
  for (const course of COURSES) {
    if (titles.has(course.title)) {
      errors.push(`Duplicate course title in import data: "${course.title}".`);
    }
    titles.add(course.title);
  }

  return errors;
}

async function findMentorByName(name: string) {
  return prisma.mentor.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
    select: { id: true, name: true, photo: true },
  });
}

async function runImport(): Promise<Summary> {
  const summary: Summary = {
    mode: EXECUTE ? "execute" : "dry-run",
    mentorsCreated: [],
    mentorsReused: [],
    trackAction: "skipped",
    trackId: null,
    coursesCreated: [],
    coursesSkipped: [],
    validationErrors: validateCourses(),
  };

  if (summary.validationErrors.length > 0) {
    return summary;
  }

  const mentorIdByName = new Map<string, { id: string; name: string; photo: string | null }>();

  for (const name of MENTOR_NAMES) {
    const existing = await findMentorByName(name);
    if (existing) {
      mentorIdByName.set(name, existing);
      summary.mentorsReused.push(existing.name);
      continue;
    }
    if (EXECUTE) {
      const created = await prisma.mentor.create({
        data: {
          name,
          photo: null,
          certificateName: null,
          aboutMe: null,
        },
        select: { id: true, name: true, photo: true },
      });
      mentorIdByName.set(name, created);
      summary.mentorsCreated.push(created.name);
    } else {
      summary.mentorsCreated.push(name);
      mentorIdByName.set(name, { id: "(new)", name, photo: null });
    }
  }

  let track = await prisma.track.findUnique({
    where: { slug: TRACK.slug },
    select: { id: true, title: true },
  });

  if (track) {
    summary.trackAction = "reused";
    summary.trackId = track.id;
  } else if (EXECUTE) {
    track = await prisma.track.create({
      data: {
        title: TRACK.title,
        slug: TRACK.slug,
        description: TRACK.description,
        order: TRACK.order,
        published: TRACK.published,
      },
      select: { id: true, title: true },
    });
    summary.trackAction = "created";
    summary.trackId = track.id;
  } else {
    summary.trackAction = "created";
    summary.trackId = "(new)";
  }

  const trackId = track?.id ?? null;

  for (const course of COURSES) {
    const mainMentor = mentorIdByName.get(course.mainMentor);
    if (!mainMentor) {
      summary.validationErrors.push(
        `Course "${course.title}": main mentor "${course.mainMentor}" not resolved.`
      );
      continue;
    }

    if (trackId && trackId !== "(new)") {
      const duplicate = await prisma.course.findFirst({
        where: {
          trackId,
          title: { equals: course.title, mode: "insensitive" },
        },
        select: { id: true, title: true },
      });
      if (duplicate) {
        summary.coursesSkipped.push({
          title: course.title,
          reason: `Already exists in track (id ${duplicate.id}).`,
        });
        continue;
      }
    } else if (!EXECUTE) {
      // dry-run without existing track — still report as would-create
    }

    if (!EXECUTE) {
      summary.coursesCreated.push(course.title);
      continue;
    }

    if (!trackId || trackId === "(new)") {
      summary.validationErrors.push(`Course "${course.title}": track not available for insert.`);
      continue;
    }

    await prisma.course.create({
      data: {
        trackId,
        mentorId: mainMentor.id === "(new)" ? undefined : mainMentor.id,
        title: course.title,
        summary: buildCourseSummary(course),
        instructorName: mainMentor.name,
        instructorImage: mainMentor.photo,
        order: course.order,
        published: course.published,
      },
    });
    summary.coursesCreated.push(course.title);
  }

  return summary;
}

function printSummary(summary: Summary) {
  const line = "─".repeat(60);
  console.log(line);
  console.log(`Design Fundamentals import — ${summary.mode.toUpperCase()}`);
  console.log(line);

  if (summary.validationErrors.length > 0) {
    console.log("\nValidation errors:");
    for (const err of summary.validationErrors) {
      console.log(`  ✗ ${err}`);
    }
  }

  console.log("\nMentors created:", summary.mentorsCreated.length);
  for (const name of summary.mentorsCreated) console.log(`  + ${name}`);

  console.log("\nMentors reused:", summary.mentorsReused.length);
  for (const name of summary.mentorsReused) console.log(`  = ${name}`);

  console.log(`\nTrack: ${summary.trackAction} (slug: ${TRACK.slug})`);
  if (summary.trackId) console.log(`  id: ${summary.trackId}`);

  console.log("\nCourses created:", summary.coursesCreated.length);
  for (const title of summary.coursesCreated) console.log(`  + ${title}`);

  console.log("\nCourses skipped:", summary.coursesSkipped.length);
  for (const row of summary.coursesSkipped) {
    console.log(`  - ${row.title}: ${row.reason}`);
  }

  console.log(line);
  if (!EXECUTE) {
    console.log("Dry run only. Re-run with --execute to apply changes.");
  } else {
    console.log("Import applied.");
  }
  console.log(line);
}

async function main() {
  const summary = await runImport();
  printSummary(summary);
  if (summary.validationErrors.length > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
