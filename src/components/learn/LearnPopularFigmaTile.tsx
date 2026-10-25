"use client";

import Link from "next/link";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import { pangeaFontFamily } from "@/lib/fonts/pangea";
import { useT } from "@/components/i18n/Tr";
import { useArabicLayout } from "@/components/providers/LocaleProvider";

const pangeaFont = pangeaFontFamily;

/** Photo plate is 377px; only the top 217px stays visible above the white panel. */
const GRAY_H = 377;
const VISIBLE_UPPER_H = 217;
/** Pixels the white panel covers on the photo (377 − 217). */
const WHITE_PULL_UP = GRAY_H - VISIBLE_UPPER_H;

export const LEARN_POPULAR_FIGMA_TILE_W = 346;
/** Legacy fixed height (≈447); slides use `height: auto` — kept for callers that need a minimum. */
export const LEARN_POPULAR_FIGMA_TILE_H = VISIBLE_UPPER_H + 204;

/** Overlap between image and white panel as a fraction of card width (211px at 346px wide). */
const GRID_PANEL_OVERLAP = `-${(WHITE_PULL_UP / LEARN_POPULAR_FIGMA_TILE_W) * 100}%`;

/** Figma `167:1729` — author max width 181; 5px below title. */
const AUTHOR_MAX_W = 181;
/** Space from white panel top to title. */
const WHITE_INNER_PT = 27;
/** New Start control: 50px tall, 27px above the card bottom. */
const START_BUTTON_H = 50;
const START_BUTTON_BOTTOM = 27;

const POPULAR_CLASS_COVER_IMAGE = "/learn/popular-class-cover.png";
/** Between center and top so faces/subjects stay in the visible band above the white panel. */
const POPULAR_COVER_OBJECT_POSITION = "center 38%";

export function LearnPopularFigmaTile(
  props: LearnPopularTile & { className?: string; size?: "default" | "grid" }
) {
  const {
    href,
    title,
    titleAr,
    authorLabel,
    authorLabelAr,
    tagPrimary,
    typeLabel,
    coverImageSrc,
    durationLabel,
    levelLabel,
    comingSoon = false,
    className = "",
    size = "default",
  } = props;
  const t = useT();
  const arabic = useArabicLayout();
  const displayTitle = arabic && titleAr?.trim() ? titleAr.trim() : title;
  const displayAuthor = arabic && authorLabelAr?.trim() ? authorLabelAr.trim() : authorLabel;
  const isGrid = size === "grid";
  const startButtonW = comingSoon ? (arabic ? 150 : 170) : arabic ? 115 : 141;
  const startLabel = comingSoon
    ? arabic
      ? "قريباً"
      : t("COMING SOON")
    : arabic
      ? "ابــدأ"
      : t("START");
  const grayCoverSrc = coverImageSrc?.trim() || POPULAR_CLASS_COVER_IMAGE;
  const cardLink = (
      <Link
        href={href}
        aria-label={`${displayTitle}. ${displayAuthor}. ${t(tagPrimary)}.${comingSoon ? " Coming soon." : " Start"}`}
        className={
          isGrid
            ? `group relative flex h-full w-full flex-col overflow-hidden no-underline ${className}`.trim()
            : `group relative flex w-[315px] shrink-0 flex-col overflow-visible no-underline min-[744px]:w-[345px] lg:w-[346px] ${className}`.trim()
        }
      >
        {typeLabel ? (
          <span
            className="absolute z-20 flex items-center justify-center"
            style={{
              top: arabic ? 24 : 25,
              left: arabic ? undefined : 33,
              right: arabic ? 25 : undefined,
              width: "auto",
              height: 39,
              padding: "0 16px",
              borderRadius: 23,
              background: "#89F496",
              boxSizing: "border-box",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <rect
                x="0.15"
                y="0.15"
                width="calc(100% - 0.3px)"
                height="calc(100% - 0.3px)"
                rx="23"
                fill="none"
                stroke="var(--Black, #000)"
                strokeWidth="0.3"
              />
            </svg>
            <span
              style={{
                color: "var(--Text-Primary, #141413)",
                textAlign: "center",
                fontFamily: pangeaFont,
                fontSize: 18,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
              }}
            >
              {t(typeLabel)}
            </span>
          </span>
        ) : null}
            {isGrid ? (
      <div
        className={`relative isolate shrink-0 overflow-hidden rounded-[50px] border border-black max-lg:border-black/20 bg-[#E9E9E9]`}
        style={{ width: "100%", aspectRatio: `${LEARN_POPULAR_FIGMA_TILE_W} / ${GRAY_H}` }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={grayCoverSrc}
          alt=""
          className="absolute inset-0 h-full w-full max-w-none object-cover"
          style={{ objectPosition: POPULAR_COVER_OBJECT_POSITION }}
        />
      </div>
      ) : (
      <div
        className={`relative isolate shrink-0`}
        style={{ width: "100%", height: VISIBLE_UPPER_H }}
        aria-hidden
      >
        <div
          className="absolute inset-x-0 top-0 overflow-hidden rounded-[50px] border border-black max-lg:border-black/20 bg-[#E9E9E9]"
          style={{ height: GRAY_H }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={grayCoverSrc}
            alt=""
            className="absolute inset-0 h-full w-full max-w-none object-cover"
            style={{ objectPosition: POPULAR_COVER_OBJECT_POSITION }}
          />
        </div>
      </div>
      )}
      <div
        className="relative z-10 flex w-full flex-col rounded-[50px] border border-black bg-white transition-colors duration-300 ease-out group-hover:bg-[var(--Green,#8AF396)] max-lg:border-black/20"
        style={
          isGrid
            ? {
                marginTop: GRID_PANEL_OVERLAP,
                paddingTop: WHITE_INNER_PT,
                paddingBottom: START_BUTTON_BOTTOM + START_BUTTON_H,
                paddingLeft: "9%",
                paddingRight: arabic ? 25 : "9%",
                height: 204,
                boxSizing: "border-box",
                fontFamily: pangeaFont,
              }
            : {
                marginTop: 0,
                width: "100%",
                paddingTop: WHITE_INNER_PT,
                paddingBottom: START_BUTTON_BOTTOM + START_BUTTON_H,
                paddingLeft: 37,
                paddingRight: arabic ? 25 : 37,
                height: 204,
                boxSizing: "border-box",
                fontFamily: pangeaFont,
              }
        }
      >
        <div
          className={`flex flex-col gap-[5px]${isGrid || arabic ? "" : " max-w-[274px]"}`}
          style={
            arabic
              ? { marginLeft: "auto", width: "100%", maxWidth: isGrid ? undefined : 274, textAlign: "right" }
              : undefined
          }
        >
          <p
            className={`m-0 max-w-full font-normal not-italic leading-normal text-black${
              isGrid ? " line-clamp-2" : ""
            }${arabic ? " text-[20px]" : isGrid ? " text-[16px]" : " text-[18px]"}`}
          >
            {displayTitle}
          </p>
          <p
            className={`m-0 font-normal not-italic leading-normal text-black opacity-60${
              arabic ? " text-[18px]" : isGrid ? " text-[14px]" : " text-[16px]"
            }`}
            style={
              isGrid
                ? undefined
                : { maxWidth: AUTHOR_MAX_W, marginLeft: arabic ? "auto" : undefined }
            }
          >
            {displayAuthor}
          </p>
        </div>
        <div
          className="absolute flex items-center"
          style={{
            left: arabic ? undefined : 33,
            right: arabic ? 25 : undefined,
            bottom: START_BUTTON_BOTTOM,
            height: START_BUTTON_H,
          }}
        >
          <div
            className={`relative shrink-0 transition-colors duration-300 ease-out ${
              comingSoon
                ? "bg-amber-100 group-hover:bg-amber-200"
                : "bg-[var(--Green,#8AF396)] group-hover:bg-[var(--Dark-Green,#004B3C)]"
            }`}
            style={{
              display: "flex",
              width: startButtonW,
              height: START_BUTTON_H,
              padding: "0 16px",
              justifyContent: arabic ? "flex-end" : undefined,
              alignItems: "center",
              borderRadius: 23,
              boxSizing: "border-box",
              overflow: "visible",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={startButtonW}
              height="50"
              viewBox={`0 0 ${startButtonW} 50`}
              fill="none"
              aria-hidden
              className="pointer-events-none absolute inset-0"
            >
              <rect
                x="0.15"
                y="0.15"
                width={startButtonW - 0.3}
                height="49.7"
                rx="23"
                stroke="var(--Black, #000)"
                strokeWidth="0.3"
              />
            </svg>
            <span
              className={`transition-colors duration-300 ease-out ${
                comingSoon
                  ? "text-amber-900"
                  : "text-[var(--Black,#000)] group-hover:text-white"
              }`}
              style={{
                fontFamily: pangeaFont,
                fontSize: comingSoon ? 16 : 24,
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
              }}
            >
              {startLabel}
            </span>
            {comingSoon ? null : (
            <span
              className="absolute"
              aria-hidden
              style={{
                left: arabic ? undefined : 100,
                right: arabic ? 71 : undefined,
                top: "50%",
                width: 50,
                height: 50,
                transform: "translateY(-50%)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 51 51" fill="none">
                <path
                  d="M25.1499 50.1499C38.957 50.1499 50.1499 38.957 50.1499 25.1499C50.1499 11.3428 38.957 0.149902 25.1499 0.149902C11.3428 0.149902 0.149902 11.3428 0.149902 25.1499C0.149902 38.957 11.3428 50.1499 25.1499 50.1499Z"
                  fill="#FFF"
                  stroke="var(--Black, #000)"
                  strokeWidth="0.3"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 22 22"
                fill="none"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: arabic ? "translate(-50%, -50%) scaleX(-1)" : "translate(-50%, -50%)",
                }}
              >
                <path d="M10.75 20.75L15.75 15.75L20.75 10.75L10.75 0.75" fill="#FFF" />
                <path
                  d="M10.75 0.75L20.75 10.75L15.75 15.75L10.75 20.75M20.75 10.75L0.75 10.75"
                  stroke="var(--Black, #000)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            )}
          </div>
        </div>
        {durationLabel || levelLabel ? (
          <div
            className="absolute flex items-center gap-[8px]"
            style={arabic ? { left: 24, bottom: 36 } : { right: 22, bottom: 36 }}
          >
            {durationLabel ? (
              <span
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: "normal",
                  opacity: 0.7,
                  whiteSpace: "nowrap",
                }}
              >
                {durationLabel}
              </span>
            ) : null}
            {levelLabel ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 26,
                  padding: "0 10px",
                  borderRadius: 23,
                  border: "0.3px solid #000",
                  background:
                    levelLabel === "Advanced"
                      ? "#141413"
                      : levelLabel === "Intermediate"
                        ? "#64E1FF"
                        : "#8AF396",
                  color: levelLabel === "Advanced" ? "#fff" : "#141413",
                  fontFamily: pangeaFont,
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: "19.6px",
                  whiteSpace: "nowrap",
                }}
              >
                {t(levelLabel)}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
      </Link>
  );

  return cardLink;
}
