"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LibraryMaterialCard } from "./LibraryMaterialCard";
import { LIBRARY_BOOK_WIDTH_PX } from "./LibraryBookGridBox";
import {
  LibraryCategorySortFilters,
  type LibraryPopularSort,
  type LibraryRatingsSort,
} from "./LibraryCategorySortFilters";
import type { LibraryBook } from "./library-books";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const CONTENT_INSET_PX = 27;
const BOOK_GAP_PX = 50;

function bookGridWidth(availableWidth: number) {
  const cols = Math.max(
    1,
    Math.floor((availableWidth + BOOK_GAP_PX) / (LIBRARY_BOOK_WIDTH_PX + BOOK_GAP_PX))
  );
  return cols * LIBRARY_BOOK_WIDTH_PX + (cols - 1) * BOOK_GAP_PX;
}

function sortBooks(
  books: LibraryBook[],
  ratingsSort: LibraryRatingsSort,
  popularSort: LibraryPopularSort
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
  const [ratingsSort, setRatingsSort] = useState<LibraryRatingsSort>("default");
  const [popularSort, setPopularSort] = useState<LibraryPopularSort>("default");
  const [gridWidth, setGridWidth] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const visibleBooks = useMemo(
    () => sortBooks(books, ratingsSort, popularSort),
    [books, ratingsSort, popularSort]
  );

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
            fontSize: "36px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
          }}
        >
          {categoryTitle}
        </h1>

        <LibraryCategorySortFilters
          ratingsSort={ratingsSort}
          popularSort={popularSort}
          onRatingsChange={setRatingsSort}
          onPopularChange={setPopularSort}
        />
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
