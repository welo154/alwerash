"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
/** 4 columns × 2 rows per page. */
const COLUMNS = 4;
const ROWS_PER_PAGE = 2;
const PAGE_SIZE = COLUMNS * ROWS_PER_PAGE;

const TYPE_OPTIONS: { id: LearnCourseTypeFilter; label: string }[] = [
  { id: "all", label: "All courses" },
  { id: "topRated", label: "Top rated" },
  { id: "deepDive", label: "Deep dive" },
];

type FilterOption = { value: string; label: string };
type OpenFilter = "track" | "type" | null;

function FilterChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden
      className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
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

function AllCoursesFilterDropdown({
  id,
  label,
  value,
  options,
  open,
  onToggle,
  onSelect,
  menuAlign = "right",
}: {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  menuAlign?: "left" | "right";
}) {
  const selectedLabel = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={onToggle}
        className="inline-flex h-9 min-w-[148px] max-w-[220px] items-center justify-between gap-3 rounded-[8px] border border-black bg-white px-4 text-black transition-colors hover:bg-black hover:text-white"
        style={{
          fontFamily: pangeaFont,
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "19.6px",
        }}
      >
        <span className="truncate">{selectedLabel}</span>
        <FilterChevron open={open} />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-labelledby={id}
          className={`absolute top-[calc(100%+8px)] z-40 max-h-[280px] min-w-full overflow-y-auto rounded-[12px] border border-black bg-white py-2 shadow-[4px_4px_10px_0_rgba(0,0,0,0.25)] ${
            menuAlign === "right" ? "right-0" : "left-0"
          }`}
          style={{ fontFamily: pangeaFont }}
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`flex w-full items-center px-4 py-2.5 text-left text-[16px] transition-colors ${
                    selected
                      ? "bg-black font-bold text-white"
                      : "font-normal text-black hover:bg-[#8AF396]"
                  }`}
                  onClick={() => onSelect(option.value)}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
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

function buildPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("ellipsis");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
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
  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);
  const filtersRef = useRef<HTMLDivElement | null>(null);

  const trackOptions = useMemo(
    () => buildTrackOptions(courses, tracks),
    [courses, tracks]
  );

  const trackFilterOptions = useMemo<FilterOption[]>(
    () => [
      { value: "all", label: "All tracks" },
      ...trackOptions.map((track) => ({ value: track.slug, label: track.title })),
    ],
    [trackOptions]
  );

  const typeFilterOptions = useMemo<FilterOption[]>(
    () => TYPE_OPTIONS.map((option) => ({ value: option.id, label: option.label })),
    []
  );

  const filteredCourses = useMemo(() => {
    let items = courses;
    if (trackSlug !== "all") {
      const selected = normalizeSlug(trackSlug);
      items = items.filter((course) => normalizeSlug(course.trackSlug) === selected);
    }
    return filterByType(items, typeFilter);
  }, [courses, trackSlug, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [trackSlug, typeFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (!openFilter) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!filtersRef.current?.contains(e.target as Node)) setOpenFilter(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenFilter(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openFilter]);

  const pageCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageItems = buildPageItems(page, totalPages);
  const showPagination = filteredCourses.length > PAGE_SIZE;

  if (courses.length === 0) return null;

  return (
    <section aria-label="All courses" className="relative z-30 min-w-0 w-full max-w-full">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <LearnAllCoursesHeading />

        <div ref={filtersRef} className="relative z-40 flex shrink-0 flex-wrap items-center gap-3">
          <AllCoursesFilterDropdown
            id="learn-all-courses-track-filter"
            label="Filter by track"
            value={trackSlug}
            options={trackFilterOptions}
            open={openFilter === "track"}
            onToggle={() => setOpenFilter((prev) => (prev === "track" ? null : "track"))}
            onSelect={(value) => {
              setTrackSlug(value);
              setOpenFilter(null);
            }}
            menuAlign="left"
          />

          <AllCoursesFilterDropdown
            id="learn-all-courses-type-filter"
            label="Filter by course type"
            value={typeFilter}
            options={typeFilterOptions}
            open={openFilter === "type"}
            onToggle={() => setOpenFilter((prev) => (prev === "type" ? null : "type"))}
            onSelect={(value) => {
              setTypeFilter(value as LearnCourseTypeFilter);
              setOpenFilter(null);
            }}
            menuAlign="right"
          />
        </div>
      </div>

      <div className="mt-8 min-w-0">
        {filteredCourses.length === 0 ? (
          <p
            className="text-center text-[20px] text-black/60"
            style={{ fontFamily: pangeaFont }}
          >
            No courses match these filters.
          </p>
        ) : (
          <>
            <div
              key={`${trackSlug}-${typeFilter}-${page}`}
              className="grid grid-cols-2 gap-x-[18px] gap-y-[30px] md:grid-cols-3 lg:grid-cols-4"
              data-gsap-stagger-group
            >
              {pageCourses.map((course) => (
                <LearnPopularFigmaTile key={course.id} {...course} size="grid" />
              ))}
            </div>

            {showPagination ? (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
                aria-label="All courses pages"
              >
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black bg-white text-black transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-35"
                  style={{ fontFamily: pangeaFont }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M15 6L9 12L15 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {pageItems.map((item, index) =>
                  item === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="inline-flex h-11 min-w-8 items-center justify-center text-[18px] text-black/50"
                      aria-hidden
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      aria-label={`Page ${item}`}
                      aria-current={item === page ? "page" : undefined}
                      onClick={() => setPage(item)}
                      className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-black px-3 text-[18px] font-bold transition-colors ${
                        item === page
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-black hover:text-white"
                      }`}
                      style={{ fontFamily: pangeaFont }}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black bg-white text-black transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-35"
                  style={{ fontFamily: pangeaFont }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </nav>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
