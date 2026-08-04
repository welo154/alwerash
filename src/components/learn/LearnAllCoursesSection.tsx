"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import {
  learnCarouselMousewheel,
  learnCarouselSwiperBehavior,
} from "@/components/learn/learn-carousel-swiper-config";
import { useBleedRightToViewport } from "@/components/learn/useBleedRightToViewport";
import { useLearnCarouselSwiper } from "@/components/learn/useLearnCarouselSwiper";
import {
  LearnPopularFigmaTile,
  LEARN_POPULAR_FIGMA_TILE_H,
  LEARN_POPULAR_FIGMA_TILE_W,
} from "@/components/learn/LearnPopularFigmaTile";
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

function LearnAllCoursesHeading({
  onNext,
  atEnd,
}: {
  onNext: () => void;
  atEnd: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
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
      <button
        type="button"
        className="-ml-[15px] inline-flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Next courses"
        disabled={atEnd}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNext();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={60}
          height={60}
          viewBox="0 0 62 62"
          fill="none"
          className="h-[60px] w-[60px]"
          aria-hidden
        >
          <path
            d="M31 61C47.5685 61 61 47.5685 61 31C61 14.4315 47.5685 1 31 1C14.4315 1 1 14.4315 1 31C1 47.5685 14.4315 61 31 61Z"
            fill="var(--White, #FFF)"
          />
          <path d="M31 43L43 31L31 19" fill="var(--White, #FFF)" />
          <path
            d="M31 43L43 31M43 31L31 19M43 31L19 31M61 31C61 47.5685 47.5685 61 31 61C14.4315 61 1 47.5685 1 31C1 14.4315 14.4315 1 31 1C47.5685 1 61 14.4315 61 31Z"
            stroke="var(--Black, #000)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
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
  /**
   * `true` — full viewport breakout (centered).
   * `false` — stay inside the parent column.
   * `"right"` — keep the left edge, bleed to the viewport’s right edge (no white gutter).
   */
  fullBleed = "right",
}: {
  courses: LearnAllCourseItem[];
  tracks: LearnCourseTrackOption[];
  fullBleed?: boolean | "right";
}) {
  const [trackSlug, setTrackSlug] = useState("all");
  const [typeFilter, setTypeFilter] = useState<LearnCourseTypeFilter>("all");
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const bleedWrapRef = useRef<HTMLDivElement | null>(null);
  const bleedRight = fullBleed === "right";
  const bleedWidth = useBleedRightToViewport(bleedWrapRef, bleedRight);

  const {
    scrollAreaRef,
    atBeginning,
    atEnd,
    handleSwiper,
    handleNavSync,
    slideNext,
    slidePrev,
  } = useLearnCarouselSwiper();

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

  if (courses.length === 0) return null;

  const trackWrapClass =
    fullBleed === true
      ? "relative left-1/2 mt-8 w-screen max-w-[100vw] -translate-x-1/2"
      : bleedRight
        ? "relative mt-8 max-w-none overflow-x-visible"
        : "relative mt-8 w-full min-w-0 max-w-full overflow-x-clip";

  return (
    <section aria-label="All courses" className="relative z-30 min-w-0 w-full max-w-full">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <LearnAllCoursesHeading onNext={slideNext} atEnd={atEnd} />

        <div ref={filtersRef} className="relative z-40 flex shrink-0 flex-wrap items-center gap-3 pr-6 sm:pr-8 lg:pr-10">
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

      {filteredCourses.length === 0 ? (
        <p
          className="mt-8 text-center text-[20px] text-black/60"
          style={{ fontFamily: pangeaFont }}
        >
          No courses match these filters.
        </p>
      ) : (
        <div
          ref={bleedWrapRef}
          className={trackWrapClass}
          style={bleedRight ? { width: bleedWidth ?? "100%" } : undefined}
        >
          <div
            key={`${trackSlug}-${typeFilter}`}
            ref={scrollAreaRef}
            className="relative w-full min-w-0 shrink-0 overflow-x-visible overflow-y-visible"
            style={{
              minHeight: LEARN_POPULAR_FIGMA_TILE_H,
              clipPath:
                fullBleed === false
                  ? "inset(-200px 0 -200px 0)"
                  : "inset(-200px -100vw -200px 0)",
            }}
          >
            <Swiper
              dir="ltr"
              modules={[Mousewheel]}
              {...learnCarouselSwiperBehavior}
              mousewheel={learnCarouselMousewheel}
              className="learn-popular-swiper learn-popular-swiper--cards ml-0! mr-0! w-full min-w-0 max-w-full"
              onSwiper={handleSwiper}
              onSlideChange={handleNavSync}
              onSlidesUpdated={handleNavSync}
              onResize={handleNavSync}
            >
              {filteredCourses.map((course) => (
                <SwiperSlide
                  key={course.id}
                  className="h-auto! shrink-0 overflow-visible!"
                  style={{ width: LEARN_POPULAR_FIGMA_TILE_W }}
                >
                  <LearnPopularFigmaTile {...course} />
                </SwiperSlide>
              ))}
            </Swiper>

            <LearnCarouselEdgeNav
              atBeginning={atBeginning}
              atEnd={atEnd}
              onPrev={slidePrev}
              onNext={slideNext}
              prevLabel="Previous courses"
              nextLabel="Next courses"
            />
          </div>
        </div>
      )}
    </section>
  );
}
