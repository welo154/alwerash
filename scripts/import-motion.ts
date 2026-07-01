/**
 * Import Motion track: mentors → track → courses.
 * Does NOT create modules, lessons, videos, or article content.
 *
 * Dry run (default):
 *   npm run scripts:import-motion
 *
 * Apply changes:
 *   npm run scripts:import-motion -- --execute
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EXECUTE = process.argv.includes("--execute");

const TRACK = {
  title: "Motion",
  slug: "motion",
  description:
    "A track focused on motion design, including kinetic typography, logo animation, motion in branding, motion posters, motion graphics, and stop motion.",
  order: 3,
  published: true,
} as const;

const MENTOR_NAMES = [
  "Ibrahim Hamdy",
  "Baketa",
  "Yousef Adam",
  "Setto",
  "Dina Amin",
] as const;

type CourseSeed = {
  title: string;
  level: string | null;
  mainMentor: string | null;
  instructorNameFallback?: string | null;
  secondaryMentor?: string;
  reference?: string;
  internalNote?: string;
  summary: string;
  order: number;
  published: boolean;
};

const COURSES: CourseSeed[] = [
  {
    title: "Kinetic Typography",
    level: "Advanced",
    mainMentor: "Ibrahim Hamdy",
    reference:
      "https://www.instagram.com/reel/C7MLmnAtzQP/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    summary: "An advanced course focused on kinetic typography and expressive animated type.",
    order: 1,
    published: true,
  },
  {
    title: "Logo Animation",
    level: "Beginner",
    mainMentor: "Baketa",
    internalNote: "If suitable",
    summary:
      "A beginner course introducing logo animation fundamentals. Mentor suitability needs confirmation.",
    order: 2,
    published: true,
  },
  {
    title: "Motion in Branding",
    level: "Advanced",
    mainMentor: "Baketa",
    secondaryMentor: "Yousef Adam",
    reference:
      "https://www.instagram.com/p/DSQS2i9iKM-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    summary:
      "An advanced course exploring how motion can strengthen branding systems and visual identity. Mentor suitability needs confirmation.",
    order: 3,
    published: true,
  },
  {
    title: "Motion in Posters",
    level: "Intermediate",
    mainMentor: "Baketa",
    secondaryMentor: "Setto",
    summary:
      "An intermediate course about bringing posters and static layouts to life through motion. Mentor suitability needs confirmation.",
    order: 4,
    published: true,
  },
  {
    title: "Motion Graphics",
    level: "Beginner",
    mainMentor: null,
    instructorNameFallback: null,
    summary: "A beginner course introducing the fundamentals of motion graphics.",
    order: 5,
    published: true,
  },
  {
    title: "Stop Motion",
    level: null,
    mainMentor: "Dina Amin",
    summary:
      "A course introducing stop motion techniques and visual storytelling through frame-by-frame animation.",
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
  coursesMissingRealMentors: string[];
  validationErrors: string[];
};

function buildCourseSummary(course: CourseSeed): string {
  const parts: string[] = [];
  if (course.level?.trim()) {
    parts.push(`Level: ${course.level.trim()}.`);
  }
  parts.push(course.summary.trim());
  if (course.secondaryMentor?.trim()) {
    parts.push(`Secondary mentor: ${course.secondaryMentor.trim()}.`);
  }
  if (course.reference?.trim()) {
    parts.push(`Reference: ${course.reference.trim()}.`);
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
  console.log(`Motion import — ${summary.mode.toUpperCase()}`);
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
