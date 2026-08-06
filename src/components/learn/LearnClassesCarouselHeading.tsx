"use client";

import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

/** Shared circle arrow used next to learn-page section titles. */
function LearnHeadingArrowIcon({ size }: { size: 46 | 47 }) {
  if (size === 46) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={46}
        height={46}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
        className="block"
      >
        <path
          d="M24 47C36.7025 47 47 36.7025 47 24C47 11.2975 36.7025 1 24 1C11.2975 1 1 11.2975 1 24C1 36.7025 11.2975 47 24 47Z"
          fill="var(--White, #FFF)"
        />
        <path d="M24 33.2L33.2 24L24 14.8" fill="var(--White, #FFF)" />
        <path
          d="M24 14.8L33.2 24L24 33.2M33.2 24L14.8 24M47 24C47 36.7025 36.7025 47 24 47C11.2975 47 1 36.7025 1 24C1 11.2975 11.2975 1 24 1C36.7025 1 47 11.2975 47 24Z"
          stroke="var(--Black, #000)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={47}
      height={47}
      viewBox="0 0 49 49"
      fill="none"
      aria-hidden
      className="block"
    >
      <path
        d="M24.5 48C37.4787 48 48 37.4787 48 24.5C48 11.5213 37.4787 1 24.5 1C11.5213 1 1 11.5213 1 24.5C1 37.4787 11.5213 48 24.5 48Z"
        fill="var(--White, #FFF)"
      />
      <path d="M24.5 33.9L33.9 24.5L24.5 15.1" fill="var(--White, #FFF)" />
      <path
        d="M24.5 15.1L33.9 24.5L24.5 33.9M33.9 24.5L15.1 24.5M48 24.5C48 37.4787 37.4787 48 24.5 48C11.5213 48 1 37.4787 1 24.5C1 11.5213 11.5213 1 24.5 1C37.4787 1 48 11.5213 48 24.5Z"
        stroke="var(--Black, #000)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LearnClassesCarouselHeading({
  primary,
  secondary,
  onNext,
  atEnd = false,
  nextAriaLabel,
  showNavButton = true,
  /** Gap between the title and the arrow (Popular / Recently / All = 25; Featured = 32). */
  arrowGapPx = 25,
  arrowSize = 47 as 46 | 47,
}: {
  primary: string;
  secondary?: string;
  onNext?: () => void;
  atEnd?: boolean;
  nextAriaLabel: string;
  showNavButton?: boolean;
  arrowGapPx?: number;
  arrowSize?: 46 | 47;
}) {
  return (
    <div className="relative inline-flex items-center">
      <div className="inline-flex items-center rounded-[44px] bg-white pl-[22px] pr-[22px]">
        <h2 className="m-0 uppercase" style={{ fontFamily: pangeaFont, lineHeight: "120%" }}>
          <span
            style={{
              color: "var(--Black, #000)",
              fontSize: 36,
              fontStyle: "italic",
              fontWeight: 600,
              lineHeight: "120%",
            }}
          >
            {primary}
          </span>
          {secondary ? (
            <span
              style={{
                color: "var(--Black, #000)",
                fontSize: 36,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
              }}
            >
              {" "}
              {secondary}
            </span>
          ) : null}
        </h2>
      </div>
      {showNavButton ? (
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          style={{
            marginLeft: arrowGapPx,
            width: arrowSize,
            height: arrowSize,
          }}
          aria-label={nextAriaLabel}
          disabled={atEnd}
          suppressHydrationWarning
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onNext?.();
          }}
        >
          <LearnHeadingArrowIcon size={arrowSize} />
        </button>
      ) : null}
    </div>
  );
}
