"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LearnPopularFigmaTile } from "@/components/learn/LearnPopularFigmaTile";
import type {
  LearnAllCourseItem,
  LearnCourseTrackOption,
  LearnCourseTypeFilter,
} from "@/components/learn/learn-all-courses-types";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const DEEP_DIVE_MIN_LESSONS = 5;
const DEEP_DIVE_MIN_MINUTES = 90;

const TYPE_OPTIONS: { id: LearnCourseTypeFilter; label: string }[] = [
  { id: "all", label: "All courses" },
  { id: "topRated", label: "Top rated" },
  { id: "deepDive", label: "Deep dive" },
];

function FilterChevron() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden className="shrink-0">
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LearnFilterDropdown({
  label,
  open,
  onToggle,
  children,
  align = "right",
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="inline-flex h-8 min-w-[106px] shrink-0 items-center justify-between gap-2 rounded-[8px] border border-black bg-white px-4 text-black transition-colors hover:bg-slate-50"
        style={{
          fontFamily: pangeaFont,
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "19.6px",
        }}
      >
        <span className="truncate">{label}</span>
        <FilterChevron />
      </button>
      {open ? (
        <div
          className={`absolute top-[calc(100%+8px)] z-20 max-h-[280px] min-w-[180px] overflow-y-auto rounded-[8px] border border-black bg-white py-1 shadow-md ${
            align === "right" ? "right-0" : "left-0"
          }`}
          style={{ fontFamily: pangeaFont }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

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

function filterByType(courses: LearnAllCourseItem[], type: LearnCourseTypeFilter): LearnAllCourseItem[] {
  if (type === "all") return courses;

  if (type === "topRated") {
    return [...courses]
      .filter((course) => course.rating != null)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  return courses.filter(
    (course) =>
      course.lessonCount >= DEEP_DIVE_MIN_LESSONS ||
      (course.totalDurationMinutes ?? 0) >= DEEP_DIVE_MIN_MINUTES
  );
}

export default function LearnAllCoursesSection({
  courses,
  tracks,
}: {
  courses: LearnAllCourseItem[];
  tracks: LearnCourseTrackOption[];
}) {
  const [openMenu, setOpenMenu] = useState<"track" | "type" | null>(null);
  const [trackSlug, setTrackSlug] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<LearnCourseTypeFilter>("all");
  const menuRef = useRef<HTMLDivElement | null>(null);

  const trackLabel =
    trackSlug === "all"
      ? "All tracks"
      : tracks.find((track) => track.slug === trackSlug)?.title ?? "Track";

  const typeLabel = TYPE_OPTIONS.find((option) => option.id === typeFilter)?.label ?? "All courses";

  const visibleCourses = useMemo(() => {
    let items = courses;
    if (trackSlug !== "all") {
      items = items.filter((course) => course.trackSlug === trackSlug);
    }
    return filterByType(items, typeFilter);
  }, [courses, trackSlug, typeFilter]);

  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openMenu]);

  if (courses.length === 0) return null;

  return (
    <section aria-label="All courses" className="min-w-0 w-full max-w-full">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <LearnAllCoursesHeading />

        <div ref={menuRef} className="flex shrink-0 flex-wrap items-center gap-3">
          <LearnFilterDropdown
            label={trackLabel}
            open={openMenu === "track"}
            onToggle={() => setOpenMenu((prev) => (prev === "track" ? null : "track"))}
            align="right"
          >
            <button
              type="button"
              className={`block w-full px-4 py-2 text-left text-[16px] hover:bg-slate-50 ${
                trackSlug === "all" ? "font-medium" : "font-normal"
              }`}
              onClick={() => {
                setTrackSlug("all");
                setOpenMenu(null);
              }}
            >
              All tracks
            </button>
            {tracks.map((track) => (
              <button
                key={track.slug}
                type="button"
                className={`block w-full px-4 py-2 text-left text-[16px] hover:bg-slate-50 ${
                  trackSlug === track.slug ? "font-medium" : "font-normal"
                }`}
                onClick={() => {
                  setTrackSlug(track.slug);
                  setOpenMenu(null);
                }}
              >
                {track.title}
              </button>
            ))}
          </LearnFilterDropdown>

          <LearnFilterDropdown
            label={typeLabel}
            open={openMenu === "type"}
            onToggle={() => setOpenMenu((prev) => (prev === "type" ? null : "type"))}
            align="right"
          >
            {TYPE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`block w-full px-4 py-2 text-left text-[16px] hover:bg-slate-50 ${
                  typeFilter === option.id ? "font-medium" : "font-normal"
                }`}
                onClick={() => {
                  setTypeFilter(option.id);
                  setOpenMenu(null);
                }}
              >
                {option.label}
              </button>
            ))}
          </LearnFilterDropdown>
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
          <div className="flex flex-wrap gap-x-[18px] gap-y-[30px]" data-gsap-stagger-group>
            {visibleCourses.map((course) => (
              <LearnPopularFigmaTile key={course.id} {...course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
