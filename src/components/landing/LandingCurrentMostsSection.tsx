"use client";

import { useState } from "react";
import type { LandingMostsMentorCardDto } from "@/types/landing-mosts-mentor";
import { LandingMentorCard } from "./LandingMentorCard";
import { LandingMentorModal } from "./LandingMentorModal";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const TABLET_HEADING_LEFT_PX = 63;
const TABLET_CARD_W = 301;
const TABLET_CARD_H = 311.979;
const TABLET_GAP_X = 18;
const TABLET_GAP_Y = 50;
const TABLET_GRID_W = TABLET_CARD_W * 2 + TABLET_GAP_X;

function CurrentMostsHeading({
  id,
  sizePx,
  className,
  align = "left",
  paddingLeftPx,
}: {
  id: string;
  sizePx: number;
  className?: string;
  align?: "left" | "right";
  paddingLeftPx?: number;
}) {
  return (
    <h2
      id={id}
      className={`m-0 uppercase text-black ${
        align === "right" ? "text-right" : "text-left"
      } ${className ?? ""}`}
      style={{
        fontFamily: pangeaFont,
        fontSize: `${sizePx}px`,
        lineHeight: "120%",
        color: "#000",
        paddingLeft: paddingLeftPx != null ? `${paddingLeftPx}px` : undefined,
      }}
    >
      <span
        style={{
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
        }}
      >
        THE CURRENT{" "}
      </span>
      <span
        style={{
          fontStyle: "italic",
          fontWeight: 700,
          lineHeight: "120%",
        }}
      >
        MOSTS
      </span>
    </h2>
  );
}

/**
 * “THE CURRENT MOSTS” strip — below Everything-in-one-place.
 * Phone: stacked 329×341 cards.
 * iPad (744–lg): 40px heading, 2×301×311.979 cards, 18×50 gaps.
 * lg+: same heading type; 383×357 cards in the page’s column count.
 */
export function LandingCurrentMostsSection({
  mentors,
  forceTwoPerRow = false,
  mentorsPerRow,
  compactVerticalSpacing = false,
  leftInsetPx,
  rightInsetPx,
  mobileHeadingInsetPx,
  contained = false,
  alignToRight = false,
  alignCardsLeft = false,
  headingSizePx,
  tabletHeadingSizePx,
  cardsTopGapPx,
  mentorCardWidthPx,
  mentorCardHeightPx,
  /** Guest home only: line under the heading on iPad. */
  showExploreCopy = false,
  className,
}: {
  mentors: LandingMostsMentorCardDto[];
  forceTwoPerRow?: boolean;
  /** When set (e.g. 4), grid uses this many columns and cards scale to cell width. */
  mentorsPerRow?: 2 | 3 | 4;
  compactVerticalSpacing?: boolean;
  leftInsetPx?: number;
  rightInsetPx?: number;
  /** Mobile heading inset from the section’s left edge (guest landing default 30px). */
  mobileHeadingInsetPx?: number;
  contained?: boolean;
  /** When true, heading and mentor grid hug the right edge of the section / viewport breakout. */
  alignToRight?: boolean;
  /** When true, the mentor grid starts at the same left edge as the heading (logged-in `/home`). */
  alignCardsLeft?: boolean;
  /** Heading font size; defaults to 40px on all pages. */
  headingSizePx?: number;
  /** iPad heading size (744–lg); defaults to 40px. */
  tabletHeadingSizePx?: number;
  /** Gap between the heading and the card grid; defaults to 82px (70px compact). */
  cardsTopGapPx?: number;
  mentorCardWidthPx?: number;
  mentorCardHeightPx?: number;
  showExploreCopy?: boolean;
  className?: string;
}) {
  const [selectedMentor, setSelectedMentor] =
    useState<LandingMostsMentorCardDto | null>(null);

  const visibleMentors = mentors.slice(0, (mentorsPerRow ?? (forceTwoPerRow ? 2 : 3)) * 2);

  const columnCount = mentorsPerRow ?? (forceTwoPerRow ? 2 : 3);
  const useFluidCards = mentorsPerRow != null && mentorsPerRow >= 4;
  const gapX = "gap-x-[26px]";
  const gapY = "gap-y-[40px]";
  /** Center a card-row-wide stack so the title shares the leftmost card’s vertical line. */
  const pinToCardRow = !alignToRight && !(contained && alignCardsLeft);

  const gridColsClass =
    columnCount === 4
      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      : columnCount === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:max-lg:grid-cols-2 lg:grid-cols-3";

  const fixedColGridClass =
    columnCount === 4
      ? "md:max-xl:grid-cols-[repeat(2,383px)] xl:grid-cols-[repeat(4,191.5px)]"
      : columnCount === 2
        ? "md:grid-cols-[repeat(2,383px)]"
        : "md:max-lg:grid-cols-[repeat(2,383px)] lg:grid-cols-[repeat(3,383px)]";

  const gridJustify = alignToRight
    ? "justify-end"
    : alignCardsLeft || pinToCardRow
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
    <>
      <section
        className={`w-full min-[744px]:hidden ${className ?? ""}`}
        aria-labelledby="landing-current-mosts-heading-mobile"
      >
        <h2
          id="landing-current-mosts-heading-mobile"
          className="m-0 w-[269px] text-left uppercase text-black"
          style={{
            fontFamily: pangeaFont,
            marginLeft: mobileHeadingInsetPx ?? 30,
          }}
        >
          <span
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}
          >
            THE CURRENT{" "}
          </span>
          <span
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontSize: "24px",
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: "120%",
            }}
          >
            MOSTS
          </span>
        </h2>

        {visibleMentors.length > 0 ? (
          <div className="relative left-1/2 mt-[40px] flex w-screen max-w-[100vw] -translate-x-1/2 flex-col items-center gap-y-[40px] px-4">
            {visibleMentors.map((m) => (
              <LandingMentorCard
                key={m.id}
                layout="mobile"
                variant={m.variant}
                name={m.name}
                profession={m.profession}
                onOpen={() => setSelectedMentor(m)}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section
        className={`relative left-1/2 hidden w-screen max-w-[100vw] -translate-x-1/2 min-[744px]:max-lg:block ${className ?? ""}`}
        aria-labelledby="landing-current-mosts-heading-tablet"
      >
        <CurrentMostsHeading
          id="landing-current-mosts-heading-tablet"
          sizePx={tabletHeadingSizePx ?? 40}
          paddingLeftPx={TABLET_HEADING_LEFT_PX}
        />
        {showExploreCopy ? (
          <p
            className="m-0 mt-[17px] h-[60px] w-[404px] text-[24px] font-normal leading-[127%] text-black"
            style={{
              fontFamily: pangeaFont,
              marginLeft: TABLET_HEADING_LEFT_PX,
            }}
          >
            Explore our most popular and most watched mentors and instructors.
          </p>
        ) : null}
        {visibleMentors.length > 0 ? (
          <div
            className="mx-auto grid justify-items-center"
            style={{
              marginTop: 70,
              width: TABLET_GRID_W,
              maxWidth: "100%",
              gridTemplateColumns: `repeat(2, ${TABLET_CARD_W}px)`,
              columnGap: TABLET_GAP_X,
              rowGap: TABLET_GAP_Y,
            }}
          >
            {visibleMentors.map((m) => (
              <LandingMentorCard
                key={m.id}
                layout="tablet"
                variant={m.variant}
                name={m.name}
                profession={m.profession}
                onOpen={() => setSelectedMentor(m)}
                widthPx={TABLET_CARD_W}
                heightPx={TABLET_CARD_H}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section
        className={`max-lg:hidden ${sectionSpacingClass} ${className ?? ""}`}
        style={sectionInlineStyle}
        data-gsap-reveal
        aria-labelledby="landing-current-mosts-heading"
      >
        <div
          className={
            alignToRight
              ? "ml-auto flex w-full max-w-full flex-col"
              : pinToCardRow
                ? "mx-auto flex w-full max-w-full flex-col"
                : "flex w-full flex-col"
          }
          style={
            pinToCardRow
              ? { width: contentRowWidthPx, maxWidth: "100%" }
              : undefined
          }
        >
          <CurrentMostsHeading
            id="landing-current-mosts-heading"
            sizePx={headingSizePx ?? 40}
            align={alignToRight ? "right" : "left"}
            className="w-full"
          />

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
              {visibleMentors.map((m) => (
                <LandingMentorCard
                  key={m.id}
                  variant={m.variant}
                  name={m.name}
                  profession={m.profession}
                  onOpen={() => setSelectedMentor(m)}
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

      <LandingMentorModal
        mentor={selectedMentor}
        open={selectedMentor != null}
        onClose={() => setSelectedMentor(null)}
      />
    </>
  );
}
