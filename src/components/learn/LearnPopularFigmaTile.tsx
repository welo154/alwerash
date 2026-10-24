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
    comingSoon = false,
    className = "",
    size = "default",
  } = props;
  const t = useT();
  const arabic = useArabicLayout();
  const displayTitle = arabic && titleAr?.trim() ? titleAr.trim() : title;
  const displayAuthor = arabic && authorLabelAr?.trim() ? authorLabelAr.trim() : authorLabel;
  const isGrid = size === "grid";
  /** English phone course cards. Tablet and desktop keep the 50px control. */
  const mobileStart = !isGrid && !arabic && !comingSoon;
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
          className={`absolute flex items-center ${
            mobileStart
              ? "max-[743px]:!bottom-[26px] max-[743px]:!left-[20px] max-[743px]:!h-[45.667px] min-[744px]:!bottom-[27px] min-[744px]:!left-[33px] min-[744px]:!h-[50px]"
              : ""
          }`}
          style={{
            left: arabic ? undefined : mobileStart ? 20 : 33,
            right: arabic ? 25 : undefined,
            bottom: mobileStart ? 26 : START_BUTTON_BOTTOM,
            height: mobileStart ? 45.667 : START_BUTTON_H,
          }}
        >
          <div
            className={`relative shrink-0 transition-colors duration-300 ease-out ${
              comingSoon
                ? "bg-amber-100 group-hover:bg-amber-200"
                : "bg-[var(--Green,#8AF396)] group-hover:bg-[var(--Dark-Green,#004B3C)]"
            } ${
              mobileStart
                ? "min-[744px]:!h-[50px] min-[744px]:!w-[141px] min-[744px]:!border-0"
                : ""
            }`}
            style={{
              display: "flex",
              width: mobileStart ? 128.78 : startButtonW,
              height: mobileStart ? 45.667 : START_BUTTON_H,
              padding: "0 16px",
              justifyContent: arabic ? "flex-end" : undefined,
              alignItems: "center",
              borderRadius: 23,
              boxSizing: "border-box",
              overflow: "visible",
              ...(mobileStart ? { border: "0.3px solid rgb(0 0 0 / 40%)" } : {}),
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={startButtonW}
              height="50"
              viewBox={`0 0 ${startButtonW} 50`}
              fill="none"
              aria-hidden
              className={`pointer-events-none absolute inset-0 ${mobileStart ? "max-[743px]:hidden" : ""}`}
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
                fontVariationSettings: '"wght" 500',
                lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
              }}
            >
              {startLabel}
            </span>
            <span
              className={`absolute ${
                mobileStart
                  ? "max-[743px]:!left-[91.33px] max-[743px]:!h-[45.667px] max-[743px]:!w-[45.667px] min-[744px]:!left-[100px] min-[744px]:!h-[50px] min-[744px]:!w-[50px]"
                  : ""
              }`}
              aria-hidden
              style={{
                left: arabic ? undefined : mobileStart ? 91.33 : 100,
                right: arabic ? 71 : undefined,
                top: "50%",
                width: mobileStart ? 45.667 : 50,
                height: mobileStart ? 45.667 : 50,
                transform: "translateY(-50%)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 51 51" fill="none" className="h-full w-full">
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
          </div>
        </div>
        <div
          className={
            arabic
              ? "absolute"
              : "absolute max-[743px]:right-[130px] max-[743px]:bottom-[34.5px] min-[744px]:right-[126.7px] min-[744px]:bottom-[37.5px]"
          }
          style={
            arabic
              ? { left: 33, bottom: 30, width: 16.3, height: 13.583 }
              : { width: 16.3, height: 13.583 }
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16.3"
            height="13.583"
            viewBox="0 0 18 16"
            fill="none"
            aria-hidden
            style={{ display: "block", opacity: 0.6 }}
          >
            <path
              d="M4.89067 6.86241L8.20321 0.75C8.86211 0.75 9.49403 0.964662 9.95994 1.34676C10.4259 1.72886 10.6876 2.2471 10.6876 2.78747V5.5041H15.3748C15.6149 5.50187 15.8527 5.54247 16.0718 5.6231C16.2908 5.70372 16.4859 5.82244 16.6434 5.97103C16.801 6.11961 16.9172 6.29451 16.9842 6.48361C17.0511 6.67271 17.0671 6.87148 17.0311 7.06616L15.8883 13.1786C15.8284 13.5025 15.6278 13.7977 15.3234 14.0099C15.0191 14.222 14.6315 14.3368 14.232 14.3331H4.89067M4.89067 6.86241V14.3331M4.89067 6.86241H2.40627C1.967 6.86241 1.54572 7.00552 1.23511 7.26025C0.924499 7.51499 0.75 7.86048 0.75 8.22072V12.9748C0.75 13.3351 0.924499 13.6806 1.23511 13.9353C1.54572 14.19 1.967 14.3331 2.40627 14.3331H4.89067"
              stroke="var(--Black, #000)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            className={`absolute flex items-center ${
              arabic ? "" : "max-[743px]:left-[22.6px] min-[744px]:left-[22.8px]"
            }`}
            style={{
              left: arabic ? 16.3 + 6.5 : undefined,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <span
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: 15,
                fontStyle: "normal",
                fontWeight: 400,
                fontVariationSettings: '"wght" 400',
                lineHeight: "normal",
                opacity: 0.6,
              }}
            >
              {arabic ? "٩٨٪" : "98%"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="12"
              viewBox="0 0 17 14"
              fill="none"
              aria-hidden
              style={{ display: "block", flexShrink: 0, marginLeft: 8.5, opacity: 0.6 }}
            >
              <path
                d="M11.6591 12.75V11.4167C11.6591 10.7094 11.3718 10.0311 10.8603 9.53105C10.3488 9.03095 9.65514 8.75 8.93182 8.75H3.47727C2.75396 8.75 2.06026 9.03095 1.5488 9.53105C1.03734 10.0311 0.75 10.7094 0.75 11.4167V12.75M15.75 12.75V11.4167C15.7495 10.8258 15.5484 10.2518 15.1782 9.78488C14.808 9.31791 14.2896 8.98438 13.7045 8.83667M10.9773 0.836667C11.5639 0.983534 12.0839 1.31713 12.4552 1.78487C12.8265 2.25261 13.0281 2.82789 13.0281 3.42C13.0281 4.01211 12.8265 4.58739 12.4552 5.05513C12.0839 5.52287 11.5639 5.85647 10.9773 6.00333M8.93182 3.41667C8.93182 4.88943 7.71078 6.08333 6.20455 6.08333C4.69831 6.08333 3.47727 4.88943 3.47727 3.41667C3.47727 1.94391 4.69831 0.75 6.20455 0.75C7.71078 0.75 8.93182 1.94391 8.93182 3.41667Z"
                stroke="var(--Black, #000)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                marginLeft: 6,
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: 15,
                fontStyle: "italic",
                fontWeight: 400,
                fontVariationSettings: '"wght" 400',
                lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
                opacity: 0.6,
              }}
            >
              {arabic ? "٢٣٤" : "234"}
            </span>
          </div>
        </div>
      </div>
      </Link>
  );

  return cardLink;
}
