"use client";

import { useState } from "react";
import {
  ARTICLE_COVER_WIDTH,
  LibraryArticleCardVisual,
} from "./LibraryArticleCardVisual";
import {
  LibraryCategorySortFilters,
  type LibraryPopularSort,
  type LibraryRatingsSort,
} from "./LibraryCategorySortFilters";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const CONTENT_INSET_PX = 27;
const ARTICLE_GRID_GAP_PX = 56;
const ARTICLE_GRID_COLUMNS = 4;
const ARTICLE_GRID_WIDTH =
  ARTICLE_COVER_WIDTH * ARTICLE_GRID_COLUMNS +
  ARTICLE_GRID_GAP_PX * (ARTICLE_GRID_COLUMNS - 1);

type ArticleCardData = {
  id: string;
  title: string;
  priceLabel: string;
};

const ARTICLE_CARDS: ArticleCardData[] = Array.from({ length: 20 }, (_, index) => ({
  id: `article-${index + 1}`,
  title: "The Secret Lives of Color",
  priceLabel: "Free",
}));

function ArticleCardFavoriteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="21"
      viewBox="0 0 23 21"
      fill="none"
      className="h-[19px] w-[21px] shrink-0"
      aria-hidden
    >
      <path
        d="M20.1815 2.47954C19.6684 1.94702 19.0591 1.52458 18.3886 1.23636C17.718 0.94815 16.9993 0.799805 16.2735 0.799805C15.5476 0.799805 14.8289 0.94815 14.1583 1.23636C13.4878 1.52458 12.8785 1.94702 12.3654 2.47954L11.3005 3.5842L10.2356 2.47954C9.19913 1.40438 7.79337 0.800362 6.32757 0.800362C4.86177 0.800362 3.45601 1.40438 2.41954 2.47954C1.38307 3.5547 0.800781 5.01293 0.800781 6.53344C0.800781 8.05395 1.38307 9.51218 2.41954 10.5873L11.3005 19.7998L20.1815 10.5873C20.6949 10.0551 21.1021 9.42309 21.3799 8.7275C21.6578 8.03192 21.8008 7.28637 21.8008 6.53344C21.8008 5.78051 21.6578 5.03496 21.3799 4.33938C21.1021 3.6438 20.6949 3.01182 20.1815 2.47954Z"
        fill="#FFF"
        stroke="#1E1E1E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArticleCardMeta({
  title,
  priceLabel,
}: {
  title: string;
  priceLabel: string;
}) {
  return (
    <div className="flex items-start" style={{ gap: 30, marginTop: 20 }}>
      <div style={{ width: 138, fontFamily: pangeaFont }}>
        <p
          className="m-0 text-black"
          style={{
            width: 138,
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
          }}
        >
          {title}
        </p>
        <p
          className="m-0"
          style={{
            color: "rgba(0, 0, 0, 0.60)",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
          }}
        >
          {priceLabel}
        </p>
      </div>
      <button
        type="button"
        className="mt-0.5 shrink-0 rounded-sm hover:opacity-80"
        aria-label={`Save ${title}`}
      >
        <ArticleCardFavoriteIcon />
      </button>
    </div>
  );
}

function LibraryArticleCard({ card }: { card: ArticleCardData }) {
  return (
    <article className="w-fit shrink-0">
      <LibraryArticleCardVisual clipId={card.id} />
      <ArticleCardMeta title={card.title} priceLabel={card.priceLabel} />
    </article>
  );
}

export function LibraryArticlesSection() {
  const [ratingsSort, setRatingsSort] = useState<LibraryRatingsSort>("default");
  const [popularSort, setPopularSort] = useState<LibraryPopularSort>("default");

  return (
    <div className="min-w-0">
      <div
        className="flex flex-wrap items-start justify-between gap-6"
        style={{
          marginLeft: CONTENT_INSET_PX,
          width: ARTICLE_GRID_WIDTH,
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
          ARTICLES
        </h1>

        <LibraryCategorySortFilters
          ratingsSort={ratingsSort}
          popularSort={popularSort}
          onRatingsChange={setRatingsSort}
          onPopularChange={setPopularSort}
        />
      </div>

      <div
        className="mt-[43px] grid"
        style={{
          marginLeft: CONTENT_INSET_PX,
          gridTemplateColumns: `repeat(${ARTICLE_GRID_COLUMNS}, ${ARTICLE_COVER_WIDTH}px)`,
          gap: ARTICLE_GRID_GAP_PX,
          width: ARTICLE_GRID_WIDTH,
        }}
      >
        {ARTICLE_CARDS.map((card) => (
          <LibraryArticleCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
