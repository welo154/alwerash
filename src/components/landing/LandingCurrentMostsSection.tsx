"use client";

import type { LandingMostsMentorCardDto } from "@/types/landing-mosts-mentor";
import { LandingMentorCard } from "./LandingMentorCard";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

/**
 * “THE CURRENT MOSTS” strip — below Everything-in-one-place.
 * md+: 120px from viewport left to content, 112px right inset; 166px top padding.
 * Mentor grid: 112px below header; 77px / 76px horizontal insets from page (md+).
 * Cards are filled from admin Mentors (`publicListLandingMostsMentors`), text-only.
 */


export function LandingCurrentMostsSection({
  mentors,
  forceTwoPerRow = false,
  mentorsPerRow,
  compactVerticalSpacing = false,
  leftInsetPx,
  rightInsetPx,
  contained = false,
  alignToRight = false,
  alignCardsLeft = false,
  headingSizePx,
  cardsTopGapPx,
  mentorCardWidthPx,
  mentorCardHeightPx,
}: {
  mentors: LandingMostsMentorCardDto[];
  forceTwoPerRow?: boolean;
  /** When set (e.g. 4), grid uses this many columns and cards scale to cell width. */
  mentorsPerRow?: 2 | 3 | 4;
  compactVerticalSpacing?: boolean;
  leftInsetPx?: number;
  rightInsetPx?: number;
  contained?: boolean;
  /** When true, heading and mentor grid hug the right edge of the section / viewport breakout. */
  alignToRight?: boolean;
  /** When true, the mentor grid starts at the same left edge as the heading (logged-in `/home`). */
  alignCardsLeft?: boolean;
  /** Heading font size; defaults to the guest-landing 48px. */
  headingSizePx?: number;
  /** Gap between the heading and the card grid; defaults to 82px (70px compact). */
  cardsTopGapPx?: number;
  mentorCardWidthPx?: number;
  mentorCardHeightPx?: number;
}) {
  const columnCount = mentorsPerRow ?? (forceTwoPerRow ? 2 : 3);
  const useFluidCards = mentorsPerRow != null && mentorsPerRow >= 4;
  const gapX = "gap-x-[26px]";
  const gapY = "gap-y-[40px]";

  const gridColsClass =
    columnCount === 4
      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      : columnCount === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  const fixedColGridClass =
    columnCount === 4
      ? "md:grid-cols-[repeat(2,383px)] xl:grid-cols-[repeat(4,191.5px)]"
      : columnCount === 2
        ? "md:grid-cols-[repeat(2,383px)]"
        : "md:grid-cols-[repeat(2,383px)] lg:grid-cols-[repeat(3,383px)]";

  const gridJustify = alignToRight
    ? "justify-end"
    : alignCardsLeft
      ? "justify-start"
      : "justify-center";
  const gridMaxWidthClass = !contained && alignToRight ? "ml-auto mr-0" : "mx-auto";
  const gridClassName = contained
    ? useFluidCards
      ? `grid w-full ${gridColsClass} ${gridJustify} ${gapX} ${gapY}`
      : forceTwoPerRow
        ? `grid ${gridColsClass} ${gridJustify} ${gapX} ${gapY} ${fixedColGridClass}`
        : `grid ${gridColsClass} ${gridJustify} ${gapX} ${gapY} ${fixedColGridClass}`
    : forceTwoPerRow
    ? `${gridMaxWidthClass} grid max-w-[1600px] ${gridColsClass} ${gridJustify} ${gapX} ${gapY} ${fixedColGridClass}`
    : `${gridMaxWidthClass} grid max-w-[1600px] ${gridColsClass} ${gridJustify} ${gapX} ${gapY} ${fixedColGridClass}`;
  /** Contained + right align: breakout to viewport width from a narrow main column, content flush right. */
  const sectionSpacingClass =
    contained && alignToRight
      ? compactVerticalSpacing
        ? "relative mb-0 ml-[calc(50%-50vw)] flex w-screen max-w-[100vw] flex-col items-end overflow-x-hidden pl-[85px] pr-[64px] pt-0"
        : "relative mb-[90px] ml-[calc(50%-50vw)] flex w-screen max-w-[100vw] flex-col items-end overflow-x-hidden pl-[85px] pr-[64px] pt-[97px]"
      : contained
        ? compactVerticalSpacing
          ? "relative mb-0 w-full overflow-visible pt-0"
          : "relative mb-[90px] w-full overflow-visible pt-[97px]"
        : compactVerticalSpacing
          ? `relative left-1/2 mb-0 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-hidden px-4 pt-0${alignToRight ? " flex flex-col items-end pr-[64px] pl-[85px]" : ""}`
          : `relative left-1/2 mb-[90px] w-screen max-w-[100vw] -translate-x-1/2 overflow-x-hidden px-4 pt-[97px]${alignToRight ? " flex flex-col items-end pr-[64px] pl-[85px]" : ""}`;
  const cardsTopClass =
    contained && alignToRight
      ? compactVerticalSpacing
        ? "relative mt-[70px] w-full"
        : "relative mt-[82px] w-full"
      : contained
        ? compactVerticalSpacing
          ? "relative mt-[70px] w-full"
          : "relative mt-[82px] w-full"
        : compactVerticalSpacing
          ? "relative mt-[70px] w-full"
          : "relative mt-[82px] w-full";
  const sectionInlineStyle = {
    paddingLeft: leftInsetPx !== undefined ? `${leftInsetPx}px` : undefined,
    paddingRight: rightInsetPx !== undefined ? `${rightInsetPx}px` : undefined,
  } as const;

  const cardW = mentorCardWidthPx ?? (columnCount === 4 ? 191.5 : 383);
  const contentRowWidthPx =
    columnCount === 4
      ? cardW * 4 + 26 * 3
      : columnCount === 2
        ? cardW * 2 + 26
        : cardW * 3 + 26 * 2;

  return (
    <section
      className={sectionSpacingClass}
      style={sectionInlineStyle}
      data-gsap-reveal
      aria-labelledby="landing-current-mosts-heading"
    >
      <div
        className={
          alignToRight
            ? "ml-auto flex w-full max-w-full flex-col"
            : contained
              ? "flex w-full flex-col"
              : "mx-auto flex w-full max-w-full flex-col"
        }
        style={
          alignToRight || contained
            ? undefined
            : { width: contentRowWidthPx, maxWidth: "100%" }
        }
      >
        <h2
          id="landing-current-mosts-heading"
          className={`m-0 w-full uppercase leading-[120%] text-black ${alignToRight ? "text-right" : "text-left"}`}
          style={{ fontFamily: pangeaFont, fontSize: `${headingSizePx ?? 48}px` }}
        >
          <span className="font-normal not-italic">THE CURRENT </span>
          <span className="font-bold italic">MOSTS</span>
        </h2>

        <div
          className={alignToRight || contained ? cardsTopClass : "mt-[82px] w-full"}
          style={cardsTopGapPx != null ? { marginTop: `${cardsTopGapPx}px` } : undefined}
        >
          <div
            className={
              alignToRight || contained
                ? gridClassName
                : `grid w-full justify-start ${gapX} ${gapY} grid-cols-1 ${fixedColGridClass}`
            }
          >
            {mentors.map((m) => (
              <LandingMentorCard
                key={m.id}
                variant={m.variant}
                name={m.name}
                profession={m.profession}
                href={`/mentors/${m.id}`}
                fillWidth={useFluidCards}
                widthPx={
                  useFluidCards
                    ? undefined
                    : mentorCardWidthPx ??
                      (columnCount === 4 ? 191.5 : 383)
                }
                heightPx={
                  useFluidCards
                    ? undefined
                    : mentorCardHeightPx ??
                      (columnCount === 4 ? 178.5 : 357)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
