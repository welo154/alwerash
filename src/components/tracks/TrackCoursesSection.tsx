"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LearnPopularFigmaTile } from "@/components/learn/LearnPopularFigmaTile";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

export type TrackCourseItem = LearnPopularTile & {
  rating: number | null;
  popularOrder: number | null;
};

type RatingsSort = "default" | "high" | "low";
type PopularSort = "default" | "popular";
type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";
type MobileCourseSort = "popular" | "watched" | "rated";

type FilterId = "ratings" | "level" | "popular";

const MOBILE_SORT_OPTIONS: { value: MobileCourseSort; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "watched", label: "Most watched" },
  { value: "rated", label: "Top rated" },
];

const FILTER_LABELS: Record<FilterId, string> = {
  ratings: "Ratings",
  level: "Level",
  popular: "Popular",
};

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

function TrackFilterButton({
  label,
  open,
  onClick,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onClick}
      className="inline-flex h-8 w-[106px] shrink-0 items-center justify-between rounded-[8px] border border-black bg-white px-4 text-black transition-colors hover:bg-slate-50"
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
  );
}

function sortByPopularOrder(courses: TrackCourseItem[]) {
  return [...courses].sort((a, b) => {
    const aOrder = a.popularOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.popularOrder ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });
}

function sortCourses(
  courses: TrackCourseItem[],
  ratingsSort: RatingsSort,
  popularSort: PopularSort,
  mobileSort: MobileCourseSort | null
): TrackCourseItem[] {
  if (mobileSort === "watched" || mobileSort === "popular") {
    return sortByPopularOrder(courses);
  }
  if (mobileSort === "rated") {
    return [...courses].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
  }

  const items = [...courses];

  if (popularSort === "popular") {
    return sortByPopularOrder(items);
  }

  if (ratingsSort === "high") {
    items.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
  } else if (ratingsSort === "low") {
    items.sort((a, b) => (a.rating ?? Number.MAX_SAFE_INTEGER) - (b.rating ?? Number.MAX_SAFE_INTEGER));
  }

  return items;
}

export function TrackCoursesSection({
  trackTitle,
  courses,
}: {
  trackTitle: string;
  courses: TrackCourseItem[];
}) {
  const [openFilter, setOpenFilter] = useState<FilterId | null>(null);
  const [ratingsSort, setRatingsSort] = useState<RatingsSort>("default");
  const [popularSort, setPopularSort] = useState<PopularSort>("default");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [mobileSort, setMobileSort] = useState<MobileCourseSort>("popular");
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileSortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1036px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const visibleCourses = useMemo(
    () => sortCourses(courses, ratingsSort, popularSort, isDesktop ? null : mobileSort),
    [courses, ratingsSort, popularSort, isDesktop, mobileSort]
  );
  const mobileSortLabel =
    MOBILE_SORT_OPTIONS.find((option) => option.value === mobileSort)?.label ?? "Popular";

  const toggleFilter = (id: FilterId) => {
    setOpenFilter((prev) => (prev === id ? null : id));
  };

  const closeMenu = () => setOpenFilter(null);

  useEffect(() => {
    if (!openFilter && !mobileSortOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (openFilter && !menuRef.current?.contains(target)) closeMenu();
      if (mobileSortOpen && !mobileSortRef.current?.contains(target)) {
        setMobileSortOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openFilter, mobileSortOpen]);

  return (
    <div className="min-w-0 max-lg:mt-[15px] lg:mt-0">
      <nav
        aria-label="Breadcrumb"
        className="mb-[12px] flex flex-wrap items-center gap-[12px] max-[743px]:-ml-6 max-[743px]:pl-[30px] min-[744px]:max-lg:-ml-8 min-[744px]:max-lg:pl-[63px] lg:mb-[16px]"
      >
        <Link
          href="/course"
          className="text-[14px] leading-[127%] text-black opacity-60 hover:opacity-80 min-[744px]:text-[18px]"
          style={{ fontFamily: pangeaFont }}
        >
          Courses
        </Link>
        <span className="text-[14px] text-black opacity-60 min-[744px]:text-[18px]" aria-hidden>
          /
        </span>
        <span
          className="text-[14px] leading-[127%] text-black opacity-60 min-[744px]:text-[18px]"
          style={{ fontFamily: pangeaFont }}
        >
          {trackTitle}
        </span>
      </nav>

      <div className="max-[743px]:-ml-6 max-[743px]:w-[calc(100%+1.5rem)] max-[743px]:pl-[30px] sm:max-[743px]:-ml-8 min-[744px]:max-lg:-ml-8 min-[744px]:max-lg:flex min-[744px]:max-lg:w-[calc(100%+2rem)] min-[744px]:max-lg:items-center min-[744px]:max-lg:justify-between min-[744px]:max-lg:pl-[63px] min-[744px]:max-lg:pr-[63px] lg:hidden">
        <h1
          className="m-0 min-w-0 text-[24px] font-normal leading-[120%] text-black min-[744px]:max-lg:text-[32px]"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontWeight: 400,
            lineHeight: "120%",
          }}
        >
          {trackTitle}
        </h1>

        <div ref={mobileSortRef} className="relative mt-[11px] min-[744px]:max-lg:mt-0">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={mobileSortOpen}
            onClick={() => setMobileSortOpen((open) => !open)}
            className="box-border inline-flex h-[22px] min-w-[91px] w-max items-center rounded-[8px] border-[0.3px] border-[color:var(--Black,#000)] bg-[color:var(--White,#FFF)] px-4 text-center text-[12px] font-normal leading-[19.6px] text-[color:var(--Black,#000)] min-[744px]:max-lg:h-[32px] min-[744px]:max-lg:w-[110px] min-[744px]:max-lg:min-w-[110px] min-[744px]:max-lg:justify-between min-[744px]:max-lg:text-[16px]"
            style={{
              fontFamily: pangeaFont,
              fontStyle: "normal",
            }}
          >
            <span className="whitespace-nowrap text-center">{mobileSortLabel}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={11}
              height={5}
              viewBox="0 0 12 6"
              fill="none"
              aria-hidden
              className={`ml-[10px] shrink-0 ${mobileSortOpen ? "rotate-180" : ""}`}
            >
              <path
                d="M0.5 0.5L6 5.5L11.5 0.5"
                stroke="var(--Black, #000)"
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {mobileSortOpen ? (
            <ul
              role="menu"
              className="absolute left-0 top-[calc(100%+8px)] z-20 min-w-[160px] overflow-hidden rounded-[8px] border border-black bg-white py-1 shadow-[4px_4px_10px_0_rgba(0,0,0,0.25)]"
            >
              {MOBILE_SORT_OPTIONS.map((option) => (
                <li key={option.value} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className={`block w-full px-4 py-2 text-left text-[12px] text-black hover:bg-[#8AF396] ${
                      mobileSort === option.value ? "font-medium" : "font-normal"
                    }`}
                    style={{ fontFamily: pangeaFont }}
                    onClick={() => {
                      setMobileSort(option.value);
                      setMobileSortOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="mt-6 hidden flex-wrap items-start justify-between gap-6 lg:mt-0 lg:flex">
        <h1
          className="m-0 min-w-0 flex-1 uppercase text-black lg:text-[48px]"
          style={{
            fontFamily: pangeaFont,
            fontWeight: 400,
            lineHeight: "120%",
          }}
        >
          {trackTitle}
        </h1>

        <div ref={menuRef} className="relative hidden shrink-0 flex-wrap items-center gap-3 lg:flex">
          {(Object.keys(FILTER_LABELS) as FilterId[]).map((id) => (
            <TrackFilterButton
              key={id}
              label={FILTER_LABELS[id]}
              open={openFilter === id}
              onClick={() => toggleFilter(id)}
            />
          ))}

          {openFilter === "ratings" ? (
            <div
              className="absolute top-[calc(100%+8px)] right-0 z-20 min-w-[160px] rounded-[8px] border border-black bg-white py-1 shadow-md"
              style={{ fontFamily: pangeaFont }}
            >
              {(
                [
                  ["default", "Default"],
                  ["high", "Highest rated"],
                  ["low", "Lowest rated"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`block w-full px-4 py-2 text-left text-[16px] hover:bg-slate-50 ${ratingsSort === value ? "font-medium" : "font-normal"}`}
                  onClick={() => {
                    setRatingsSort(value);
                    closeMenu();
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          {openFilter === "level" ? (
            <div
              className="absolute top-[calc(100%+8px)] right-[118px] z-20 min-w-[160px] rounded-[8px] border border-black bg-white py-1 shadow-md"
              style={{ fontFamily: pangeaFont }}
            >
              {(
                [
                  ["all", "All levels"],
                  ["beginner", "Beginner"],
                  ["intermediate", "Intermediate"],
                  ["advanced", "Advanced"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`block w-full px-4 py-2 text-left text-[16px] hover:bg-slate-50 ${levelFilter === value ? "font-medium" : "font-normal"}`}
                  onClick={() => {
                    setLevelFilter(value);
                    closeMenu();
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          {openFilter === "popular" ? (
            <div
              className="absolute top-[calc(100%+8px)] right-0 z-20 min-w-[160px] rounded-[8px] border border-black bg-white py-1 shadow-md"
              style={{ fontFamily: pangeaFont }}
            >
              {(
                [
                  ["default", "Default"],
                  ["popular", "Most popular"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`block w-full px-4 py-2 text-left text-[16px] hover:bg-slate-50 ${popularSort === value ? "font-medium" : "font-normal"}`}
                  onClick={() => {
                    setPopularSort(value);
                    closeMenu();
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-[35px] min-w-0 max-[743px]:-ml-6 max-[743px]:w-[calc(100%+1.5rem)] max-[743px]:overflow-hidden sm:max-[743px]:-ml-8 min-[744px]:max-lg:-ml-8 min-[744px]:max-lg:w-[calc(100%+2rem)] min-[744px]:max-lg:overflow-visible lg:mt-[50px] lg:ml-0 lg:w-auto">
        {visibleCourses.length === 0 ? (
          <p
            className="text-center text-[20px] text-black/60"
            style={{ fontFamily: pangeaFont }}
          >
            No courses in this track yet.
          </p>
        ) : (
          <div
            className="flex min-w-0 flex-col items-center gap-y-[50px] overflow-hidden min-[744px]:max-lg:mx-auto min-[744px]:max-lg:grid min-[744px]:max-lg:w-[646px] min-[744px]:max-lg:grid-cols-[repeat(2,313px)] min-[744px]:max-lg:justify-items-start min-[744px]:max-lg:gap-x-5 min-[744px]:max-lg:gap-y-[30px] min-[744px]:max-lg:overflow-visible lg:grid lg:items-stretch lg:justify-start lg:gap-x-5 lg:gap-y-5 lg:overflow-visible lg:[grid-template-columns:repeat(auto-fill,313px)]"
            data-gsap-stagger-group
          >
            {visibleCourses.map((tile) => (
              <div
                key={tile.id}
                className="w-[334px] max-w-[334px] shrink-0 overflow-hidden min-[744px]:max-lg:w-[313px] min-[744px]:max-lg:max-w-[313px] lg:w-[313px] lg:max-w-none"
              >
                <LearnPopularFigmaTile
                  {...tile}
                  size="grid"
                  className="h-full w-full max-w-full overflow-hidden"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
