/**
 * Reusable catalog import: mentors → tracks → courses.
 * Does NOT create modules, lessons, videos, or article content.
 */
import { PrismaClient } from "@prisma/client";

export type CatalogCourseSeed = {
  title: string;
  level: string | null;
  mainMentor: string | null;
  instructorNameFallback?: string | null;
  secondaryReference?: string;
  reference?: string;
  internalNote?: string;
  summary: string;
  order: number;
  published?: boolean;
};

export type CatalogTrackSeed = {
  title: string;
  slug: string;
  description: string;
  order: number;
  published?: boolean;
  courses: CatalogCourseSeed[];
};

export type CatalogImportSummary = {
  mode: "dry-run" | "execute";
  mentorsCreated: string[];
  mentorsReused: string[];
  tracksCreated: string[];
  tracksReused: string[];
  coursesCreated: string[];
  coursesSkipped: { title: string; trackSlug: string; reason: string }[];
  coursesMissingMentor: { title: string; trackSlug: string }[];
  placeholderInstructorIssues: { title: string; trackSlug: string; detail: string }[];
  validationErrors: string[];
};

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function buildCourseSummary(course: CatalogCourseSeed): string {
  const parts: string[] = [];
  if (course.level?.trim()) {
    parts.push(`Level: ${course.level.trim()}.`);
  }
  parts.push(course.summary.trim());
  if (course.secondaryReference?.trim()) {
    parts.push(`Secondary mentor: ${course.secondaryReference.trim()}.`);
  }
  if (course.reference?.trim()) {
    parts.push(`Reference: ${course.reference.trim()}.`);
  }
  if (course.internalNote?.trim()) {
    parts.push(`Note: ${course.internalNote.trim()}.`);
  }
  return parts.join(" ");
}

function isPlaceholderMentor(name: string): boolean {
  const normalized = name.toLowerCase();
  return (
    name.includes("/") ||
    normalized.includes("guc instructor") ||
    normalized.startsWith("ask ")
  );
}

function resolveInstructor(
  course: CatalogCourseSeed,
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

export function validateCatalog(tracks: CatalogTrackSeed[]): string[] {
  const errors: string[] = [];
  const trackSlugs = new Set<string>();

  for (const track of tracks) {
    if (!track.title?.trim()) {
      errors.push("Track is missing title.");
    }
    if (!track.slug?.trim()) {
      errors.push(`Track "${track.title}": slug is required.`);
    }
    if (track.slug && trackSlugs.has(track.slug)) {
      errors.push(`Duplicate track slug in import data: "${track.slug}".`);
    }
    if (track.slug) trackSlugs.add(track.slug);

    const courseTitles = new Set<string>();
    for (const course of track.courses) {
      if (!course.title?.trim()) {
        errors.push(`Track "${track.slug}": course is missing title.`);
      }
      if (courseTitles.has(course.title)) {
        errors.push(
          `Track "${track.slug}": duplicate course title "${course.title}".`
        );
      }
      courseTitles.add(course.title);
    }
  }

  return errors;
}

function collectMentorNames(tracks: CatalogTrackSeed[]): string[] {
  const names = new Set<string>();
  for (const track of tracks) {
    for (const course of track.courses) {
      if (course.mainMentor?.trim()) {
        names.add(normalizeName(course.mainMentor));
      }
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

async function findMentorByName(prisma: PrismaClient, name: string) {
  return prisma.mentor.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
    select: { id: true, name: true, photo: true },
  });
}

export async function runCatalogImport(
  prisma: PrismaClient,
  tracks: CatalogTrackSeed[],
  execute: boolean,
  label: string
): Promise<CatalogImportSummary> {
  const summary: CatalogImportSummary = {
    mode: execute ? "execute" : "dry-run",
    mentorsCreated: [],
    mentorsReused: [],
    tracksCreated: [],
    tracksReused: [],
    coursesCreated: [],
    coursesSkipped: [],
    coursesMissingMentor: [],
    placeholderInstructorIssues: [],
    validationErrors: validateCatalog(tracks),
  };

  if (summary.validationErrors.length > 0) {
    return summary;
  }

  const mentorNames = collectMentorNames(tracks);
  const mentorIdByName = new Map<
    string,
    { id: string; name: string; photo: string | null }
  >();

  for (const name of mentorNames) {
    const existing = await findMentorByName(prisma, name);
    if (existing) {
      mentorIdByName.set(name, existing);
      summary.mentorsReused.push(existing.name);
      continue;
    }
    if (execute) {
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

  const trackIdBySlug = new Map<string, string>();

  for (const trackSeed of tracks) {
    let track = await prisma.track.findUnique({
      where: { slug: trackSeed.slug },
      select: { id: true, title: true },
    });

    if (track) {
      summary.tracksReused.push(`${trackSeed.slug} (${track.title})`);
      trackIdBySlug.set(trackSeed.slug, track.id);
    } else if (execute) {
      track = await prisma.track.create({
        data: {
          title: trackSeed.title,
          slug: trackSeed.slug,
          description: trackSeed.description,
          order: trackSeed.order,
          published: trackSeed.published ?? true,
        },
        select: { id: true, title: true },
      });
      summary.tracksCreated.push(trackSeed.slug);
      trackIdBySlug.set(trackSeed.slug, track.id);
    } else {
      summary.tracksCreated.push(trackSeed.slug);
      trackIdBySlug.set(trackSeed.slug, "(new)");
    }

    const trackId = trackIdBySlug.get(trackSeed.slug)!;

    for (const course of trackSeed.courses) {
      const mentorKey = course.mainMentor?.trim()
        ? normalizeName(course.mainMentor)
        : null;
      const mainMentor = mentorKey ? mentorIdByName.get(mentorKey) : undefined;

      if (course.mainMentor?.trim() && !mainMentor) {
        summary.validationErrors.push(
          `Course "${course.title}" (${trackSeed.slug}): main mentor "${course.mainMentor}" not resolved.`
        );
        continue;
      }

      if (!course.mainMentor?.trim()) {
        summary.coursesMissingMentor.push({
          title: course.title,
          trackSlug: trackSeed.slug,
        });
      } else if (isPlaceholderMentor(course.mainMentor)) {
        summary.placeholderInstructorIssues.push({
          title: course.title,
          trackSlug: trackSeed.slug,
          detail: `Ambiguous mentor name: "${course.mainMentor}".`,
        });
      }

      if (course.instructorNameFallback?.trim()) {
        summary.placeholderInstructorIssues.push({
          title: course.title,
          trackSlug: trackSeed.slug,
          detail: `Instructor fallback: "${course.instructorNameFallback}".`,
        });
      }

      if (trackId && trackId !== "(new)") {
        const duplicate = await prisma.course.findFirst({
          where: {
            trackId,
            title: { equals: course.title, mode: "insensitive" },
          },
          select: { id: true },
        });
        if (duplicate) {
          summary.coursesSkipped.push({
            title: course.title,
            trackSlug: trackSeed.slug,
            reason: `Already exists in track (id ${duplicate.id}).`,
          });
          continue;
        }
      }

      if (!execute) {
        summary.coursesCreated.push(`${trackSeed.slug} → ${course.title}`);
        continue;
      }

      if (!trackId || trackId === "(new)") {
        summary.validationErrors.push(
          `Course "${course.title}" (${trackSeed.slug}): track not available for insert.`
        );
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
          published: course.published ?? true,
        },
      });
      summary.coursesCreated.push(`${trackSeed.slug} → ${course.title}`);
    }
  }

  return summary;
}

export function printCatalogSummary(
  summary: CatalogImportSummary,
  label: string,
  execute: boolean
) {
  const line = "─".repeat(60);
  console.log(line);
  console.log(`${label} — ${summary.mode.toUpperCase()}`);
  console.log(line);

  if (summary.validationErrors.length > 0) {
    console.log("\nValidation errors:", summary.validationErrors.length);
    for (const err of summary.validationErrors) {
      console.log(`  ✗ ${err}`);
    }
  }

  if (!execute) {
    console.log("\nMentors to create:", summary.mentorsCreated.length);
    for (const name of summary.mentorsCreated) console.log(`  + ${name}`);

    console.log("\nMentors to reuse:", summary.mentorsReused.length);
    for (const name of summary.mentorsReused) console.log(`  = ${name}`);

    console.log("\nTracks to create:", summary.tracksCreated.length);
    for (const slug of summary.tracksCreated) console.log(`  + ${slug}`);

    console.log("\nTracks to reuse:", summary.tracksReused.length);
    for (const row of summary.tracksReused) console.log(`  = ${row}`);

    console.log("\nCourses to create:", summary.coursesCreated.length);
    for (const row of summary.coursesCreated) console.log(`  + ${row}`);

    console.log("\nCourses to skip:", summary.coursesSkipped.length);
    for (const row of summary.coursesSkipped) {
      console.log(`  - ${row.trackSlug} → ${row.title}: ${row.reason}`);
    }
  } else {
    console.log("\nMentors created:", summary.mentorsCreated.length);
    console.log("Mentors reused:", summary.mentorsReused.length);
    console.log("Tracks created:", summary.tracksCreated.length);
    console.log("Tracks reused:", summary.tracksReused.length);
    console.log("Courses created:", summary.coursesCreated.length);
    console.log("Courses skipped:", summary.coursesSkipped.length);
    console.log("Validation errors:", summary.validationErrors.length);

    if (summary.tracksCreated.length > 0) {
      console.log("\nTracks created:");
      for (const slug of summary.tracksCreated) console.log(`  + ${slug}`);
    }
    if (summary.tracksReused.length > 0) {
      console.log("\nTracks reused:");
      for (const row of summary.tracksReused) console.log(`  = ${row}`);
    }
  }

  console.log("\nCourses missing mentor:", summary.coursesMissingMentor.length);
  for (const row of summary.coursesMissingMentor) {
    console.log(`  ? ${row.trackSlug} → ${row.title}`);
  }

  console.log("\nPlaceholder instructor issues:", summary.placeholderInstructorIssues.length);
  for (const row of summary.placeholderInstructorIssues) {
    console.log(`  ! ${row.trackSlug} → ${row.title}: ${row.detail}`);
  }

  console.log(line);
  if (!execute) {
    console.log("Dry run only. Re-run with --execute to apply changes.");
  } else {
    console.log("Import applied.");
  }
  console.log(line);
}
