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

type MobileCourseSort = "popular" | "watched" | "rated";

const MOBILE_SORT_OPTIONS: { value: MobileCourseSort; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "watched", label: "Most watched" },
  { value: "rated", label: "Top rated" },
];

function sortByPopularOrder(courses: TrackCourseItem[]) {
  return [...courses].sort((a, b) => {
    const aOrder = a.popularOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.popularOrder ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });
}

function sortCourses(
  courses: TrackCourseItem[],
  mobileSort: MobileCourseSort | null
): TrackCourseItem[] {
  if (mobileSort === "watched" || mobileSort === "popular") {
    return sortByPopularOrder(courses);
  }
  if (mobileSort === "rated") {
    return [...courses].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
  }
  return courses;
}

export function TrackCoursesSection({
  trackTitle,
  courses,
}: {
  trackTitle: string;
  courses: TrackCourseItem[];
}) {
  const [mobileSort, setMobileSort] = useState<MobileCourseSort>("popular");
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const mobileSortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1036px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const visibleCourses = useMemo(
    () => sortCourses(courses, isDesktop ? null : mobileSort),
    [courses, isDesktop, mobileSort]
  );
  const mobileSortLabel =
    MOBILE_SORT_OPTIONS.find((option) => option.value === mobileSort)?.label ?? "Popular";

  useEffect(() => {
    if (!mobileSortOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!mobileSortRef.current?.contains(e.target as Node)) {
        setMobileSortOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileSortOpen]);

  return (
    <div className="min-w-0 max-lg:mt-[15px] lg:mt-0">
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

      <h1
        className="m-0 mt-6 hidden min-w-0 uppercase text-black lg:mt-0 lg:block lg:text-[48px]"
        style={{
          fontFamily: pangeaFont,
          fontWeight: 400,
          lineHeight: "120%",
        }}
      >
        {trackTitle}
      </h1>

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
            className="flex min-w-0 flex-col items-center gap-y-[30px] min-[744px]:max-lg:mx-auto min-[744px]:max-lg:grid min-[744px]:max-lg:w-max min-[744px]:max-lg:grid-cols-[repeat(2,345px)] min-[744px]:max-lg:justify-items-start min-[744px]:max-lg:gap-x-[33px] lg:grid lg:items-start lg:justify-start lg:gap-x-[27px] lg:gap-y-[40px] lg:[grid-template-columns:repeat(auto-fill,346px)]"
            data-gsap-stagger-group
          >
            {visibleCourses.map((tile) => (
              <div
                key={tile.id}
                className="w-[315px] shrink-0 min-[744px]:w-[345px] lg:w-[346px]"
              >
                <LearnPopularFigmaTile {...tile} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
