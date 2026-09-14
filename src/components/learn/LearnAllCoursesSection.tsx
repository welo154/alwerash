"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import { LearnCarouselEdgeNav } from "@/components/learn/LearnCarouselEdgeNav";
import { LearnAllCoursesHeading } from "@/components/learn/LearnAllCoursesHeading";
import {
  learnCarouselMousewheel,
  learnCarouselSwiperBehavior,
} from "@/components/learn/learn-carousel-swiper-config";
import { useBleedRightToViewport } from "@/components/learn/useBleedRightToViewport";
import { useLearnCarouselSwiper } from "@/components/learn/useLearnCarouselSwiper";
import { useCourseCarouselMetrics } from "@/components/learn/useCourseCarouselMetrics";
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
  hideNavOnMobile = false,
}: {
  courses: LearnAllCourseItem[];
  tracks: LearnCourseTrackOption[];
  fullBleed?: boolean | "right";
  hideNavOnMobile?: boolean;
}) {
  const { width: slideW, gap: slideGap, inset: slidesOffsetBefore } = useCourseCarouselMetrics();
  const searchParams = useSearchParams();
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
    const typeParam = searchParams.get("type");
    if (typeParam === "all" || typeParam === "topRated" || typeParam === "deepDive") {
      setTypeFilter(typeParam);
    } else if (typeParam == null) {
      setTypeFilter("all");
    }

    const trackParam = searchParams.get("track");
    if (trackParam) setTrackSlug(trackParam);
    else setTrackSlug("all");
  }, [searchParams]);

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
        ? "relative max-[743px]:-ml-6 max-[743px]:mt-[35px] max-lg:w-screen max-lg:max-w-[100vw] max-lg:overflow-x-visible sm:max-[743px]:-ml-8 min-[744px]:max-lg:-ml-8 min-[744px]:max-lg:mt-[40px] lg:mt-8 lg:max-w-none lg:overflow-x-clip lg:overflow-y-visible"
        : "relative mt-8 w-full min-w-0 max-w-full overflow-x-clip";

  const bleedWrapStyle =
    bleedRight && bleedWidth != null ? { width: bleedWidth } : undefined;

  return (
    <section
      id="all-courses"
      aria-label="All courses"
      className="relative z-0 min-w-0 w-full max-w-full scroll-mt-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <LearnAllCoursesHeading onNext={slideNext} atEnd={atEnd} />

        <div
          ref={filtersRef}
          className="relative z-40 hidden shrink-0 flex-wrap items-center gap-3 pr-6 sm:pr-8 lg:flex lg:pr-10"
        >
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
          style={bleedWrapStyle}
        >
          <div
            key={`${trackSlug}-${typeFilter}`}
            ref={scrollAreaRef}
            className="relative w-full min-w-0 shrink-0 overflow-x-clip overflow-y-visible max-lg:overflow-x-visible"
            style={{
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
              spaceBetween={slideGap}
              slidesOffsetBefore={slidesOffsetBefore}
              mousewheel={learnCarouselMousewheel}
              className="learn-popular-swiper learn-popular-swiper--cards ml-0! mr-0! w-full min-w-0 max-w-full max-lg:max-w-none"
              onSwiper={handleSwiper}
              onSlideChange={handleNavSync}
              onSlidesUpdated={handleNavSync}
              onResize={handleNavSync}
            >
              {filteredCourses.map((course) => (
                <SwiperSlide
                  key={course.id}
                  className="h-auto! shrink-0 overflow-visible!"
                  style={{ width: slideW }}
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
              hideNavOnMobile={hideNavOnMobile}
            />
          </div>
        </div>
      )}
    </section>
  );
}
