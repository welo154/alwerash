"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LearnPopularFigmaTile } from "@/components/learn/LearnPopularFigmaTile";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

export type TrackCourseItem = LearnPopularTile & {
  rating: number | null;
  popularOrder: number | null;
};

type RatingsSort = "default" | "high" | "low";
type PopularSort = "default" | "popular";
type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";

type FilterId = "ratings" | "level" | "popular";

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

function sortCourses(
  courses: TrackCourseItem[],
  ratingsSort: RatingsSort,
  popularSort: PopularSort
): TrackCourseItem[] {
  const items = [...courses];

  if (popularSort === "popular") {
    items.sort((a, b) => {
      const aOrder = a.popularOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.popularOrder ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return 0;
    });
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
  const menuRef = useRef<HTMLDivElement | null>(null);

  const visibleCourses = useMemo(
    () => sortCourses(courses, ratingsSort, popularSort),
    [courses, ratingsSort, popularSort]
  );

  const toggleFilter = (id: FilterId) => {
    setOpenFilter((prev) => (prev === id ? null : id));
  };

  const closeMenu = () => setOpenFilter(null);

  useEffect(() => {
    if (!openFilter) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openFilter]);

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <h1
          className="m-0 min-w-0 flex-1 uppercase text-black"
          style={{
            fontFamily: pangeaFont,
            fontSize: "48px",
            fontWeight: 400,
            lineHeight: "120%",
          }}
        >
          {trackTitle}
        </h1>

        <div ref={menuRef} className="relative flex shrink-0 flex-wrap items-center gap-3">
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

      <div className="mt-[50px] min-w-0">
        {visibleCourses.length === 0 ? (
          <p
            className="text-center text-[20px] text-black/60"
            style={{ fontFamily: pangeaFont }}
          >
            No courses in this track yet.
          </p>
        ) : (
          <div
            className="grid min-w-0 justify-start"
            style={{
              gridTemplateColumns: "repeat(auto-fill, 313px)",
              columnGap: 20,
              rowGap: 20,
            }}
            data-gsap-stagger-group
          >
            {visibleCourses.map((tile) => (
              <LearnPopularFigmaTile
                key={tile.id}
                {...tile}
                size="grid"
                className="h-full w-[313px]"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
