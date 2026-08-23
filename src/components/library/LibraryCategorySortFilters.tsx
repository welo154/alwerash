"use client";

import { useEffect, useRef, useState } from "react";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

export type LibraryRatingsSort = "default" | "high" | "low";
export type LibraryPopularSort = "default" | "popular";

type FilterId = "ratings" | "popular";

const FILTER_LABELS: Record<FilterId, string> = {
  ratings: "Ratings",
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

function FilterButton({
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

export function LibraryCategorySortFilters({
  ratingsSort,
  popularSort,
  onRatingsChange,
  onPopularChange,
}: {
  ratingsSort: LibraryRatingsSort;
  popularSort: LibraryPopularSort;
  onRatingsChange: (value: LibraryRatingsSort) => void;
  onPopularChange: (value: LibraryPopularSort) => void;
}) {
  const [openFilter, setOpenFilter] = useState<FilterId | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
    <div ref={menuRef} className="relative flex shrink-0 flex-wrap items-center gap-3">
      {(Object.keys(FILTER_LABELS) as FilterId[]).map((id) => (
        <FilterButton
          key={id}
          label={FILTER_LABELS[id]}
          open={openFilter === id}
          onClick={() => setOpenFilter((prev) => (prev === id ? null : id))}
        />
      ))}

      {openFilter === "ratings" ? (
        <div
          className="absolute top-[calc(100%+8px)] right-[118px] z-20 min-w-[160px] rounded-[8px] border border-black bg-white py-1 shadow-md"
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
                onRatingsChange(value);
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
                onPopularChange(value);
                closeMenu();
              }}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
