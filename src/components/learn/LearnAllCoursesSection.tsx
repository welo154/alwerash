"use client";

import { useMemo, useState } from "react";
import { LearnPopularFigmaTile } from "@/components/learn/LearnPopularFigmaTile";
import type {
  LearnAllCourseItem,
  LearnCourseTrackOption,
  LearnCourseTypeFilter,
} from "@/components/learn/learn-all-courses-types";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const DEEP_DIVE_MIN_LESSONS = 3;
const DEEP_DIVE_MIN_MINUTES = 45;

const TYPE_OPTIONS: { id: LearnCourseTypeFilter; label: string }[] = [
  { id: "all", label: "All courses" },
  { id: "topRated", label: "Top rated" },
  { id: "deepDive", label: "Deep dive" },
];

const filterSelectClass =
  "h-8 min-w-[140px] max-w-[220px] cursor-pointer appearance-none rounded-[8px] border border-black bg-white bg-[length:10px_6px] bg-[right_12px_center] bg-no-repeat py-0 pl-4 pr-8 text-black";

const filterSelectStyle = {
  fontFamily: pangeaFont,
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "19.6px",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
} as const;

function LearnAllCoursesHeading() {
  return (
    <div className="inline-flex h-[72px] items-center rounded-[44px] bg-white pl-[22px] pr-[22px]">
      <h2
        className="m-0 uppercase leading-none"
        style={{ fontFamily: pangeaFont, lineHeight: "57.6px" }}
      >
        <span
          style={{
            color: "#000",
            fontSize: "48px",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          ALL
        </span>
        <span
          style={{
            color: "#000",
            fontSize: "48px",
            fontStyle: "normal",
            fontWeight: 400,
          }}
        >
          {" "}
          COURSES
        </span>
      </h2>
    </div>
  );
}

function normalizeSlug(slug: string | null | undefined): string {
  return slug?.trim().toLowerCase() ?? "";
}

function filterByType(courses: LearnAllCourseItem[], type: LearnCourseTypeFilter): LearnAllCourseItem[] {
  if (type === "all") return courses;

  if (type === "topRated") {
    return [...courses].sort((a, b) => {
      const aRating = a.rating ?? -1;
      const bRating = b.rating ?? -1;
      return bRating - aRating;
    });
  }

  return courses.filter(
    (course) =>
      course.lessonCount >= DEEP_DIVE_MIN_LESSONS ||
      (course.totalDurationMinutes ?? 0) >= DEEP_DIVE_MIN_MINUTES
  );
}

function buildTrackOptions(
  courses: LearnAllCourseItem[],
  tracks: LearnCourseTrackOption[]
): LearnCourseTrackOption[] {
  const bySlug = new Map<string, string>();
  for (const track of tracks) {
    const slug = normalizeSlug(track.slug);
    if (slug) bySlug.set(slug, track.title);
  }
  for (const course of courses) {
    const slug = normalizeSlug(course.trackSlug);
    if (slug && !bySlug.has(slug)) {
      const title = course.tagPrimary.trim() || slug;
      bySlug.set(slug, title.charAt(0) + title.slice(1).toLowerCase());
    }
  }
  return Array.from(bySlug.entries())
    .map(([slug, title]) => ({ slug, title }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export default function LearnAllCoursesSection({
  courses,
  tracks,
}: {
  courses: LearnAllCourseItem[];
  tracks: LearnCourseTrackOption[];
}) {
  const [trackSlug, setTrackSlug] = useState("all");
  const [typeFilter, setTypeFilter] = useState<LearnCourseTypeFilter>("all");

  const trackOptions = useMemo(
    () => buildTrackOptions(courses, tracks),
    [courses, tracks]
  );

  const visibleCourses = useMemo(() => {
    let items = courses;
    if (trackSlug !== "all") {
      const selected = normalizeSlug(trackSlug);
      items = items.filter((course) => normalizeSlug(course.trackSlug) === selected);
    }
    return filterByType(items, typeFilter);
  }, [courses, trackSlug, typeFilter]);

  if (courses.length === 0) return null;

  return (
    <section aria-label="All courses" className="relative z-30 min-w-0 w-full max-w-full">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <LearnAllCoursesHeading />

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="learn-all-courses-track-filter">
            Filter by track
          </label>
          <select
            id="learn-all-courses-track-filter"
            value={trackSlug}
            onChange={(e) => setTrackSlug(e.target.value)}
            className={filterSelectClass}
            style={filterSelectStyle}
          >
            <option value="all">All tracks</option>
            {trackOptions.map((track) => (
              <option key={track.slug} value={track.slug}>
                {track.title}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="learn-all-courses-type-filter">
            Filter by course type
          </label>
          <select
            id="learn-all-courses-type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as LearnCourseTypeFilter)}
            className={filterSelectClass}
            style={filterSelectStyle}
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 min-w-0">
        {visibleCourses.length === 0 ? (
          <p
            className="text-center text-[20px] text-black/60"
            style={{ fontFamily: pangeaFont }}
          >
            No courses match these filters.
          </p>
        ) : (
          <div
            key={`${trackSlug}-${typeFilter}`}
            className="flex flex-wrap gap-x-[18px] gap-y-[30px]"
            data-gsap-stagger-group
          >
            {visibleCourses.map((course) => (
              <LearnPopularFigmaTile key={course.id} {...course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
