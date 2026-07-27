"use client";

import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useRef, useState } from "react";
import type { FocusEvent, MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";

/** `var(--sds-color-icon-default-default)` */
const ICON_STROKE = "#1E1E1E";

/** Renders configurable size: artwork uses 43×43 viewBox, stroke 1.5px, fills #FFF. */
function LearnPopularStartArrowIcon({ size = 41 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 43 43"
      fill="none"
      className="shrink-0 -ml-[25px]"
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

const pangeaVar = localFont({
  src: "../../../public/fonts/FwTRIAL-PangeaVAR.woff2",
  display: "swap",
  weight: "100 900",
  style: "normal",
});

const pangeaFont = `${pangeaVar.style.fontFamily}, var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif`;

const LEARNER_AVATAR_COLORS = ["#FFFFFF", "#89F496", "#66E0F2"] as const;
const LEARNER_AVATAR_INITIALS = ["AM", "RK", "YT"] as const;

function LearnPopularLearnerAvatar({
  fill,
  initials,
  size = 41,
  className,
}: {
  fill: string;
  initials: string;
  size?: number;
  className?: string;
}) {
  const textFill = "#000000";
  const fontSize = Math.round(size * 0.34);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 41 41"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M20.5 40.5C31.5457 40.5 40.5 31.5457 40.5 20.5C40.5 9.4543 31.5457 0.5 20.5 0.5C9.4543 0.5 0.5 9.4543 0.5 20.5C0.5 31.5457 9.4543 40.5 20.5 40.5Z"
        fill={fill}
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="20.5"
        y="21"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textFill}
        style={{
          fontFamily: pangeaFont,
          fontSize,
          fontWeight: 500,
          letterSpacing: "-0.02em",
        }}
      >
        {initials}
      </text>
    </svg>
  );
}

/** Figma `167:1726` — Rectangle 53: 346×377, #e9e9e9, border, rounded-[50px]. */
const GRAY_H = 377;
/** Pixels to pull the white panel up so its top sits at 166px (377 − 166). */
const WHITE_PULL_UP = GRAY_H - 166;

export const LEARN_POPULAR_FIGMA_TILE_W = 346;
/** Legacy fixed height (≈447); slides use `height: auto` — kept for callers that need a minimum. */
export const LEARN_POPULAR_FIGMA_TILE_H = 166 + 281;

/** Overlap between image and white panel as a fraction of card width (211px at 346px wide). */
const GRID_PANEL_OVERLAP = `-${(WHITE_PULL_UP / LEARN_POPULAR_FIGMA_TILE_W) * 100}%`;

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

const POPULAR_CLASS_COVER_IMAGE = "/learn/popular-class-cover.png";
/** Between center and top so faces/subjects stay in the visible band above the white panel. */
const POPULAR_COVER_OBJECT_POSITION = "center 38%";

export function LearnPopularFigmaTile(
  props: LearnPopularTile & { className?: string; size?: "default" | "grid" }
) {
  const {
    href,
    title,
    authorLabel,
    tagPrimary,
    coverImageSrc,
    progressPercent,
    className = "",
    size = "default",
  } = props;
  const isGrid = size === "grid";
  const completionLabel =
    progressPercent != null
      ? `${Math.min(100, Math.max(0, Math.round(progressPercent)))}%`
      : "98%";
  const grayCoverSrc = coverImageSrc?.trim() || POPULAR_CLASS_COVER_IMAGE;
  const [isStartHovered, setIsStartHovered] = useState(false);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const containerRef = useRef<HTMLAnchorElement | null>(null);
  const bottomScrollRef = useRef<HTMLDivElement | null>(null);
  const [bottomScrollRatio, setBottomScrollRatio] = useState(0);
  const dragStartYRef = useRef(0);
  const dragStartScrollTopRef = useRef(0);

  const CUSTOM_TRACK_HEIGHT = 637;
  const CUSTOM_THUMB_HEIGHT = 160;
  const CUSTOM_SCROLL_SHAFT_WIDTH = 5;
  const CUSTOM_SCROLL_BOX_WIDTH = 16;
  const customThumbTop = bottomScrollRatio * (CUSTOM_TRACK_HEIGHT - CUSTOM_THUMB_HEIGHT);

  const beginContentDragScroll = (e: MouseEvent<HTMLDivElement>) => {
    const el = bottomScrollRef.current;
    if (!el) return;
    dragStartYRef.current = e.clientY;
    dragStartScrollTopRef.current = el.scrollTop;
    const onMove = (ev: globalThis.MouseEvent) => {
      const deltaY = ev.clientY - dragStartYRef.current;
      el.scrollTop = dragStartScrollTopRef.current - deltaY;
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const beginThumbDragScroll = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = bottomScrollRef.current;
    if (!el) return;
    const startY = e.clientY;
    const startRatio = bottomScrollRatio;
    const onMove = (ev: globalThis.MouseEvent) => {
      const deltaY = ev.clientY - startY;
      const nextRatio = Math.min(1, Math.max(0, startRatio + deltaY / (CUSTOM_TRACK_HEIGHT - CUSTOM_THUMB_HEIGHT)));
      const max = el.scrollHeight - el.clientHeight;
      el.scrollTop = nextRatio * max;
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  useEffect(() => {
    if (!isLearnMoreOpen) return;
    const el = bottomScrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) {
        setBottomScrollRatio(0);
        return;
      }
      setBottomScrollRatio(el.scrollTop / max);
    };
    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isLearnMoreOpen]);

  const bringSlideToFront = (el: HTMLElement) => {
    const slide = el.closest(".swiper-slide") as HTMLElement | null;
    if (slide) {
      slide.style.position = "relative";
      slide.style.zIndex = "2000";
      return;
    }
    const trendingTile = el.closest(".learn-trending-tile") as HTMLElement | null;
    if (trendingTile) {
      trendingTile.style.position = "relative";
      trendingTile.style.zIndex = "2000";
    }
  };

  const unlockOverflowForHoverCard = (el: HTMLElement) => {
    const swiperRoot = el.closest(".learn-popular-swiper--cards") as HTMLElement | null;
    if (swiperRoot) {
      swiperRoot.style.overflowX = "visible";
      swiperRoot.style.overflowY = "visible";
      const viewport = swiperRoot.parentElement;
      if (viewport) {
        viewport.style.overflowX = "visible";
        viewport.style.overflowY = "visible";
      }
      return;
    }
    const trendingRoot = el.closest(".learn-trending-marquee") as HTMLElement | null;
    if (!trendingRoot) return;
    trendingRoot.style.overflowX = "visible";
    trendingRoot.style.overflowY = "visible";
  };

  const resetSlideStacking = (el: HTMLElement) => {
    const slide = el.closest(".swiper-slide") as HTMLElement | null;
    if (slide) {
      slide.style.zIndex = "";
      return;
    }
    const trendingTile = el.closest(".learn-trending-tile") as HTMLElement | null;
    if (trendingTile) trendingTile.style.zIndex = "";
  };

  const restoreOverflowAfterHoverCard = (el: HTMLElement) => {
    const swiperRoot = el.closest(".learn-popular-swiper--cards") as HTMLElement | null;
    if (swiperRoot) {
      swiperRoot.style.overflowX = "";
      swiperRoot.style.overflowY = "";
      const viewport = swiperRoot.parentElement;
      if (viewport) {
        viewport.style.overflowX = "";
        viewport.style.overflowY = "";
      }
      return;
    }
    const trendingRoot = el.closest(".learn-trending-marquee") as HTMLElement | null;
    if (!trendingRoot) return;
    trendingRoot.style.overflowX = "";
    trendingRoot.style.overflowY = "";
  };

  const activateHover = (el: HTMLElement) => {
    if (isGrid) return;
    setIsStartHovered(true);
    bringSlideToFront(el);
    unlockOverflowForHoverCard(el);
  };

  const deactivateHover = (el: HTMLElement) => {
    if (isGrid) return;
    setIsStartHovered(false);
    resetSlideStacking(el);
    restoreOverflowAfterHoverCard(el);
  };

  const cardLink = (
      <Link
        ref={containerRef}
        href={href}
        aria-label={`${title}. ${authorLabel}. ${tagPrimary}. Start`}
        className={
          isGrid
            ? `relative flex h-full w-full flex-col overflow-hidden no-underline ${className}`.trim()
            : `relative flex w-[346px] shrink-0 flex-col overflow-visible no-underline ${isStartHovered ? "z-1000" : "z-0"} ${className}`.trim()
        }
        onMouseLeave={
          isGrid ? undefined : (e: MouseEvent<HTMLAnchorElement>) => deactivateHover(e.currentTarget)
        }
        onBlur={
          isGrid ? undefined : (e: FocusEvent<HTMLAnchorElement>) => deactivateHover(e.currentTarget)
        }
      >
      {!isGrid && isStartHovered ? (
        <div
          className="absolute left-0 top-1/2 z-1001 -translate-y-1/2"
          style={{ position: "absolute", width: "608px", height: "567px" }}
          onMouseEnter={() => setIsStartHovered(true)}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button — visible on touch screens so users can dismiss without navigating */}
          <button
            type="button"
            aria-label="Close preview"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (containerRef.current) deactivateHover(containerRef.current);
            }}
            className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
            style={{ fontSize: "20px", lineHeight: 1 }}
          >
            ✕
          </button>
          <div
            className="absolute left-0 top-0 z-10 overflow-hidden rounded-[50px] border border-black bg-[#E9E9E9]"
            style={{ width: "608px", height: "444px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={grayCoverSrc}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: POPULAR_COVER_OBJECT_POSITION }}
            />
          </div>
          <div
            className="absolute left-0 top-[195px] z-20 rounded-[50px] border border-black bg-[#89F496]"
            style={{ width: "608px", height: "372px" }}
          >
            <div
              className="box-border"
              style={{
                paddingTop: "30px",
                paddingLeft: "48px",
              }}
            >
              <div className="flex items-start">
                <div
                  className="inline-flex h-[35px] items-center justify-center rounded-[8px] border border-black bg-white px-4"
                  style={{ fontFamily: pangeaFont }}
                >
                  <span
                    style={{
                      color: "var(--Text-Primary, #141413)",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "19.6px",
                    }}
                  >
                    Beginner
                  </span>
                </div>

                <div className="relative ml-[11px] h-[40px] w-[183px] overflow-visible">
                  <div
                    className="absolute left-[19px] top-[2px] flex h-[36px] w-[164px] items-center rounded-[8px] border border-black bg-white"
                    style={{ fontFamily: pangeaFont }}
                  />

                  <LearnPopularLearnerAvatar
                    fill={LEARNER_AVATAR_COLORS[0]}
                    initials={LEARNER_AVATAR_INITIALS[0]}
                    size={40}
                    className="absolute left-0 top-0"
                  />
                  <LearnPopularLearnerAvatar
                    fill={LEARNER_AVATAR_COLORS[1]}
                    initials={LEARNER_AVATAR_INITIALS[1]}
                    size={40}
                    className="absolute left-[15px] top-0"
                  />
                  <LearnPopularLearnerAvatar
                    fill={LEARNER_AVATAR_COLORS[2]}
                    initials={LEARNER_AVATAR_INITIALS[2]}
                    size={40}
                    className="absolute left-[31px] top-0"
                  />

                  <span
                    className="absolute left-[70px] top-[9px] leading-none text-black"
                    style={{
                      fontFamily: pangeaFont,
                      fontSize: "18px",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    <span style={{ fontStyle: "italic" }}>+24</span>{" "}
                    <span style={{ fontStyle: "normal" }}>learners</span>
                  </span>
                </div>

                <div
                  className="ml-[9px] flex h-[36px] w-[79px] items-center justify-center rounded-[8px] border border-black bg-white"
                  style={{ fontFamily: pangeaFont }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18.863"
                    height="19.167"
                    viewBox="0 0 21 22"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M5.79167 9.625L9.625 1C10.3875 1 11.1188 1.3029 11.6579 1.84207C12.1971 2.38124 12.5 3.1125 12.5 3.875V7.70833H17.9242C18.202 7.70519 18.4772 7.76248 18.7307 7.87625C18.9842 7.99002 19.2099 8.15754 19.3922 8.3672C19.5745 8.57687 19.7091 8.82366 19.7865 9.09049C19.864 9.35732 19.8825 9.6378 19.8408 9.9125L18.5183 18.5375C18.449 18.9945 18.2169 19.4111 17.8647 19.7105C17.5124 20.0099 17.0639 20.1719 16.6017 20.1667H5.79167M5.79167 9.625V20.1667M5.79167 9.625H2.91667C2.40834 9.625 1.92082 9.82693 1.56138 10.1864C1.20193 10.5458 1 11.0333 1 11.5417V18.25C1 18.7583 1.20193 19.2458 1.56138 19.6053C1.92082 19.9647 2.40834 20.1667 2.91667 20.1667H5.79167"
                      stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="ml-[6px] text-black"
                    style={{
                      fontFamily: pangeaFont,
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    98%
                  </span>
                </div>

                <div className="ml-[9px] flex h-[28px] w-[31px] self-center items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="31"
                    height="28"
                    viewBox="0 0 33 30"
                    fill="none"
                    className="block h-[28px] w-[31px]"
                    aria-hidden
                  >
                    <path
                      d="M29.4097 3.27545C28.6522 2.49068 27.7528 1.86814 26.763 1.4434C25.7731 1.01866 24.7121 0.800049 23.6407 0.800049C22.5692 0.800049 21.5082 1.01866 20.5184 1.4434C19.5285 1.86814 18.6291 2.49068 17.8717 3.27545L16.2997 4.90337L14.7276 3.27545C13.1976 1.691 11.1224 0.80087 8.95864 0.80087C6.79485 0.80087 4.71968 1.691 3.18965 3.27545C1.65961 4.8599 0.800049 7.00887 0.800049 9.24962C0.800049 11.4904 1.65961 13.6393 3.18965 15.2238L16.2997 28.8L29.4097 15.2238C30.1675 14.4394 30.7686 13.508 31.1788 12.483C31.5889 11.4579 31.8 10.3592 31.8 9.24962C31.8 8.14004 31.5889 7.04133 31.1788 6.01627C30.7686 4.9912 30.1675 4.05986 29.4097 3.27545Z"
                      fill="#FFF"
                      stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <p
                className="m-0"
                style={{
                  marginTop: "19px",
                  width: "274px",
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                How to Master Digital Illustration Techniques
              </p>

              <p
                className="m-0"
                style={{
                  marginTop: "6px",
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  opacity: 0.6,
                }}
              >
                Ahmad Khaled Hussein
              </p>

              <p
                className="m-0"
                style={{
                  marginTop: "13px",
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  opacity: 0.6,
                }}
              >
                {authorLabel}
              </p>

              <p
                className="m-0"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                1. BRUSH TECHNIQUES
              </p>

              <div className="mt-[22px] flex items-center">
                <button
                  type="button"
                  className="inline-flex h-[47px] items-center rounded-[8px] border border-black bg-white px-4"
                  style={{ fontFamily: pangeaFont }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsLearnMoreOpen(true);
                  }}
                >
                  <span
                    style={{
                      color: "var(--Text-Primary, #141413)",
                      fontSize: "24px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "19.6px",
                    }}
                  >
                    LEARN MORE
                  </span>
                </button>

                <div className="ml-[13px] flex items-center">
                  <span
                    className="inline-flex h-[47px] w-[106px] shrink-0 items-center justify-center rounded-[8px] border border-[#004B3C] bg-[#004B3C] text-white"
                    style={{
                      fontFamily: pangeaFont,
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "var(--Line-height-Heading-sm,19.6px)",
                      padding: "0 16px",
                    }}
                  >
                    <span className="inline-block -translate-x-[3px]">START</span>
                  </span>
                  <LearnPopularStartArrowIcon size={47} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={`relative shrink-0 overflow-hidden rounded-[50px] border border-black bg-[#E9E9E9]${isStartHovered ? " opacity-0" : ""}`}
        style={
          isGrid
            ? { width: "100%", aspectRatio: `${LEARN_POPULAR_FIGMA_TILE_W} / ${GRAY_H}` }
            : { width: LEARN_POPULAR_FIGMA_TILE_W, height: GRAY_H }
        }
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={grayCoverSrc}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: POPULAR_COVER_OBJECT_POSITION }}
        />
      </div>
      <div
        className={`relative z-10 flex w-full flex-col rounded-[50px] border border-black bg-white${isGrid ? " flex-1" : ""}${isStartHovered ? " opacity-0" : ""}`}
        style={
          isGrid
            ? {
                marginTop: GRID_PANEL_OVERLAP,
                paddingTop: WHITE_INNER_PT,
                paddingBottom: 26,
                paddingLeft: "9%",
                paddingRight: "9%",
                fontFamily: pangeaFont,
              }
            : {
                marginTop: -WHITE_PULL_UP,
                width: LEARN_POPULAR_FIGMA_TILE_W,
                paddingTop: WHITE_INNER_PT,
                paddingBottom: 26,
                paddingLeft: 37,
                paddingRight: 37,
                fontFamily: pangeaFont,
              }
        }
      >
        <div className={`flex flex-col gap-[5px]${isGrid ? " min-h-[68px]" : " max-w-[274px]"}`}>
          <p
            className={`m-0 max-w-full font-normal not-italic leading-normal text-black${isGrid ? " line-clamp-2 text-[16px]" : " text-[18px]"}`}
          >
            {title}
          </p>
          <p
            className={`m-0 font-normal not-italic leading-normal text-black opacity-60${isGrid ? " text-[14px]" : " text-[16px]"}`}
            style={isGrid ? undefined : { maxWidth: AUTHOR_MAX_W }}
          >
            {authorLabel}
          </p>
        </div>
        <div
          className="inline-flex w-max max-w-full items-center justify-center self-start rounded-[8px] border border-solid border-black bg-white px-4"
          style={{
            height: TAG_PRIMARY_H,
            maxWidth: isGrid ? "100%" : TAG_PILL_MAX_W,
            marginTop: GAP_AUTHOR_TO_TAG,
            fontFamily: pangeaFont,
          }}
        >
          <span className="min-w-0 truncate text-center text-[16px] font-medium not-italic leading-[19.6px] text-black uppercase">
            {tagPrimary}
          </span>
        </div>
        {isGrid && progressPercent != null ? (
          <div className="mt-3 w-full" aria-label={`Course completion: ${completionLabel}`}>
            <div className="mb-1 flex items-center justify-between text-[12px] text-black/60">
              <span style={{ fontFamily: pangeaFont }}>Progress</span>
              <span className="tabular-nums font-medium text-black/80" style={{ fontFamily: pangeaFont }}>
                {completionLabel}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                }}
              />
            </div>
          </div>
        ) : null}
        <div
          className={`flex flex-wrap items-center self-start${isGrid ? " mt-auto" : ""}`}
          style={isGrid ? { marginTop: GAP_TAG_TO_START } : { marginTop: GAP_TAG_TO_START }}
        >
          <span
            className="inline-flex h-[42px] w-[106px] shrink-0 items-center justify-center rounded-[8px] border border-[#004B3C] bg-[#004B3C] text-white"
            onMouseEnter={
              isGrid ? undefined : (e: MouseEvent<HTMLSpanElement>) => activateHover(e.currentTarget)
            }
            onFocus={
              isGrid ? undefined : (e: FocusEvent<HTMLSpanElement>) => activateHover(e.currentTarget)
            }
            onClick={
              isGrid
                ? undefined
                : (e: MouseEvent<HTMLSpanElement>) => {
                    if (!isStartHovered) {
                      e.preventDefault();
                      e.stopPropagation();
                      activateHover(e.currentTarget);
                    }
                  }
            }
            style={{
              fontFamily: pangeaFont,
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "var(--Line-height-Heading-sm,19.6px)",
              padding: "0 16px",
            }}
          >
            <span className="inline-block -translate-x-[3px]">START</span>
          </span>
          <LearnPopularStartArrowIcon />
          {!(isGrid && progressPercent != null) ? (
            <div className="ml-[11px] flex items-center gap-[7px]">
              <LearnPopularTileLikeBadge />
              <span
                className="text-[16px] font-normal not-italic leading-normal text-black opacity-60"
                style={{ fontFamily: pangeaFont, color: "var(--Black, #000)" }}
              >
                {completionLabel}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      </Link>
  );

  return (
    <>
      {cardLink}

      {!isGrid && isLearnMoreOpen ? (
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed left-0 top-0 z-99999 flex h-screen w-screen items-center justify-center overflow-y-auto bg-black/60 px-[20px] py-[50px]"
            role="dialog"
            aria-modal
            aria-label="Course details"
            onClick={() => setIsLearnMoreOpen(false)}
          >
            <div
              className="relative w-[1171px]"
              style={{ height: "1158px", maxHeight: "calc(100vh - 100px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute left-0 top-0 z-10 flex h-[469px] w-[1171px] items-center justify-center border border-black bg-[#E9E9E9]"
                style={{ borderRadius: "50px 50px 0 0" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="151" height="150" viewBox="0 0 154 153" fill="none" aria-hidden>
                  <path
                    d="M77 151.5C118.698 151.5 152.5 117.921 152.5 76.5C152.5 35.0786 118.698 1.5 77 1.5C35.3025 1.5 1.5 35.0786 1.5 76.5C1.5 117.921 35.3025 151.5 77 151.5Z"
                    stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M61.9 46.5L107.2 76.5L61.9 106.5V46.5Z"
                    stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div
                className="absolute left-0 top-[407px] z-20 h-[751px] w-[1171px] rounded-[50px] border border-black bg-[#89F496]"
              >
                <div className="pointer-events-none absolute left-[775px] top-0 h-full w-px bg-black opacity-60" />
                <div
                  ref={bottomScrollRef}
                  className="no-scrollbar absolute left-[40px] right-[44px] top-0 bottom-0 cursor-grab overflow-y-auto overflow-x-hidden active:cursor-grabbing"
                  onMouseDown={beginContentDragScroll}
                >
                  <div style={{ minHeight: "1400px", paddingBottom: "50px", fontFamily: pangeaFont, color: "#000" }}>
                    <div className="grid w-full" style={{ gridTemplateColumns: "1fr 350px" }}>
                      <div className="pt-[45px] pr-[20px]">
                        <h2
                          className="m-0"
                          style={{
                            width: "665px",
                            color: "var(--Black, #000)",
                            fontFamily: pangeaFont,
                            fontSize: "36px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "normal",
                          }}
                        >
                          ILLUSTRATION 101 - How to Master Digital and Analog Illustration Techniques
                        </h2>

                        <h3
                          className="m-0 mt-[20px] whitespace-nowrap"
                          style={{
                            width: "176px",
                            color: "var(--Black, #000)",
                            fontFamily: pangeaFont,
                            fontSize: "24px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "normal",
                            opacity: 0.6,
                          }}
                        >
                          About this class
                        </h3>
                        <p
                          className="m-0 mt-[19px] whitespace-pre-line"
                          style={{
                            width: "661px",
                            color: "var(--Black, #000)",
                            fontFamily: pangeaFont,
                            fontSize: "24px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "normal",
                          }}
                        >
                          {`The Ultimate Digital Painting Course will show you how to create advanced art that will stand up as professional work. This course will enhance or give you skills in the world of Digital Painting - or your money back.

The course is your track to obtaining digital drawing & painting skills like you always knew you should have! Whether for your own projects or to paint for clients.

This course will take you from having little knowledge in digital painting and drawing to creating advanced art and having a deep understanding of drawing fundamentals.`}
                        </p>

                        <h3
                          className="m-0 mt-[42px]"
                          style={{
                            color: "var(--Black, #000)",
                            fontFamily: pangeaFont,
                            fontSize: "24px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "normal",
                            opacity: 0.6,
                          }}
                        >
                          Requirements
                        </h3>
                        <ul
                          className="m-0 mt-[13px] list-disc pl-8"
                          style={{
                            color: "var(--Black, #000)",
                            fontFamily: pangeaFont,
                            fontSize: "24px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "normal",
                          }}
                        >
                          <li>Drawing Tablet or iPad</li>
                          <li>Digital Painting Software</li>
                        </ul>

                        <h3
                          className="m-0 mt-[42px]"
                          style={{
                            color: "var(--Black, #000)",
                            fontFamily: pangeaFont,
                            fontSize: "24px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "normal",
                            opacity: 0.6,
                          }}
                        >
                          Why this course
                        </h3>

                        <div className="mt-[23px] flex w-[700px] flex-col gap-[22px]">
                          <div className="relative h-[323px] rounded-[36px] border border-black bg-white">
                            <div className="pl-[45px] pt-[28px]">
                              <p
                                className="m-0"
                                style={{
                                  color: "#000",
                                  fontFamily: pangeaFont,
                                  fontSize: "48px",
                                  fontStyle: "normal",
                                  fontWeight: 400,
                                  lineHeight: "120%",
                                }}
                              >
                                "
                              </p>
                              <p
                                className="m-0"
                                style={{
                                  width: "369px",
                                  color: "var(--Black, #000)",
                                  fontFamily: pangeaFont,
                                  fontSize: "18px",
                                  fontStyle: "normal",
                                  fontWeight: 400,
                                  lineHeight: "normal",
                                }}
                              >
                                This class helped me understand that I already have a style within me... and all I need to
                                do is trust myself and my process. The exercises and the way Ali explains them are awesome.
                                Thank you for sharing.
                              </p>
                              <div className="mt-[22px] flex items-center">
                                <div className="relative h-[71px] w-[71px]">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="71" height="71" viewBox="0 0 72 72" fill="none" aria-hidden>
                                    <path
                                      d="M36 71.5C55.6061 71.5 71.5 55.6061 71.5 36C71.5 16.3939 55.6061 0.5 36 0.5C16.3939 0.5 0.5 16.3939 0.5 36C0.5 55.6061 16.3939 71.5 36 71.5Z"
                                      fill="white"
                                      stroke="black"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span
                                    className="absolute inset-0 flex items-center justify-center"
                                    style={{
                                      color: "#000",
                                      fontFamily: pangeaFont,
                                      fontSize: "32px",
                                      fontStyle: "normal",
                                      fontWeight: 600,
                                      lineHeight: "normal",
                                    }}
                                  >
                                    MS
                                  </span>
                                </div>
                                <div className="ml-[12px]">
                                  <p
                                    className="m-0"
                                    style={{
                                      color: "var(--Black, #000)",
                                      fontFamily: pangeaFont,
                                      fontSize: "20px",
                                      fontStyle: "normal",
                                      fontWeight: 400,
                                      lineHeight: "normal",
                                    }}
                                  >
                                    MOHAMED SABRY
                                  </p>
                                  <p
                                    className="m-0"
                                    style={{
                                      color: "var(--Black, #000)",
                                      fontFamily: pangeaFont,
                                      fontSize: "20px",
                                      fontStyle: "normal",
                                      fontWeight: 400,
                                      lineHeight: "normal",
                                      opacity: 0.6,
                                    }}
                                  >
                                    Graphic designer
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="absolute right-[33px] top-[29px] h-[253px] w-[226px] rounded-[36px] border border-black bg-[#E7E7E7]" />
                          </div>
                          <div className="relative h-[323px] rounded-[36px] border border-black bg-white">
                            <div className="pl-[45px] pt-[28px]">
                              <p
                                className="m-0"
                                style={{
                                  color: "#000",
                                  fontFamily: pangeaFont,
                                  fontSize: "48px",
                                  fontStyle: "normal",
                                  fontWeight: 400,
                                  lineHeight: "120%",
                                }}
                              >
                                "
                              </p>
                              <p
                                className="m-0"
                                style={{
                                  width: "369px",
                                  color: "var(--Black, #000)",
                                  fontFamily: pangeaFont,
                                  fontSize: "18px",
                                  fontStyle: "normal",
                                  fontWeight: 400,
                                  lineHeight: "normal",
                                }}
                              >
                                This class helped me understand that I already have a style within me... and all I need to
                                do is trust myself and my process. The exercises and the way Ali explains them are awesome.
                                Thank you for sharing.
                              </p>
                              <div className="mt-[22px] flex items-center">
                                <div className="relative h-[71px] w-[71px]">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="71" height="71" viewBox="0 0 72 72" fill="none" aria-hidden>
                                    <path
                                      d="M36 71.5C55.6061 71.5 71.5 55.6061 71.5 36C71.5 16.3939 55.6061 0.5 36 0.5C16.3939 0.5 0.5 16.3939 0.5 36C0.5 55.6061 16.3939 71.5 36 71.5Z"
                                      fill="white"
                                      stroke="black"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span
                                    className="absolute inset-0 flex items-center justify-center"
                                    style={{
                                      color: "#000",
                                      fontFamily: pangeaFont,
                                      fontSize: "32px",
                                      fontStyle: "normal",
                                      fontWeight: 600,
                                      lineHeight: "normal",
                                    }}
                                  >
                                    MS
                                  </span>
                                </div>
                                <div className="ml-[12px]">
                                  <p
                                    className="m-0"
                                    style={{
                                      color: "var(--Black, #000)",
                                      fontFamily: pangeaFont,
                                      fontSize: "20px",
                                      fontStyle: "normal",
                                      fontWeight: 400,
                                      lineHeight: "normal",
                                    }}
                                  >
                                    MOHAMED SABRY
                                  </p>
                                  <p
                                    className="m-0"
                                    style={{
                                      color: "var(--Black, #000)",
                                      fontFamily: pangeaFont,
                                      fontSize: "20px",
                                      fontStyle: "normal",
                                      fontWeight: 400,
                                      lineHeight: "normal",
                                      opacity: 0.6,
                                    }}
                                  >
                                    Graphic designer
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="absolute right-[33px] top-[29px] h-[253px] w-[226px] rounded-[36px] border border-black bg-[#E7E7E7]" />
                          </div>
                        </div>
                      </div>

                      <div className="h-full w-[350px] overflow-hidden p-0">
                        <div className="flex items-center gap-[16px] border-b border-black/60 pb-[27px] pl-[30px] pt-[35px]">
                          <div className="relative h-[63px] w-[63px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="63" height="63" viewBox="0 0 64 64" fill="none" className="h-[63px] w-[63px]" aria-hidden>
                              <path
                                d="M32 63.5C49.397 63.5 63.5 49.397 63.5 32C63.5 14.603 49.397 0.5 32 0.5C14.603 0.5 0.5 14.603 0.5 32C0.5 49.397 14.603 63.5 32 63.5Z"
                                fill="white"
                                stroke="black"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[24px] font-semibold">AK</span>
                          </div>
                          <div>
                            <p
                              className="m-0"
                              style={{
                                color: "var(--Black, #000)",
                                fontFamily: pangeaFont,
                                fontSize: "24px",
                                fontStyle: "normal",
                                fontWeight: 600,
                                lineHeight: "normal",
                              }}
                            >
                              AHMAD KHALED
                            </p>
                            <p
                              className="m-0"
                              style={{
                                color: "var(--Black, #000)",
                                fontFamily: pangeaFont,
                                fontSize: "24px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                                opacity: 0.6,
                              }}
                            >
                              Illustrator
                            </p>
                          </div>
                        </div>

                        <div className="h-[452px] border-b border-black/60 pb-4 pl-[30px] pr-[45px] pt-[16px]">
                          <h4
                            className="m-0"
                            style={{
                              color: "var(--Black, #000)",
                              fontFamily: pangeaFont,
                              fontSize: "24px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "normal",
                            }}
                          >
                            Class details
                          </h4>

                          <div className="mt-[20px] flex items-center justify-between">
                            <span style={{ fontFamily: pangeaFont, fontSize: "24px", fontWeight: 400 }}>Level</span>
                            <span style={{ fontFamily: pangeaFont, fontSize: "24px", fontWeight: 500 }}>
                              Beginner
                            </span>
                          </div>

                          <div className="mt-[25px] flex items-center justify-between">
                            <span style={{ fontFamily: pangeaFont, fontSize: "24px", fontWeight: 400 }}>Rating</span>
                            <span className="inline-flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="23" viewBox="0 0 29 26" fill="none" aria-hidden>
                                <path
                                  d="M8.1048 11.8499L13.3886 1.5C14.4397 1.5 15.4476 1.86348 16.1908 2.51048C16.934 3.15747 17.3515 4.03499 17.3515 4.94998V9.54995H24.8282C25.2111 9.54617 25.5904 9.61493 25.9398 9.75145C26.2893 9.88797 26.6004 10.089 26.8517 10.3406C27.103 10.5922 27.2885 10.8883 27.3952 11.2085C27.502 11.5287 27.5276 11.8653 27.4701 12.1949L25.6472 22.5449C25.5516 23.0933 25.2316 23.5932 24.7461 23.9525C24.2606 24.3117 23.6424 24.5061 23.0052 24.4999H8.1048M8.1048 11.8499V24.4999M8.1048 11.8499H4.14192C3.44124 11.8499 2.76926 12.0923 2.2738 12.5236C1.77834 12.9549 1.5 13.5399 1.5 14.1499V22.1999C1.5 22.8099 1.77834 23.3949 2.2738 23.8262C2.76926 24.2575 3.44124 24.4999 4.14192 24.4999H8.1048"
                                  stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="ml-[6px]" style={{ fontFamily: pangeaFont, fontSize: "24px", fontWeight: 500 }}>
                                98%
                              </span>
                            </span>
                          </div>

                          <div className="mt-[25px] flex items-center justify-between">
                            <span style={{ fontFamily: pangeaFont, fontSize: "24px", fontWeight: 400 }}>Duration</span>
                            <span className="inline-flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 28 28" fill="none" aria-hidden>
                                <path
                                  d="M14 6.5V14L19 16.5M26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5C20.9036 1.5 26.5 7.09644 26.5 14Z"
                                  stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="ml-[6px]" style={{ fontFamily: pangeaFont, fontSize: "24px", fontWeight: 500 }}>
                                35mins
                              </span>
                            </span>
                          </div>

                          <div className="mt-[37px]">
                            <div className="relative inline-flex">
                              <Link
                                href={href}
                                className="flex h-[64px] w-[170px] items-center justify-start rounded-[8px] border-2 border-black bg-[#EA83F0] pl-[16px] no-underline"
                                onClick={() => setIsLearnMoreOpen(false)}
                              >
                                <span
                                  style={{
                                    color: "var(--Text-Primary, #141413)",
                                    fontFamily: pangeaFont,
                                    fontSize: "32px",
                                    fontStyle: "normal",
                                    fontWeight: 700,
                                    lineHeight: "19.6px",
                                  }}
                                >
                                  START
                                </span>
                              </Link>

                              <span className="pointer-events-none absolute right-[-28px] top-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 65 65" fill="none" aria-hidden>
                                  <path
                                    d="M32.25 63.25C49.3708 63.25 63.25 49.3708 63.25 32.25C63.25 15.1292 49.3708 1.25 32.25 1.25C15.1292 1.25 1.25 15.1292 1.25 32.25C1.25 49.3708 15.1292 63.25 32.25 63.25Z"
                                    fill="#FFF"
                                  />
                                  <path d="M32.25 44.65L44.65 32.25L32.25 19.85" fill="#FFF" />
                                  <path
                                    d="M32.25 44.65L44.65 32.25M44.65 32.25L32.25 19.85M44.65 32.25L19.85 32.25M63.25 32.25C63.25 49.3708 49.3708 63.25 32.25 63.25C15.1292 63.25 1.25 49.3708 1.25 32.25C1.25 15.1292 15.1292 1.25 32.25 1.25C49.3708 1.25 63.25 15.1292 63.25 32.25Z"
                                    stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>

                              <span className="absolute left-[calc(100%+37px)] top-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="50" viewBox="0 0 58 52" fill="none" aria-hidden>
                                  <path
                                    d="M52.6819 5.42036C51.3135 4.01898 49.6889 2.9073 47.9008 2.14884C46.1126 1.39038 44.196 1 42.2605 1C40.3249 1 38.4083 1.39038 36.6202 2.14884C34.832 2.9073 33.2074 4.01898 31.8391 5.42036L28.9993 8.32737L26.1595 5.42036C23.3956 2.59099 19.6469 1.00147 15.7381 1.00147C11.8293 1.00147 8.08062 2.59099 5.31669 5.42036C2.55276 8.24973 1 12.0872 1 16.0885C1 20.0899 2.55276 23.9273 5.31669 26.7567L28.9993 51L52.6819 26.7567C54.0508 25.356 55.1368 23.6928 55.8777 21.8624C56.6186 20.0319 57 18.0699 57 16.0885C57 14.1071 56.6186 12.1452 55.8777 10.3147C55.1368 8.4842 54.0508 6.82109 52.6819 5.42036Z"
                                    fill="#FFF"
                                    stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>

                          <div className="mt-[37px] flex items-center">
                            <div className="relative h-[54.258px] w-[86px]">
                              <LearnPopularLearnerAvatar
                                fill={LEARNER_AVATAR_COLORS[0]}
                                initials={LEARNER_AVATAR_INITIALS[0]}
                                size={54.258}
                                className="absolute left-0 top-0"
                              />
                              <LearnPopularLearnerAvatar
                                fill={LEARNER_AVATAR_COLORS[1]}
                                initials={LEARNER_AVATAR_INITIALS[1]}
                                size={54.258}
                                className="absolute left-[16px] top-0"
                              />
                              <LearnPopularLearnerAvatar
                                fill={LEARNER_AVATAR_COLORS[2]}
                                initials={LEARNER_AVATAR_INITIALS[2]}
                                size={54.258}
                                className="absolute left-[32px] top-0"
                              />
                            </div>
                            <span
                              className="ml-[35px] whitespace-nowrap"
                              style={{ fontFamily: pangeaFont, fontSize: "24px", fontWeight: 400, lineHeight: "normal" }}
                            >
                              Join<span style={{ fontStyle: "italic" }}>+24</span> Learners
                            </span>
                          </div>
                        </div>

                        <div className="pt-[20px] pl-[30px]">
                          <h4
                            className="m-0"
                            style={{
                              color: "var(--Black, #000)",
                              fontFamily: pangeaFont,
                              fontSize: "24px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "normal",
                            }}
                          >
                            Skills you’ll learn
                          </h4>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-[8px] border border-black bg-white px-3 py-1.5 text-[20px] font-semibold">DIGITAL ILLUSTRATION</span>
                            <span className="rounded-[8px] border border-black bg-white px-3 py-1.5 text-[20px] font-semibold">ANALOG ILLUSTRATION</span>
                            <span className="rounded-[8px] border border-black bg-white px-3 py-1.5 text-[20px] font-semibold">BRUSHES</span>
                            <span className="rounded-[8px] border border-black bg-white px-3 py-1.5 text-[20px] font-semibold">PROCREATE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute right-[14px] top-[57px]"
                  style={{ width: `${CUSTOM_SCROLL_BOX_WIDTH}px`, height: `${CUSTOM_TRACK_HEIGHT}px` }}
                >
                  <div
                    className="absolute top-0 rounded-[50px] bg-[#07423C]"
                    style={{
                      left: `calc(50% - ${CUSTOM_SCROLL_SHAFT_WIDTH / 2}px)`,
                      width: `${CUSTOM_SCROLL_SHAFT_WIDTH}px`,
                      height: `${CUSTOM_TRACK_HEIGHT}px`,
                    }}
                  />
                  <div
                    className="absolute left-0 rounded-[50px] border border-black bg-white"
                    style={{
                      top: `${customThumbTop}px`,
                      width: `${CUSTOM_SCROLL_BOX_WIDTH}px`,
                      height: `${CUSTOM_THUMB_HEIGHT}px`,
                    }}
                    onMouseDown={beginThumbDragScroll}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      ) : null}
    </>
  );
}
