"use client";

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { CatalogShowcaseCardProps } from "./catalog-showcase-map";
import { appendShowcaseToHref } from "./catalog-showcase-map";

export type { CatalogShowcaseCardProps } from "./catalog-showcase-map";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

function ExternalLinkGlyph({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 23 23"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M1.25 1.25L21.25 21.25M21.25 21.25V1.25M21.25 21.25H1.25"
        stroke="#1E1E1E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SHOWCASE_TOP_H = 378;
const SHOWCASE_BOTTOM_H = 339;
const SHOWCASE_PANEL_OVERLAP = SHOWCASE_BOTTOM_H - 207;
const SHOWCASE_WHITE_TOP = SHOWCASE_TOP_H - SHOWCASE_PANEL_OVERLAP;
const SHOWCASE_CARD_H = SHOWCASE_WHITE_TOP + SHOWCASE_BOTTOM_H;

function ViewMoreCircleGlyph({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 43" fill="none" className={className} aria-hidden>
      <path
        d="M21.25 41.75C32.5718 41.75 41.75 32.5718 41.75 21.25C41.75 9.92816 32.5718 0.75 21.25 0.75C9.92816 0.75 0.75 9.92816 0.75 21.25C0.75 32.5718 9.92816 41.75 21.25 41.75Z"
        fill="white"
      />
      <path d="M21.25 29.45L29.45 21.25L21.25 13.05" fill="white" />
      <path
        d="M21.25 29.45L29.45 21.25M29.45 21.25L21.25 13.05M29.45 21.25L13.05 21.25M41.75 21.25C41.75 32.5718 32.5718 41.75 21.25 41.75C9.92816 41.75 0.75 32.5718 0.75 21.25C0.75 9.92816 9.92816 0.75 21.25 0.75C32.5718 0.75 41.75 9.92816 41.75 21.25Z"
        stroke="#1E1E1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HOVER_PORTAL_Z = 2147483000;

/** Expanded hover card — Figma-style two panels */
const HOVER_EXPAND_W = 618;
const HOVER_EXPAND_TOP_H = 403;
const HOVER_EXPAND_BOTTOM_H = 305;
const HOVER_EXPAND_OVERLAP = HOVER_EXPAND_BOTTOM_H - 221;
const HOVER_EXPAND_WHITE_TOP = HOVER_EXPAND_TOP_H - HOVER_EXPAND_OVERLAP;
const HOVER_EXPAND_CARD_H = HOVER_EXPAND_WHITE_TOP + HOVER_EXPAND_BOTTOM_H;

const BRIGHT_GREEN = "#89F496";

function HoverHeartGlyph({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 30" fill="none" className={className} aria-hidden>
      <path
        d="M29.4097 3.27539C28.6522 2.49062 27.7528 1.86808 26.763 1.44334C25.7731 1.0186 24.7121 0.799988 23.6407 0.799988C22.5692 0.799988 21.5082 1.0186 20.5184 1.44334C19.5285 1.86808 18.6291 2.49062 17.8717 3.27539L16.2997 4.90331L14.7276 3.27539C13.1976 1.69094 11.1224 0.800809 8.95864 0.800809C6.79485 0.800809 4.71968 1.69094 3.18965 3.27539C1.65961 4.85984 0.800049 7.00881 0.800049 9.24956C0.800049 11.4903 1.65961 13.6393 3.18965 15.2237L16.2997 28.8L29.4097 15.2237C30.1675 14.4393 30.7686 13.508 31.1788 12.4829C31.5889 11.4578 31.8 10.3591 31.8 9.24956C31.8 8.13998 31.5889 7.04127 31.1788 6.01621C30.7686 4.99114 30.1675 4.0598 29.4097 3.27539Z"
        fill="#FFF"
        stroke="var(--sds-color-icon-default-default, #1E1E1E)"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HoverLearnersGlyph({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 20" fill="none" className={className} aria-hidden>
      <path
        d="M16.2727 19V17C16.2727 15.9391 15.8705 14.9217 15.1544 14.1716C14.4384 13.4214 13.4672 13 12.4545 13H4.81818C3.80554 13 2.83437 13.4214 2.11832 14.1716C1.40227 14.9217 1 15.9391 1 17V19M22 19V17C21.9994 16.1137 21.7178 15.2528 21.1995 14.5523C20.6812 13.8519 19.9555 13.3516 19.1364 13.13M15.3182 1.13C16.1395 1.3503 16.8674 1.8507 17.3873 2.55231C17.9071 3.25392 18.1893 4.11683 18.1893 5.005C18.1893 5.89317 17.9071 6.75608 17.3873 7.45769C16.8674 8.1593 16.1395 8.6597 15.3182 8.88M12.4545 5C12.4545 7.20914 10.7451 9 8.63636 9C6.52764 9 4.81818 7.20914 4.81818 5C4.81818 2.79086 6.52764 1 8.63636 1C10.7451 1 12.4545 2.79086 12.4545 5Z"
        stroke="var(--sds-color-icon-default-default, #1E1E1E)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HoverLikeGlyph({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 22" fill="none" className={className} aria-hidden>
      <path
        d="M5.79167 9.625L9.625 1C10.3875 1 11.1188 1.3029 11.6579 1.84207C12.1971 2.38124 12.5 3.1125 12.5 3.875V7.70833H17.9242C18.202 7.70519 18.4772 7.76248 18.7307 7.87625C18.9842 7.99002 19.2099 8.15754 19.3922 8.3672C19.5745 8.57687 19.7091 8.82366 19.7865 9.09049C19.864 9.35732 19.8825 9.6378 19.8408 9.9125L18.5183 18.5375C18.449 18.9945 18.2169 19.4111 17.8647 19.7105C17.5124 20.0099 17.0639 20.1719 16.6017 20.1667H5.79167M5.79167 9.625V20.1667M5.79167 9.625H2.91667C2.40834 9.625 1.92082 9.82693 1.56138 10.1864C1.20193 10.5458 1 11.0333 1 11.5417V18.25C1 18.7583 1.20193 19.2458 1.56138 19.6053C1.92082 19.9647 2.40834 20.1667 2.91667 20.1667H5.79167"
        stroke="var(--sds-color-icon-default-default, #1E1E1E)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Portal-mounted expanded preview: bright-green + white two-panel card. */
function CatalogShowcaseHoverCard({
  visible,
  position,
  levelLabel,
  durationLabel,
  titlePrimary,
  titleSecondary,
  onHoverCardEnter,
  onHoverCardLeave,
}: {
  visible: boolean;
  position: { left: number; top: number } | null;
  levelLabel: string;
  durationLabel: string;
  titlePrimary: string;
  titleSecondary?: string;
  onHoverCardEnter: () => void;
  onHoverCardLeave: () => void;
}) {
  if (!visible || !position || typeof document === "undefined") return null;

  const pillLevelClass =
    "inline-flex h-9 shrink-0 items-center justify-center rounded-[8px] border border-black bg-white px-4 text-center text-[18px] font-normal not-italic leading-[19.6px] text-[color:var(--Text-Primary,#141413)]";
  const pillLearnersClass =
    "flex h-9 w-[164px] shrink-0 items-center justify-center gap-1.5 rounded-[8px] border border-black bg-white px-4 text-center";
  const hoverPillTextPrimary =
    "text-[18px] font-normal leading-[19.6px] text-[color:var(--Text-Primary,#141413)]";
  const pillLikesClass =
    "flex h-9 w-[79px] shrink-0 items-center justify-center gap-1.5 rounded-[8px] border border-black bg-white px-4 text-center";

  return createPortal(
    <div
      data-slot="catalog-showcase-hover-card"
      className="fixed cursor-default overflow-hidden rounded-[50px] shadow-2xl"
      style={{
        zIndex: HOVER_PORTAL_Z,
        left: position.left,
        top: position.top,
        width: HOVER_EXPAND_W,
        height: HOVER_EXPAND_CARD_H,
      }}
      aria-hidden
      onMouseEnter={onHoverCardEnter}
      onMouseLeave={onHoverCardLeave}
    >
      <div
        className="absolute inset-x-0 top-0 z-1 rounded-[50px] border border-black"
        style={{ height: HOVER_EXPAND_TOP_H, backgroundColor: BRIGHT_GREEN }}
      />

      <div
        className="absolute inset-x-0 z-2 rounded-[50px] border border-black bg-white"
        style={{ top: HOVER_EXPAND_WHITE_TOP, height: HOVER_EXPAND_BOTTOM_H }}
      />

      <div
        className="absolute inset-0 z-3 pt-[36px] pl-[49px] pr-10"
        style={{ fontFamily: pangeaFont }}
      >
        <div className="flex flex-wrap items-center gap-[10px]">
          <span className={pillLevelClass}>{levelLabel}</span>
          <span className={pillLearnersClass}>
            <HoverLearnersGlyph className="h-[18px] w-[21px] shrink-0" />
            <span className={`${hoverPillTextPrimary} italic`}>234</span>
            <span className={`${hoverPillTextPrimary} not-italic`}> Learners</span>
          </span>
          <span className={pillLikesClass}>
            <HoverLikeGlyph className="h-[19.167px] w-[18.863px] shrink-0" />
            <span className={`${hoverPillTextPrimary} not-italic`}>98%</span>
          </span>
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0 text-inherit outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/35"
            aria-label="Save"
            suppressHydrationWarning
          >
            <HoverHeartGlyph className="h-[28px] w-[31px] shrink-0" />
          </button>
          <span className="ml-auto text-[15px] font-medium text-black/80">{durationLabel}</span>
        </div>

        <p className="mt-[45px] max-w-[540px] text-[18px] font-normal not-italic leading-[normal] text-[color:var(--Black,#000)]">
          In these courses you will learn everything you need to become a professional digital artist, from basic to
          advanced.
        </p>

        <div className="mt-[40px] flex items-end gap-2 text-[32px] font-normal not-italic leading-[normal] text-[color:var(--Black,#000)]">
          <div className="flex flex-col">
            <span>{titlePrimary}</span>
            {titleSecondary ? <span>{titleSecondary}</span> : null}
          </div>
          <span className="inline-flex h-[22px] w-[22px] shrink-0 -translate-y-[10px]">
            <ExternalLinkGlyph className="h-[22px] w-[22px]" />
          </span>
        </div>

        <p className="absolute top-[372px] right-[49px] text-right text-[12px] font-medium text-black/60">
          Last Updated 3/2026
        </p>

        <div
          className="absolute bottom-7 left-[49px] flex h-[43px] w-[166px] items-center rounded-[8px] border border-[#004B3C] bg-[#004B3C] pl-4 pr-10 text-[18px] font-bold leading-none text-white"
          style={{ fontFamily: pangeaFont }}
        >
          VIEW MORE
          <span className="absolute top-[20.5px] right-[7px] inline-flex -translate-y-1/2 translate-x-1/2">
            <ViewMoreCircleGlyph className="h-[43.5px] w-[43px]" />
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Tall catalog tile (landing hero strip, learn page, grids). */
export function CatalogShowcaseCard({
  showcaseSlug,
  levelLabel = "Beginner",
  durationLabel = "12hrs",
  titlePrimary,
  titleSecondary,
  viewMoreLabel = "VIEW MORE",
  viewMoreHref,
  onViewMore,
  className = "",
}: CatalogShowcaseCardProps) {
  const [viewMoreHovered, setViewMoreHovered] = useState(false);
  const [hoverOverlayPosition, setHoverOverlayPosition] = useState<{ left: number; top: number } | null>(null);
  const cardShellRef = useRef<HTMLDivElement | null>(null);
  const hideHoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncHoverOverlayToCard = useCallback(() => {
    const el = cardShellRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setHoverOverlayPosition({
      left: r.left,
      top: r.top + r.height / 2 - HOVER_EXPAND_CARD_H / 2,
    });
  }, []);

  const cancelHideHover = useCallback(() => {
    if (hideHoverTimeoutRef.current !== null) {
      clearTimeout(hideHoverTimeoutRef.current);
      hideHoverTimeoutRef.current = null;
    }
  }, []);

  const openHover = useCallback(() => {
    cancelHideHover();
    setViewMoreHovered(true);
  }, [cancelHideHover]);

  const scheduleHideHover = useCallback(() => {
    cancelHideHover();
    hideHoverTimeoutRef.current = setTimeout(() => {
      setViewMoreHovered(false);
      setHoverOverlayPosition(null);
      hideHoverTimeoutRef.current = null;
    }, 150);
  }, [cancelHideHover]);

  useLayoutEffect(() => {
    if (viewMoreHovered) syncHoverOverlayToCard();
  }, [viewMoreHovered, syncHoverOverlayToCard]);

  useEffect(() => {
    if (!viewMoreHovered) return;
    const onScrollOrResize = () => syncHoverOverlayToCard();
    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [viewMoreHovered, syncHoverOverlayToCard]);

  useEffect(() => () => cancelHideHover(), [cancelHideHover]);

  const resolvedViewMoreHref =
    viewMoreHref && showcaseSlug ? appendShowcaseToHref(viewMoreHref, showcaseSlug) : viewMoreHref;

  const shellClass = `relative w-[347px] overflow-visible rounded-[50px] ${viewMoreHovered ? "z-[99999]" : "z-[1]"} ${className}`.trim();

  const ctaHoverHandlers = {
    onMouseEnter: openHover,
    onMouseLeave: scheduleHideHover,
  };

  const ctaClassName =
    "pointer-events-auto absolute bottom-[26px] left-[38px] z-10 flex h-[43px] w-[166px] items-center rounded-[8px] border border-[#004B3C] bg-[#004B3C] pl-4 pr-10 text-white no-underline";

  const ctaStyle = {
    fontFamily: pangeaFont,
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: "19.6px",
  } as const;

  const ctaInner = (
    <>
      {viewMoreLabel}
      <span className="absolute top-[20.5px] right-[7px] inline-flex -translate-y-1/2 translate-x-1/2 items-center justify-center">
        <ViewMoreCircleGlyph className="h-[43.5px] w-[43px]" />
      </span>
    </>
  );

  return (
    <>
      <div
        ref={cardShellRef}
        className={shellClass}
        style={{ height: SHOWCASE_CARD_H }}
        {...(showcaseSlug ? { "data-showcase-slug": showcaseSlug } : {})}
      >
        <div
          className="absolute inset-x-0 top-0 z-1 rounded-[50px] border border-black bg-[#E9E9E9]"
          style={{ height: SHOWCASE_TOP_H }}
          aria-hidden
        />

        <div
          className="absolute inset-x-0 z-2 rounded-[50px] border border-black bg-white"
          style={{ top: SHOWCASE_WHITE_TOP, height: SHOWCASE_BOTTOM_H }}
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 z-3">
          <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between pl-[38px] pr-[30px] pt-[28px]">
            <span className="inline-flex h-[36px] items-center justify-center rounded-[8px] border border-black bg-white px-4 text-[20px] leading-none text-black">
              {levelLabel}
            </span>
            <span
              className="text-[18px] font-normal leading-normal text-black opacity-60"
              style={{ fontFamily: pangeaFont }}
            >
              {durationLabel}
            </span>
          </div>

          <div
            className="pointer-events-auto absolute bottom-[351px] left-[38px] text-[32px] font-normal uppercase leading-normal text-black"
            style={{ fontFamily: pangeaFont }}
          >
            {titlePrimary}
            {titleSecondary ? (
              <>
                <br />
                {titleSecondary}
              </>
            ) : null}
            <span className="ml-2 inline-flex h-[20px] w-[20px] align-middle">
              <ExternalLinkGlyph className="h-[20px] w-[20px]" />
            </span>
          </div>

          {resolvedViewMoreHref ? (
            <Link
              href={resolvedViewMoreHref}
              className={ctaClassName}
              style={ctaStyle}
              aria-label={viewMoreLabel}
              {...ctaHoverHandlers}
            >
              {ctaInner}
            </Link>
          ) : (
            <button
              type="button"
              className={`${ctaClassName} cursor-pointer`}
              style={ctaStyle}
              onClick={onViewMore}
              suppressHydrationWarning
              {...ctaHoverHandlers}
            >
              {ctaInner}
            </button>
          )}
        </div>
      </div>

      <CatalogShowcaseHoverCard
        visible={viewMoreHovered}
        position={hoverOverlayPosition}
        levelLabel={levelLabel}
        durationLabel={durationLabel}
        titlePrimary={titlePrimary}
        titleSecondary={titleSecondary}
        onHoverCardEnter={openHover}
        onHoverCardLeave={scheduleHideHover}
      />
    </>
  );
}
