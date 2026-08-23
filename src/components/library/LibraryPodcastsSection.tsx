"use client";

import { useMemo, useState } from "react";
import {
  LibraryCategorySortFilters,
  type LibraryPopularSort,
  type LibraryRatingsSort,
} from "./LibraryCategorySortFilters";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const CONTENT_INSET_PX = 27;
const PODCAST_CARD_WIDTH = 465.271;
const PODCAST_CARD_HEIGHT = 362.248;
const PODCAST_GRID_GAP_PX = -60;
const PODCAST_GRID_COLUMN_GAP_PX = PODCAST_GRID_GAP_PX - 120; // right cards nudged left 120px total

const COVER_OFFSET_X = 57;
const COVER_OFFSET_Y = 51;
const COVER_BOX_NUDGE_X_PX = 4;
const COVER_BOX_NUDGE_Y_PX = -6;
const COVER_BOX_SHRINK_WIDTH_PX = 30;
const COVER_BOX_SHRINK_HEIGHT_PX = 53;
const COVER_SVG_EXTRA_HEIGHT_PX = 10;
const COVER_SVG_EXTRA_WIDTH_PX = 1;
const GREEN_SVG_SHRINK_HEIGHT_PX = 10;
const COVER_BOX_COLOR = "#FFF";

const COVER_SHAPE_PATH =
  "M378.15 6C405.764 6.00015 428.15 28.3859 428.15 56V269.755C428.15 271.28 428.081 272.79 427.947 274.28L471.572 359.301C474.955 365.896 465.333 371.048 458.021 366.556L381.645 319.633C380.49 319.713 379.325 319.755 378.15 319.755H57C29.3859 319.755 7.00024 297.369 7 269.755V56C7 28.3858 29.3858 6 57 6H378.15Z";

const COVER_SVG_WIDTH = PODCAST_CARD_WIDTH + COVER_SVG_EXTRA_WIDTH_PX;
const COVER_SVG_HEIGHT = PODCAST_CARD_HEIGHT + COVER_SVG_EXTRA_HEIGHT_PX;
const GREEN_SVG_HEIGHT = PODCAST_CARD_HEIGHT - GREEN_SVG_SHRINK_HEIGHT_PX;
const PODCAST_CARD_FRAME_WIDTH =
  COVER_SVG_WIDTH + COVER_OFFSET_X + COVER_BOX_NUDGE_X_PX;
const PODCAST_CARD_FRAME_HEIGHT = COVER_SVG_HEIGHT + COVER_OFFSET_Y;

const COVER_TEXT_INSET_LEFT_PX = 32;
const COVER_TEXT_INSET_BOTTOM_PX = 36;
const COVER_TEXT_WIDTH_PX = 190;

const COVER_SHAPE_BOUNDS = {
  x: 7,
  y: 6,
  width: 464.572,
  height: 365.048,
} as const;

/** Matches: fill url(...) lightgray -34.569px -52.887px / 107.443% 138% no-repeat */
const COVER_IMAGE_FILL = {
  x: COVER_SHAPE_BOUNDS.x - 34.569,
  y: COVER_SHAPE_BOUNDS.y - 52.887,
  width: COVER_SHAPE_BOUNDS.width * 1.07443,
  height: COVER_SHAPE_BOUNDS.height * 1.38,
} as const;

type PodcastCardData = {
  id: string;
  title: string;
  priceLabel: string;
  hosts: string;
  role: string;
  imageSrc: string;
};

const PODCAST_CARDS: PodcastCardData[] = [
  {
    id: "secret-lives-of-color",
    title: "The Secret Lives of Color",
    priceLabel: "Free",
    hosts: "MOHAMED HOSSAM & ALY MOSTAFA",
    role: "Animators",
    imageSrc: "/library/podcasts/podcast-card-cover.png",
  },
  {
    id: "design-conversations",
    title: "Design Conversations",
    priceLabel: "Free",
    hosts: "MOHAMED HOSSAM & ALY MOSTAFA",
    role: "Animators",
    imageSrc: "/library/podcasts/podcast-card-cover.png",
  },
  {
    id: "creative-process",
    title: "The Creative Process",
    priceLabel: "Free",
    hosts: "MOHAMED HOSSAM & ALY MOSTAFA",
    role: "Animators",
    imageSrc: "/library/podcasts/podcast-card-cover.png",
  },
  {
    id: "motion-stories",
    title: "Motion Stories",
    priceLabel: "Free",
    hosts: "MOHAMED HOSSAM & ALY MOSTAFA",
    role: "Animators",
    imageSrc: "/library/podcasts/podcast-card-cover.png",
  },
  {
    id: "studio-notes",
    title: "Studio Notes",
    priceLabel: "Free",
    hosts: "MOHAMED HOSSAM & ALY MOSTAFA",
    role: "Animators",
    imageSrc: "/library/podcasts/podcast-card-cover.png",
  },
  {
    id: "visual-culture",
    title: "Visual Culture",
    priceLabel: "Free",
    hosts: "MOHAMED HOSSAM & ALY MOSTAFA",
    role: "Animators",
    imageSrc: "/library/podcasts/podcast-card-cover.png",
  },
];

function PodcastCardShape() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={PODCAST_CARD_WIDTH}
      height={GREEN_SVG_HEIGHT}
      viewBox="0 0 466 363"
      fill="none"
      aria-hidden
      className="absolute left-0 top-0"
    >
      <path
        d="M94.1211 362.248C66.507 362.248 44.1211 339.862 44.1211 312.248L44.1211 98.4931C44.1211 96.9679 44.1905 95.4582 44.3242 93.9677L0.69925 8.94723C-2.68365 2.35219 6.93805 -2.79951 14.25 1.69234L90.627 48.6152C91.7814 48.5355 92.9465 48.4931 94.1211 48.4931L415.272 48.4932C442.886 48.4932 465.271 70.8791 465.272 98.4932L465.271 312.248C465.271 339.862 442.886 362.248 415.271 362.248L94.1211 362.248Z"
        fill="#8AF396"
      />
    </svg>
  );
}

function PodcastCardCover({
  cardId,
  imageSrc,
}: {
  cardId: string;
  imageSrc: string;
}) {
  const clipId = `podcast-card-cover-clip-${cardId}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={COVER_SVG_WIDTH}
      height={COVER_SVG_HEIGHT}
      viewBox="0 0 474 371"
      fill="none"
      aria-hidden
      className="absolute z-[1]"
      style={{
        top: COVER_OFFSET_Y,
        left: COVER_OFFSET_X,
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={COVER_SHAPE_PATH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect
          x={COVER_SHAPE_BOUNDS.x}
          y={COVER_SHAPE_BOUNDS.y}
          width={COVER_SHAPE_BOUNDS.width}
          height={COVER_SHAPE_BOUNDS.height}
          fill="lightgray"
        />
        <image
          href={imageSrc}
          x={COVER_IMAGE_FILL.x}
          y={COVER_IMAGE_FILL.y}
          width={COVER_IMAGE_FILL.width}
          height={COVER_IMAGE_FILL.height}
          preserveAspectRatio="none"
        />
      </g>
      <path
        d={COVER_SHAPE_PATH}
        fill="none"
        stroke="#000"
        strokeWidth={0.3}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function PodcastCardCoverBox() {
  return (
    <div
      aria-hidden
      className="absolute"
      style={{
        top: COVER_OFFSET_Y - COVER_BOX_NUDGE_Y_PX,
        left: COVER_OFFSET_X + COVER_BOX_NUDGE_X_PX,
        width: PODCAST_CARD_WIDTH - COVER_BOX_SHRINK_WIDTH_PX,
        height: PODCAST_CARD_HEIGHT - COVER_BOX_SHRINK_HEIGHT_PX,
        background: COVER_BOX_COLOR,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
      }}
    />
  );
}

function PodcastCardCoverText({
  hosts,
  role,
}: {
  hosts: string;
  role: string;
}) {
  const mainBodyBottomY = (319.755 / 371) * COVER_SVG_HEIGHT;

  return (
    <div
      className="pointer-events-none absolute z-[2]"
      style={{
        left: COVER_OFFSET_X + COVER_TEXT_INSET_LEFT_PX,
        top: COVER_OFFSET_Y + mainBodyBottomY - COVER_TEXT_INSET_BOTTOM_PX,
        width: COVER_TEXT_WIDTH_PX,
        transform: "translateY(-100%)",
        fontFamily: pangeaFont,
        color: "#FFF",
      }}
    >
      <p
        className="m-0"
        style={{
          width: COVER_TEXT_WIDTH_PX,
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {hosts}
      </p>
      <p
        className="m-0"
        style={{
          marginTop: 1,
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {role}
      </p>
    </div>
  );
}

function PodcastCardFavoriteIcon() {
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

function PodcastCardMeta({
  title,
  priceLabel,
}: {
  title: string;
  priceLabel: string;
}) {
  return (
    <div
      className="flex items-start"
      style={{ gap: 23, marginTop: -36, marginLeft: 60 }}
    >
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
        <PodcastCardFavoriteIcon />
      </button>
    </div>
  );
}

function LibraryPodcastCard({ card }: { card: PodcastCardData }) {
  return (
    <article className="w-fit shrink-0">
      <div
        className="relative overflow-visible"
        style={{
          width: PODCAST_CARD_FRAME_WIDTH,
          height: PODCAST_CARD_FRAME_HEIGHT,
        }}
      >
        <PodcastCardShape />
        <PodcastCardCoverBox />
        <PodcastCardCover cardId={card.id} imageSrc={card.imageSrc} />
        <PodcastCardCoverText hosts={card.hosts} role={card.role} />
      </div>
      <PodcastCardMeta title={card.title} priceLabel={card.priceLabel} />
    </article>
  );
}

export function LibraryPodcastsSection() {
  const [ratingsSort, setRatingsSort] = useState<LibraryRatingsSort>("default");
  const [popularSort, setPopularSort] = useState<LibraryPopularSort>("default");

  const visibleCards = useMemo(() => {
    const items = [...PODCAST_CARDS];
    if (popularSort === "popular") {
      items.reverse();
    }
    if (ratingsSort === "high") {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (ratingsSort === "low") {
      items.sort((a, b) => b.title.localeCompare(a.title));
    }
    return items;
  }, [ratingsSort, popularSort]);

  const headerWidth = PODCAST_CARD_FRAME_WIDTH * 2 + PODCAST_GRID_COLUMN_GAP_PX;

  return (
    <div className="min-w-0" style={{ paddingLeft: CONTENT_INSET_PX }}>
      <div
        className="flex flex-wrap items-start justify-between gap-6"
        style={{ width: headerWidth, maxWidth: "100%" }}
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
          PODCASTS
        </h1>

        <div style={{ transform: "translateX(134px)" }}>
          <LibraryCategorySortFilters
            ratingsSort={ratingsSort}
            popularSort={popularSort}
            onRatingsChange={setRatingsSort}
            onPopularChange={setPopularSort}
          />
        </div>
      </div>

      <div
        className="mt-[17px] grid"
        style={{
          gridTemplateColumns: `repeat(2, ${PODCAST_CARD_FRAME_WIDTH}px)`,
          columnGap: PODCAST_GRID_COLUMN_GAP_PX,
          rowGap: PODCAST_GRID_GAP_PX,
          width: headerWidth,
        }}
      >
        {visibleCards.map((card) => (
          <LibraryPodcastCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
