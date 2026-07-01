"use client";

import type { LandingMostsMentorCardDto } from "@/types/landing-mosts-mentor";
import { LandingMentorCard } from "./LandingMentorCard";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

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
  mentorCardWidthPx?: number;
  mentorCardHeightPx?: number;
}) {
  const columnCount = mentorsPerRow ?? (forceTwoPerRow ? 2 : 3);
  const useFluidCards = mentorsPerRow != null && mentorsPerRow >= 4;
  const gapX = columnCount >= 4 ? "gap-x-6" : "gap-x-[48px]";
  const gapY = columnCount >= 4 ? "gap-y-8" : "gap-y-[50px]";

  const gridColsClass =
    columnCount === 4
      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      : columnCount === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  const fixedColGridClass =
    columnCount === 4
      ? "md:grid-cols-[repeat(2,469px)] xl:grid-cols-[repeat(4,234.5px)]"
      : columnCount === 2
        ? "md:grid-cols-[repeat(2,469px)]"
        : "md:grid-cols-[repeat(2,469px)] lg:grid-cols-[repeat(3,469px)]";

  const gridJustify = alignToRight ? "justify-end" : contained ? "justify-start" : "justify-center";
  const gridMaxWidthClass = !contained && alignToRight ? "ml-auto mr-0" : "mx-auto";
  const gridClassName = contained
    ? useFluidCards
      ? `grid w-full ${gridColsClass} ${gridJustify} ${gapX} ${gapY}`
      : forceTwoPerRow
        ? `grid ${gridColsClass} ${gridJustify} ${gapX} ${gapY} ${fixedColGridClass}`
        : `grid ${gridColsClass} ${gridJustify} ${gapX} ${gapY} ${fixedColGridClass}`
    : forceTwoPerRow
      ? `${gridMaxWidthClass} grid max-w-[1600px] ${gridColsClass} ${gridJustify} ${gapX} ${gapY} md:pl-[77px] md:pr-[76px] ${fixedColGridClass}`
      : `${gridMaxWidthClass} grid max-w-[1600px] ${gridColsClass} ${gridJustify} ${gapX} ${gapY} md:pl-[77px] md:pr-[76px] ${fixedColGridClass}`;
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
          ? `relative left-1/2 mb-0 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-hidden pl-[85px] pr-[64px] pt-0${alignToRight ? " flex flex-col items-end" : ""}`
          : `relative left-1/2 mb-[90px] w-screen max-w-[100vw] -translate-x-1/2 overflow-x-hidden pl-[85px] pr-[64px] pt-[97px]${alignToRight ? " flex flex-col items-end" : ""}`;
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
          ? "relative left-1/2 mt-[70px] w-screen max-w-[100vw] -translate-x-1/2 px-4 sm:px-6 md:px-0"
          : "relative left-1/2 mt-[82px] w-screen max-w-[100vw] -translate-x-1/2 px-4 sm:px-6 md:px-0";
  const sectionInlineStyle = {
    paddingLeft: leftInsetPx !== undefined ? `${leftInsetPx}px` : undefined,
    paddingRight: rightInsetPx !== undefined ? `${rightInsetPx}px` : undefined,
  } as const;

  return (
    <section
      className={sectionSpacingClass}
      style={sectionInlineStyle}
      data-gsap-reveal
      aria-labelledby="landing-current-mosts-heading"
    >
      <div className="flex flex-col gap-6">
        <h2
          id="landing-current-mosts-heading"
          className={`m-0 text-[48px] uppercase leading-[120%] text-black${alignToRight ? " text-right" : ""}`}
          style={{ fontFamily: pangeaFont }}
        >
          <span className="font-normal not-italic">THE CURRENT </span>
          <span className="font-bold italic">MOSTS</span>
        </h2>
      </div>

      <div className={cardsTopClass}>
        <div className={gridClassName}>
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
                    (columnCount === 4 ? 234.5 : 469)
              }
              heightPx={
                useFluidCards
                  ? undefined
                  : mentorCardHeightPx ??
                    (columnCount === 4 ? 212.5 : 424.999)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
