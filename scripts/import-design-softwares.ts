/**
 * Import Design Softwares track: mentors → track → courses.
 * Does NOT create modules, lessons, videos, or article content.
 *
 * Dry run (default):
 *   npm run scripts:import-design-softwares
 *
 * Apply changes:
 *   npm run scripts:import-design-softwares -- --execute
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EXECUTE = process.argv.includes("--execute");

const TRACK = {
  title: "Design Softwares",
  slug: "design-softwares",
  description:
    "A beginner-friendly track introducing essential design software, file formats, digital and print workflows, and core tools including Photoshop, Illustrator, InDesign, After Effects, Figma, Procreate, TouchDesigner, and Affinity.",
  order: 2,
  published: true,
} as const;

/** Real mentor records only — never create GUC Instructor placeholders. */
const MENTOR_NAMES = [
  "Yamen El Gamal",
  "Rana Wasef",
  "Kholoud Helaly",
  "Rahma Medhat",
  "Samir Nashaat",
] as const;

type CourseSeed = {
  title: string;
  level: string;
  mainMentor: string | null;
  instructorNameFallback?: string | null;
  secondaryMentor?: string;
  internalNote?: string;
  summary: string;
  order: number;
  published: boolean;
};

const COURSES: CourseSeed[] = [
  {
    title: "Introduction to Softwares, File Formats, Printing vs Digital",
    level: "Beginner",
    mainMentor: "Yamen El Gamal",
    summary:
      "A beginner introduction to design software, file formats, and the difference between print and digital workflows.",
    order: 1,
    published: true,
  },
  {
    title: "Photoshop Fundamentals",
    level: "Beginner",
    mainMentor: "Yamen El Gamal",
    summary:
      "Learn how to maneuver through the software, understand the basic tools and their names, and produce basic design outcomes.",
    order: 2,
    published: true,
  },
  {
    title: "Illustrator Fundamentals",
    level: "Beginner",
    mainMentor: null,
    instructorNameFallback: "GUC Instructor",
    summary: "A beginner introduction to Adobe Illustrator fundamentals.",
    order: 3,
    published: true,
  },
  {
    title: "InDesign Fundamentals",
    level: "Beginner",
    mainMentor: "Rana Wasef",
    summary: "A beginner introduction to Adobe InDesign fundamentals.",
    order: 4,
    published: true,
  },
  {
    title: "After Effects Fundamentals",
    level: "Beginner",
    mainMentor: null,
    instructorNameFallback: "GUC Instructor",
    internalNote: "Ask Salma Abdin",
    summary:
      "A beginner introduction to Adobe After Effects fundamentals. Mentor needs confirmation from Salma Abdin.",
    order: 5,
    published: true,
  },
  {
    title: "Figma Fundamentals",
    level: "Beginner",
    mainMentor: "Kholoud Helaly",
    summary: "A beginner introduction to Figma fundamentals.",
    order: 6,
    published: true,
  },
  {
    title: "Procreate & Digital Drawing",
    level: "Beginner",
    mainMentor: "Rahma Medhat",
    secondaryMentor: "Yamen El Gamal",
    summary: "A beginner introduction to Procreate and digital drawing workflows.",
    order: 7,
    published: true,
  },
  {
    title: "TouchDesigner",
    level: "Beginner",
    mainMentor: "Samir Nashaat",
    internalNote: "If suitable",
    summary: "A beginner introduction to TouchDesigner. Mentor suitability needs confirmation.",
    order: 8,
    published: true,
  },
  {
    title: "Affinity",
    level: "Beginner",
    mainMentor: null,
    instructorNameFallback: null,
    summary: "A beginner introduction to Affinity software.",
    order: 9,
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
  coursesMissingRealMentors: string[];
  validationErrors: string[];
};

function buildCourseSummary(course: CourseSeed): string {
  const parts: string[] = [`Level: ${course.level}.`, course.summary.trim()];
  if (course.secondaryMentor?.trim()) {
    parts.push(`Secondary mentor: ${course.secondaryMentor.trim()}.`);
  }
  if (course.internalNote?.trim()) {
    parts.push(`Note: ${course.internalNote.trim()}.`);
  }
  return parts.join(" ");
}

function resolveInstructor(
  course: CourseSeed,
  mentor: { id: string; name: string; photo: string | null } | undefined
): { mentorId: string | null; instructorName: string | null; instructorImage: string | null } {
  if (mentor && mentor.id !== "(new)") {
    return {
      mentorId: mentor.id,
      instructorName: mentor.name,
      instructorImage: mentor.photo,
    };
  }
  const fallback = course.instructorNameFallback?.trim() || null;
  return {
    mentorId: null,
    instructorName: fallback,
    instructorImage: null,
  };
}

function validateCourses(): string[] {
  const errors: string[] = [];
  const mentorSet = new Set<string>(MENTOR_NAMES);

  for (const course of COURSES) {
    if (course.mainMentor && !mentorSet.has(course.mainMentor)) {
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
    coursesMissingRealMentors: [],
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
    const mainMentor = course.mainMentor
      ? mentorIdByName.get(course.mainMentor)
      : undefined;

    if (course.mainMentor && !mainMentor) {
      summary.validationErrors.push(
        `Course "${course.title}": main mentor "${course.mainMentor}" not resolved.`
      );
      continue;
    }

    if (!course.mainMentor) {
      summary.coursesMissingRealMentors.push(course.title);
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
    }

    if (!EXECUTE) {
      summary.coursesCreated.push(course.title);
      continue;
    }

    if (!trackId || trackId === "(new)") {
      summary.validationErrors.push(`Course "${course.title}": track not available for insert.`);
      continue;
    }

    const instructor = resolveInstructor(course, mainMentor);

    await prisma.course.create({
      data: {
        trackId,
        mentorId: instructor.mentorId,
        title: course.title,
        summary: buildCourseSummary(course),
        instructorName: instructor.instructorName,
        instructorImage: instructor.instructorImage,
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
  console.log(`Design Softwares import — ${summary.mode.toUpperCase()}`);
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

  console.log("\nCourses missing real mentors:", summary.coursesMissingRealMentors.length);
  for (const title of summary.coursesMissingRealMentors) {
    console.log(`  ? ${title}`);
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
