import Image from "next/image";
import type { ReactNode } from "react";
import { LibraryArticleCardVisual } from "./LibraryArticleCardVisual";

const PRIMARY_BOOK_WIDTH = 451;
const PRIMARY_BOOK_HEIGHT = 580;

const OVERLAP_BOOK_WIDTH = 420;
const OVERLAP_BOOK_HEIGHT = 540;
const OVERLAP_BOOK_LEFT_OFFSET = 160;
const OVERLAP_BOOK_TOP_OFFSET = -15;

const LAST_BOOK_WIDTH = 358;
const LAST_BOOK_HEIGHT = 573;
const LAST_BOOK_TOP_OFFSET = -10;
const PORTRAIT_GREEN_WIDTH = 327;
const PORTRAIT_GREEN_HEIGHT = 564;
const PORTRAIT_GREEN_NUDGE_X = 28;
const PORTRAIT_GREEN_NUDGE_Y = 92;

function FeaturedPortraitWithGreen() {
  return (
    <div
      className="relative overflow-visible"
      style={{ width: LAST_BOOK_WIDTH, height: LAST_BOOK_HEIGHT }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={PORTRAIT_GREEN_WIDTH}
        height={PORTRAIT_GREEN_HEIGHT}
        viewBox="0 0 322 513"
        fill="none"
        aria-hidden
        className="absolute left-1/2 top-1/2"
        style={{
          zIndex: 0,
          transform: `translate(calc(-50% + ${PORTRAIT_GREEN_NUDGE_X}px), calc(-50% + ${PORTRAIT_GREEN_NUDGE_Y}px))`,
        }}
      >
        <path
          d="M285.266 499.494C286.158 508.693 277.272 516.45 273.517 509.749L230.821 433.53C225.573 434.542 220.072 434.724 214.484 433.95L26.4503 407.9C16.2259 406.484 7.15504 402.069 0.00096397 395.667C3.07849 396.74 6.30656 397.528 9.65891 397.993L207.065 425.341C234.417 429.13 259.663 410.028 263.453 382.675L314.92 11.1675C315.444 7.38787 315.53 3.64824 315.218 0.000155367C320.158 9.06661 322.345 19.7361 320.82 30.7481L273.162 374.756L285.266 499.494Z"
          fill="#89F496"
        />
      </svg>
      <Image
        src="/library/books/book-featured-portrait.png"
        alt="Podcast host portrait"
        width={LAST_BOOK_WIDTH}
        height={LAST_BOOK_HEIGHT}
        className="relative h-full w-full object-contain"
        style={{ zIndex: 1 }}
        unoptimized
      />
    </div>
  );
}

type FeaturedItem = {
  id: string;
  width: number;
  height: number;
  marginLeft: number;
  top: number;
  image?: { src: string; alt: string };
  visual?: ReactNode;
};

const FEATURED_ITEMS: FeaturedItem[] = [
  {
    id: "work",
    image: {
      src: "/library/books/book-work.png",
      alt: "Work book cover",
    },
    width: PRIMARY_BOOK_WIDTH,
    height: PRIMARY_BOOK_HEIGHT,
    marginLeft: 0,
    top: 0,
  },
  {
    id: "article",
    visual: (
      <div
        className="origin-center"
        style={{ transform: "rotate(-3deg) scale(1.75)" }}
      >
        <LibraryArticleCardVisual clipId="featured-article" />
      </div>
    ),
    width: OVERLAP_BOOK_WIDTH,
    height: OVERLAP_BOOK_HEIGHT,
    marginLeft: -OVERLAP_BOOK_LEFT_OFFSET,
    top: OVERLAP_BOOK_TOP_OFFSET - 20,
  },
  {
    id: "blue-day",
    image: {
      src: "/library/books/book-blue-day.png",
      alt: "Blue day film book cover",
    },
    width: OVERLAP_BOOK_WIDTH,
    height: OVERLAP_BOOK_HEIGHT,
    marginLeft: -OVERLAP_BOOK_LEFT_OFFSET,
    top: OVERLAP_BOOK_TOP_OFFSET - 10,
  },
  {
    id: "portrait",
    visual: <FeaturedPortraitWithGreen />,
    width: LAST_BOOK_WIDTH,
    height: LAST_BOOK_HEIGHT,
    marginLeft: -OVERLAP_BOOK_LEFT_OFFSET + 30,
    top: LAST_BOOK_TOP_OFFSET - 25,
  },
];

export function LibraryFeaturedBook({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  return (
    <section
      className={
        embedded
          ? "flex w-full items-start justify-center overflow-visible"
          : "mt-[75px] ml-[99px] flex items-start"
      }
      aria-label="Featured books"
    >
      {FEATURED_ITEMS.map((item, index) => (
        <div
          key={item.id}
          className="relative flex shrink-0 items-center justify-center overflow-visible"
          style={{
            width: item.width,
            height: item.height,
            marginLeft: item.marginLeft,
            top: item.top,
            zIndex: FEATURED_ITEMS.length - index,
          }}
        >
          {item.visual ? (
            item.visual
          ) : item.image ? (
            <Image
              src={item.image.src}
              alt={item.image.alt}
              width={item.width}
              height={item.height}
              className="h-full w-full object-contain"
              unoptimized
              priority={index === 0}
            />
          ) : null}
        </div>
      ))}
    </section>
  );
}
