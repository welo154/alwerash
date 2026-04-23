"use client";

import Link from "next/link";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";

/** `var(--sds-color-icon-default-default)` */
const ICON_STROKE = "#1E1E1E";

/** Renders 41×41: artwork uses 43×43 viewBox, stroke 1.5px, fills #FFF. */
function LearnPopularStartArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={41}
      height={41}
      viewBox="0 0 43 43"
      fill="none"
      className="shrink-0 -ml-[20px]"
      aria-hidden
    >
      <path
        d="M21.25 41.75C32.5718 41.75 41.75 32.5718 41.75 21.25C41.75 9.92816 32.5718 0.75 21.25 0.75C9.92816 0.75 0.75 9.92816 0.75 21.25C0.75 32.5718 9.92816 41.75 21.25 41.75Z"
        fill="#FFF"
      />
      <path d="M21.25 29.45L29.45 21.25L21.25 13.05" fill="#FFF" />
      <path
        d="M21.25 29.45L29.45 21.25M29.45 21.25L21.25 13.05M29.45 21.25L13.05 21.25M41.75 21.25C41.75 32.5718 32.5718 41.75 21.25 41.75C9.92816 41.75 0.75 32.5718 0.75 21.25C0.75 9.92816 9.92816 0.75 21.25 0.75C32.5718 0.75 41.75 9.92816 41.75 21.25Z"
        stroke={ICON_STROKE}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Like glyph centered in 41×41 hit area (Figma `167:1736` area). */
function LearnPopularTileLikeBadge() {
  return (
    <div
      className="flex size-[41px] shrink-0 items-center justify-center rounded-full bg-white"
      aria-hidden
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={18} viewBox="0 0 22 18" fill="none" aria-hidden>
        <path
          opacity={0.6}
          d="M5.72307 8.09119L9.70153 0.75C10.4929 0.75 11.2518 1.00782 11.8114 1.46673C12.371 1.92564 12.6854 2.54806 12.6854 3.19706V6.45982H18.3149C18.6032 6.45714 18.8888 6.50591 19.1519 6.60274C19.415 6.69957 19.6493 6.84216 19.8385 7.02062C20.0277 7.19907 20.1674 7.40913 20.2478 7.63625C20.3282 7.86336 20.3474 8.10209 20.3041 8.3359L18.9316 15.6771C18.8596 16.0661 18.6187 16.4207 18.2531 16.6755C17.8876 16.9303 17.4221 17.0682 16.9423 17.0638H5.72307M5.72307 8.09119V17.0638M5.72307 8.09119H2.73923C2.21165 8.09119 1.70568 8.26307 1.33263 8.56901C0.959579 8.87496 0.75 9.2899 0.75 9.72257V15.4324C0.75 15.8651 0.959579 16.28 1.33263 16.5859C1.70568 16.8919 2.21165 17.0638 2.73923 17.0638H5.72307"
          stroke="black"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

/** Figma `167:1726` — Rectangle 53: 346×377, #e9e9e9, border, rounded-[50px]. */
const GRAY_H = 377;
/** Pixels to pull the white panel up so its top sits at 166px (377 − 166). */
const WHITE_PULL_UP = GRAY_H - 166;

export const LEARN_POPULAR_FIGMA_TILE_W = 346;
/** Legacy fixed height (≈447); slides use `height: auto` — kept for callers that need a minimum. */
export const LEARN_POPULAR_FIGMA_TILE_H = 166 + 281;

/** Figma `167:1729` — author max width 181; 5px below title. */
const AUTHOR_MAX_W = 181;
/** Space from white panel top to title (193 − 166). */
const WHITE_INNER_PT = 27;
/** Space between instructor line and category pill. */
const GAP_AUTHOR_TO_TAG = 14;
/** Space between category pill and START button. */
const GAP_TAG_TO_START = 19;
const TAG_PRIMARY_H = 35;
const TAG_PILL_MAX_W = LEARN_POPULAR_FIGMA_TILE_W - 38.5;

export function LearnPopularFigmaTile(props: LearnPopularTile & { className?: string }) {
  const { href, title, authorLabel, tagPrimary, className = "" } = props;
  return (
    <Link
      href={href}
      aria-label={`${title}. ${authorLabel}. ${tagPrimary}. Start`}
      className={`relative flex w-[346px] shrink-0 flex-col overflow-visible no-underline ${className}`.trim()}
    >
      <div
        className="shrink-0 overflow-hidden rounded-[50px] border border-black bg-[#E9E9E9]"
        style={{ width: LEARN_POPULAR_FIGMA_TILE_W, height: GRAY_H }}
        aria-hidden
      />
      <div
        className="relative z-10 flex w-full flex-col rounded-[50px] border border-black bg-white pl-[37px] pr-[37px]"
        style={{
          marginTop: -WHITE_PULL_UP,
          width: LEARN_POPULAR_FIGMA_TILE_W,
          paddingTop: WHITE_INNER_PT,
          paddingBottom: 26,
          fontFamily: pangeaFont,
        }}
      >
        <div className="flex max-w-[274px] flex-col gap-[5px]">
          <p className="m-0 max-w-full text-[18px] font-normal not-italic leading-normal text-black">
            {title}
          </p>
          <p
            className="m-0 text-[16px] font-normal not-italic leading-normal text-black opacity-60"
            style={{ maxWidth: AUTHOR_MAX_W }}
          >
            {authorLabel}
          </p>
        </div>
        <div
          className="inline-flex w-max max-w-full items-center justify-center self-start rounded-[8px] border border-solid border-black bg-white px-4"
          style={{
            height: TAG_PRIMARY_H,
            maxWidth: TAG_PILL_MAX_W,
            marginTop: GAP_AUTHOR_TO_TAG,
            fontFamily: pangeaFont,
          }}
        >
          <span className="min-w-0 truncate text-center text-[16px] font-medium not-italic leading-[19.6px] text-black uppercase">
            {tagPrimary}
          </span>
        </div>
        <div
          className="pointer-events-none flex flex-wrap items-center self-start"
          style={{ marginTop: GAP_TAG_TO_START }}
          aria-hidden
        >
          <span
            className="inline-flex h-[42px] w-[106px] shrink-0 items-center justify-center rounded-[8px] border border-[#004B3C] bg-[#004B3C] text-white"
            style={{
              fontFamily: pangeaFont,
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "var(--Line-height-Heading-sm,19.6px)",
              padding: "0 16px",
            }}
          >
            START
          </span>
          <LearnPopularStartArrowIcon />
          <div className="ml-[11px] flex items-center gap-[7px]">
            <LearnPopularTileLikeBadge />
            <span
              className="text-[16px] font-normal not-italic leading-normal text-black opacity-60"
              style={{ fontFamily: pangeaFont, color: "var(--Black, #000)" }}
            >
              98%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
