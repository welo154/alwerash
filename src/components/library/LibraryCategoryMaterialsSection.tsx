"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LibraryMaterialCard } from "./LibraryMaterialCard";
import { LIBRARY_BOOK_WIDTH_PX } from "./LibraryBookGridBox";
import type { LibraryBook } from "./library-books";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

type RatingsSort = "default" | "high" | "low";
type PopularSort = "default" | "popular";
type FilterId = "ratings" | "popular";

const FILTER_LABELS: Record<FilterId, string> = {
  ratings: "Ratings",
  popular: "Popular",
};

const CONTENT_INSET_PX = 27;
const BOOK_GAP_PX = 50;

function bookGridWidth(availableWidth: number) {
  const cols = Math.max(
    1,
    Math.floor((availableWidth + BOOK_GAP_PX) / (LIBRARY_BOOK_WIDTH_PX + BOOK_GAP_PX))
  );
  return cols * LIBRARY_BOOK_WIDTH_PX + (cols - 1) * BOOK_GAP_PX;
}

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

function sortBooks(
  books: LibraryBook[],
  ratingsSort: RatingsSort,
  popularSort: PopularSort
): LibraryBook[] {
  const items = [...books];

  if (popularSort === "popular") {
    items.sort((a, b) => (b.pages ?? 0) - (a.pages ?? 0));
  }

  if (ratingsSort === "high") {
    items.sort((a, b) => (b.publishedYear ?? 0) - (a.publishedYear ?? 0));
  } else if (ratingsSort === "low") {
    items.sort((a, b) => (a.publishedYear ?? 0) - (b.publishedYear ?? 0));
  }

  return items;
}

export function LibraryCategoryMaterialsSection({
  categoryTitle,
  books,
}: {
  categoryTitle: string;
  books: LibraryBook[];
}) {
  const [openFilter, setOpenFilter] = useState<FilterId | null>(null);
  const [ratingsSort, setRatingsSort] = useState<RatingsSort>("default");
  const [popularSort, setPopularSort] = useState<PopularSort>("default");
  const [gridWidth, setGridWidth] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const visibleBooks = useMemo(
    () => sortBooks(books, ratingsSort, popularSort),
    [books, ratingsSort, popularSort]
  );

  const closeMenu = () => setOpenFilter(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const update = () => {
      const available = Math.max(0, el.clientWidth - CONTENT_INSET_PX);
      setGridWidth(bookGridWidth(available));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!openFilter) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openFilter]);

  return (
    <div ref={sectionRef} className="min-w-0">
      <div
        className="flex flex-wrap items-start justify-between gap-6"
        style={{
          marginLeft: CONTENT_INSET_PX,
          width: gridWidth ?? undefined,
          maxWidth: "100%",
        }}
      >
        <h1
          className="m-0 min-w-0 flex-1 text-black"
          style={{
            fontFamily: pangeaFont,
            fontSize: "48px",
            fontWeight: 400,
            lineHeight: "120%",
          }}
        >
          {categoryTitle}
        </h1>

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
                    setRatingsSort(value);
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
        {visibleBooks.length === 0 ? (
          <p
            className="text-center text-[20px] text-black/60"
            style={{ fontFamily: pangeaFont }}
          >
            No materials in this category yet.
          </p>
        ) : (
          <div
            className="flex flex-wrap gap-[50px]"
            style={{
              marginLeft: CONTENT_INSET_PX,
              width: gridWidth ?? undefined,
              maxWidth: "100%",
            }}
          >
            {visibleBooks.map((book) => (
              <LibraryMaterialCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
