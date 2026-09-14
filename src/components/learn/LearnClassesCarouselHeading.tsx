"use client";

import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

/** Shared circle arrow used next to learn-page section titles. */
function LearnHeadingArrowIcon({ size }: { size: 28 | 41 | 46 | 47 }) {
  if (size === 47) {
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

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
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

export function LearnClassesCarouselHeading({
  primary,
  secondary,
  onNext,
  atEnd = false,
  nextAriaLabel,
  showNavButton = true,
  hideNavOnMobile = false,
  /** Gap between the title and the arrow (Popular / Recently / All = 25; Featured = 32). */
  arrowGapPx = 25,
  arrowSize = 47 as 46 | 47,
  className = "",
  pillClassName = "",
  /** When set, uses flex gap instead of margin-left (supports responsive Tailwind classes). */
  arrowGapClassName = "",
  tabletArrowSize = 28 as 28 | 41,
}: {
  primary: string;
  secondary?: string;
  onNext?: () => void;
  atEnd?: boolean;
  nextAriaLabel: string;
  showNavButton?: boolean;
  hideNavOnMobile?: boolean;
  arrowGapPx?: number;
  arrowSize?: 46 | 47;
  className?: string;
  pillClassName?: string;
  arrowGapClassName?: string;
  tabletArrowSize?: 28 | 41;
}) {
  const useGap = arrowGapClassName.length > 0;
  const tabletArrow = tabletArrowSize === 41;

  return (
    <div
      className={`relative inline-flex w-fit items-center ${useGap ? arrowGapClassName : ""} ${className}`.trim()}
    >
      <div
        className={`inline-flex w-fit shrink-0 items-center rounded-[44px] bg-white pl-[22px] pr-[22px] ${pillClassName}`.trim()}
      >
        <h2
          className="m-0 w-fit uppercase leading-[120%] text-[var(--Black,#000)]"
          style={{ fontFamily: pangeaFont }}
        >
          <span className="text-[24px] font-semibold italic min-[744px]:max-lg:text-[32px] min-[744px]:max-lg:font-bold lg:text-[36px]">
            {primary}
          </span>
          {secondary ? (
            <span className="text-[24px] font-normal not-italic min-[744px]:max-lg:text-[32px] lg:text-[36px]">
              {" "}
              {secondary}
            </span>
          ) : null}
        </h2>
      </div>
      {showNavButton ? (
        <button
          type="button"
          className={`inline-flex shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40 ${
            useGap
              ? tabletArrow
                ? "max-[743px]:size-[28px] min-[744px]:max-lg:size-[41px] lg:size-[47px]"
                : "max-lg:size-[28px] lg:size-[47px]"
              : ""
          } ${hideNavOnMobile ? "max-lg:hidden" : ""}`}
          style={
            useGap
              ? undefined
              : {
                  marginLeft: arrowGapPx,
                  width: arrowSize,
                  height: arrowSize,
                }
          }
          aria-label={nextAriaLabel}
          disabled={atEnd}
          suppressHydrationWarning
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onNext?.();
          }}
        >
          {useGap ? (
            <>
              <span
                className={
                  tabletArrow
                    ? "inline-flex size-[28px] max-[743px]:inline-flex min-[744px]:hidden"
                    : "inline-flex size-[28px] lg:hidden"
                }
              >
                <LearnHeadingArrowIcon size={28} />
              </span>
              {tabletArrow ? (
                <span className="hidden size-[41px] min-[744px]:max-lg:inline-flex">
                  <LearnHeadingArrowIcon size={41} />
                </span>
              ) : null}
              <span className="hidden size-[47px] lg:inline-flex">
                <LearnHeadingArrowIcon size={arrowSize} />
              </span>
            </>
          ) : (
            <LearnHeadingArrowIcon size={arrowSize} />
          )}
        </button>
      ) : null}
    </div>
  );
}
