"use client";

import Link from "next/link";
import type { ContinueLearningCardDto } from "@/server/home/continue-learning.service";
import { pangeaFontFamily } from "@/lib/fonts/pangea";
import { Tr } from "@/components/i18n/Tr";
import { LocalizedText } from "@/components/i18n/LocalizedText";
import { useArabicLayout } from "@/components/providers/LocaleProvider";

const pangeaFont = pangeaFontFamily;

function WithWord() {
  return useArabicLayout() ? "مع" : "with";
}

function ContinueDesktopPlayIcon({ flipped = false }: { flipped?: boolean }) {
  return (
    <span className="relative block" style={{ width: 50, height: 50 }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={50}
        height={50}
        viewBox="0 0 51 51"
        fill="none"
        className="block"
        aria-hidden
        style={{
          width: 50,
          height: 50,
          fill: "#FFF",
          stroke: "var(--Black, #000)",
          strokeWidth: 0.3,
        }}
      >
        <path
          d="M25.1499 50.15C38.957 50.15 50.1499 38.9571 50.1499 25.15C50.1499 11.3429 38.957 0.149994 25.1499 0.149994C11.3428 0.149994 0.149902 11.3429 0.149902 25.15C0.149902 38.9571 11.3428 50.15 25.1499 50.15Z"
          fill="white"
        />
        <path
          d="M25.1499 50.15C38.957 50.15 50.1499 38.9571 50.1499 25.15C50.1499 11.3429 38.957 0.149994 25.1499 0.149994C11.3428 0.149994 0.149902 11.3429 0.149902 25.15C0.149902 38.9571 11.3428 50.15 25.1499 50.15Z"
          stroke="black"
          strokeWidth={0.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "50%",
          left: "50%",
          width: 20,
          height: 20,
          fill: "#FFF",
          stroke: "var(--Black, #000)",
          strokeWidth: 1.5,
          transform: `translate(-50%, -50%)${flipped ? " scaleX(-1)" : ""}`,
        }}
      >
        <path
          d="M10.75 20.75L15.75 15.75L20.75 10.75L10.75 0.75"
          fill="white"
        />
        <path
          d="M10.75 0.75L20.75 10.75L15.75 15.75L10.75 20.75M20.75 10.75L0.75 10.75"
          stroke="black"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const TRACK_WIDTH_PX = 904;
const TRACK_HEIGHT_PX = 18;
const TRACK_FILL_WIDTH_PX = 402.698;
const TRACK_TICK_COUNT = 9;
const TRACK_TICK_FIRST_LEFT_PX = 76;
const TRACK_TICK_GAP_PX = 94;
const TRACK_TICK_WIDTH_PX = 0.3;
const TRACK_TICK_HEIGHT_PX = 6.081;

const MOBILE_TRACK_WIDTH_PX = 280;
const MOBILE_TRACK_HEIGHT_PX = 9;
const MOBILE_TRACK_FILL_WIDTH_PX =
  (TRACK_FILL_WIDTH_PX / TRACK_WIDTH_PX) * MOBILE_TRACK_WIDTH_PX;
const MOBILE_TRACK_TICK_FIRST_LEFT_PX = 24;
const MOBILE_TRACK_TICK_GAP_PX = 29;
const MOBILE_TRACK_TICK_HEIGHT_PX = 3.041;

const TABLET_TRACK_WIDTH_PX = 343;
const TABLET_TRACK_HEIGHT_PX = 15;
const TABLET_TRACK_FILL_WIDTH_PX =
  (TRACK_FILL_WIDTH_PX / TRACK_WIDTH_PX) * TABLET_TRACK_WIDTH_PX;
const TABLET_TRACK_TICK_FIRST_LEFT_PX = 28;
const TABLET_TRACK_TICK_GAP_PX = 35;
const TABLET_TRACK_TICK_HEIGHT_PX = 5.068;
const SOFT_BORDER = "0.3px solid rgba(0, 0, 0, 0.2)";

function ContinueArabicPlayIcon() {
  return (
    <span className="relative block" style={{ width: 50, height: 50, transform: "rotate(-180deg)" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={50}
        height={50}
        viewBox="0 0 51 51"
        fill="none"
        className="block"
        aria-hidden
        style={{ width: 50, height: 50 }}
      >
        <path
          d="M25.1484 0.150022C11.3413 0.150021 0.148441 11.3429 0.14844 25.15C0.148438 38.9571 11.3413 50.15 25.1484 50.15C38.9556 50.15 50.1484 38.9571 50.1484 25.15C50.1484 11.3429 38.9556 0.150023 25.1484 0.150022Z"
          fill="white"
        />
        <path
          d="M0.14844 25.15C0.148441 11.3429 11.3413 0.150021 25.1484 0.150022C38.9556 0.150023 50.1484 11.3429 50.1484 25.15C50.1484 38.9571 38.9556 50.15 25.1484 50.15C11.3413 50.15 0.148438 38.9571 0.14844 25.15Z"
          stroke="black"
          strokeWidth={0.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "50%",
          left: "50%",
          width: 20,
          height: 20,
          fill: "#FFF",
          stroke: "var(--Black, #000)",
          strokeWidth: 1.5,
          transform: "translate(-50%, -50%) rotate(-180deg)",
        }}
      >
        <path d="M10.75 0.750003L5.75 5.75L0.750001 10.75L10.75 20.75" fill="white" />
        <path
          d="M10.75 20.75L0.750001 10.75L5.75 5.75L10.75 0.750003M0.750001 10.75L20.75 10.75"
          stroke="black"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ContinueLearningCtaButton({
  border = "0.3px solid var(--Black, #000)",
  flipped = false,
  mirror = false,
  size,
}: {
  border?: string;
  flipped?: boolean;
  /** Arabic label and icon, keeping the English button size unless `size` is set. */
  mirror?: boolean;
  size?: "mobile" | "tablet";
}) {
  const arabicButton = flipped || mirror;
  const sized = mirror && size === "mobile" ? "mobile" : mirror && size === "tablet" ? "tablet" : null;
  return (
    <span
      className="relative box-border overflow-visible"
      style={{
        display: "flex",
        width: flipped ? 149 : sized ? 141 : 187,
        height: sized === "mobile" ? 48 : 50,
        padding: "0 16px",
        justifyContent: arabicButton ? "flex-end" : undefined,
        alignItems: "center",
        borderRadius: sized === "mobile" ? 50 : 23,
        border: flipped || sized ? "0.3px solid rgb(0 0 0 / 40%)" : border,
        background: "var(--Green, #8AF396)",
      }}
    >
      <span
        style={{
          color: "var(--Black, #000)",
          textAlign: arabicButton ? "right" : undefined,
          fontFamily: pangeaFont,
          fontSize: 24,
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
          fontVariationSettings: '"wght" 500',
        }}
      >
        {flipped ? "استمــــر" : mirror ? "استمر" : <Tr>CONTINUE</Tr>}
      </span>
      <span
        className="pointer-events-none absolute"
        style={
          flipped
            ? { right: 103, top: "50%", width: 50, height: 50, transform: "translateY(-50%)" }
            : sized === "mobile"
              ? { right: 96, top: "50%", width: 50, height: 50, transform: "translateY(-50%)" }
              : sized === "tablet"
                ? { right: 95, top: "50%", width: 50, height: 50, transform: "translateY(-50%)" }
                : mirror
                  ? { right: 146, top: "50%", width: 50, height: 50, transform: "translateY(-50%)" }
                  : { left: 146, top: 0, width: 50, height: 50 }
        }
      >
        {arabicButton ? <ContinueArabicPlayIcon /> : <ContinueDesktopPlayIcon />}
      </span>
    </span>
  );
}

function ContinueLearningDesktopRow({
  lessonTitle,
  lessonTitleAr,
  lessonNumber,
  courseTitle,
  courseTitleAr,
  instructorName,
  instructorNameAr,
  durationLabel,
  continueHref,
}: ContinueLearningCardDto) {
  const arabic = useArabicLayout();
  const textInset = 21;
  const buttonReserve = 50 + (arabic ? 149 : 187) + 8;

  return (
    <Link
      href={continueHref}
      className="relative box-border no-underline transition-opacity hover:opacity-90"
      style={{
        display: "block",
        width: 1201,
        height: 118,
        borderRadius: 50,
        border: "0.3px solid var(--Black, #000)",
        background: "var(--White, #FFF)",
      }}
    >
      <span
        className="absolute flex min-w-0 items-center"
        style={{
          top: 26,
          left: arabic ? buttonReserve : textInset,
          right: arabic ? textInset : buttonReserve,
          textAlign: arabic ? "right" : undefined,
          flexDirection: arabic ? "row-reverse" : undefined,
        }}
      >
        {arabic ? (
          <span
            className="shrink-0"
            style={{
              color: "var(--Black, #000)",
              textAlign: "right",
              fontFamily: pangeaFont,
              fontSize: 32,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "23px",
              fontVariationSettings: '"wght" 500',
            }}
          >
            {lessonNumber}
          </span>
        ) : null}
        {arabic ? (
          <span
            className="shrink-0"
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 32,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "23px",
              fontVariationSettings: '"wght" 500',
            }}
          >
            .
          </span>
        ) : null}
        <span
          className="shrink-0"
          style={{
            color: "var(--Black, #000)",
            textAlign: arabic ? "right" : undefined,
            fontFamily: pangeaFont,
            fontSize: arabic ? 32 : 24,
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "23px",
            fontVariationSettings: '"wght" 500',
          }}
        >
          {arabic ? null : <>{lessonNumber}.</>}
          <LocalizedText en={lessonTitle} ar={lessonTitleAr} />
        </span>
        <span
          dir={arabic ? "rtl" : undefined}
          className="min-w-0 truncate"
          style={{
            marginLeft: arabic ? 0 : 16,
            marginRight: arabic ? 16 : 0,
            opacity: arabic ? 1 : 0.6,
            color: "var(--Black, #000)",
            textAlign: arabic ? "right" : undefined,
            fontFamily: pangeaFont,
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "23px",
            fontVariationSettings: '"wght" 400',
          }}
        >
          <LocalizedText en={courseTitle} ar={courseTitleAr} /> <WithWord />{" "}
          <span
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: arabic ? 400 : 500,
              lineHeight: "23px",
              fontVariationSettings: arabic ? '"wght" 400' : '"wght" 500',
            }}
          >
            <LocalizedText en={instructorName} ar={instructorNameAr} />
          </span>
          {arabic ? " - " : "  -  "}
          {arabic ? durationLabel.replace(/mins?$/i, " دقيقة") : durationLabel}
        </span>
      </span>

      <span
        className="absolute box-border overflow-hidden"
        style={{
          top: 26 + 23 + 25,
          left: arabic ? undefined : 21,
          right: arabic ? 21 : undefined,
          display: "flex",
          width: TRACK_WIDTH_PX,
          height: TRACK_HEIGHT_PX,
          padding: "0 16px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 24,
          border: "0.3px solid #000",
        }}
        aria-hidden
      >
        <span
          className="absolute"
          style={{
            left: arabic ? undefined : 0,
            right: arabic ? 0 : undefined,
            top: 0,
            bottom: 0,
            width: TRACK_FILL_WIDTH_PX,
            height: "auto",
            padding: 0,
            borderRadius: 24,
            border: "none",
            borderRight: arabic ? undefined : "0.3px solid #000",
            borderLeft: arabic ? "0.3px solid #000" : undefined,
            background: arabic
              ? "linear-gradient(270deg, var(--Blue, #66E0F2) 0%, var(--Bright-Green, #89F496) 100%)"
              : "var(--gradient, linear-gradient(90deg, var(--Blue, #66E0F2) 0%, var(--Bright-Green, #89F496) 100%))",
          }}
        />
        {Array.from({ length: TRACK_TICK_COUNT }, (_, index) => (
          <span
            key={index}
            className="absolute"
            style={{
              left: arabic ? undefined : TRACK_TICK_FIRST_LEFT_PX + index * TRACK_TICK_GAP_PX,
              right: arabic ? TRACK_TICK_FIRST_LEFT_PX + index * TRACK_TICK_GAP_PX : undefined,
              top: "50%",
              width: TRACK_TICK_WIDTH_PX,
              height: TRACK_TICK_HEIGHT_PX,
              transform: "translateY(-50%)",
              background: "#000",
            }}
          />
        ))}
      </span>

      <span
        className="absolute"
        style={{ top: 42, right: arabic ? undefined : 50, left: arabic ? 50 : undefined }}
      >
        <ContinueLearningCtaButton flipped={arabic} />
      </span>
    </Link>
  );
}

function ContinueLearningMobileCard({
  lessonTitle,
  lessonTitleAr,
  lessonNumber,
  courseTitle,
  courseTitleAr,
  instructorName,
  instructorNameAr,
  durationLabel,
  continueHref,
}: ContinueLearningCardDto) {
  const arabic = useArabicLayout();
  const duration = arabic ? durationLabel.replace(/mins?$/i, " دقيقة") : durationLabel;
  return (
    <Link
      href={continueHref}
      className="relative box-border no-underline transition-opacity hover:opacity-90"
      style={{
        display: "flex",
        width: 335,
        height: 170,
        paddingLeft: arabic ? 0 : 27,
        paddingRight: arabic ? 27 : 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        border: "0.3px solid rgba(0, 0, 0, 0.2)",
        background: "var(--White, #FFF)",
      }}
    >
      <span
        className="absolute flex min-w-0 items-center"
        style={{
          top: 23,
          left: 21,
          right: 21,
          flexDirection: arabic ? "row-reverse" : undefined,
          textAlign: arabic ? "right" : undefined,
        }}
      >
        {arabic ? (
          <span
            className="shrink-0"
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 24,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "23px",
              fontVariationSettings: '"wght" 500',
            }}
          >
            {lessonNumber}
          </span>
        ) : null}
        {arabic ? (
          <span
            className="shrink-0"
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 24,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "23px",
              fontVariationSettings: '"wght" 500',
            }}
          >
            .
          </span>
        ) : null}
        <span
          className="min-w-0 truncate"
          style={{
            color: "var(--Black, #000)",
            textAlign: arabic ? "right" : undefined,
            fontFamily: pangeaFont,
            fontSize: 24,
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "23px",
            fontVariationSettings: '"wght" 500',
          }}
        >
          {arabic ? null : <>{lessonNumber}.</>}
          <LocalizedText en={lessonTitle} ar={lessonTitleAr} />
        </span>
        <span
          className="shrink-0"
          style={{
            marginLeft: arabic ? 0 : 10,
            marginRight: arabic ? 10 : 0,
            opacity: 0.6,
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 14,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "23px",
            fontVariationSettings: '"wght" 400',
          }}
        >
          {duration}
        </span>
      </span>

      <span
        dir={arabic ? "rtl" : undefined}
        className="absolute min-w-0 truncate"
        style={{
          top: 23 + 23 + 4,
          left: 21,
          right: 21,
          textAlign: arabic ? "right" : undefined,
          opacity: 0.6,
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 14,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "23px",
          fontVariationSettings: '"wght" 400',
        }}
      >
        <LocalizedText en={courseTitle} ar={courseTitleAr} /> {arabic ? "مع" : "-"}{" "}
        <span
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 14,
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "23px",
            fontVariationSettings: '"wght" 500',
          }}
        >
          <LocalizedText en={instructorName} ar={instructorNameAr} />
        </span>
      </span>

      <span
        className="absolute box-border overflow-hidden"
        style={{
          top: 23 + 23 + 4 + 23 + 12,
          left: arabic ? undefined : 21,
          right: arabic ? 21 : undefined,
          display: "flex",
          width: MOBILE_TRACK_WIDTH_PX,
          height: MOBILE_TRACK_HEIGHT_PX,
          padding: "0 16px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 24,
          border: "0.3px solid rgba(0, 0, 0, 0.2)",
        }}
        aria-hidden
      >
        <span
          className="absolute"
          style={{
            left: arabic ? undefined : 0,
            right: arabic ? 0 : undefined,
            top: 0,
            bottom: 0,
            width: MOBILE_TRACK_FILL_WIDTH_PX,
            height: "auto",
            borderRadius: 24,
            border: "none",
            borderRight: arabic ? undefined : "0.3px solid rgba(0, 0, 0, 0.2)",
            borderLeft: arabic ? "0.3px solid rgba(0, 0, 0, 0.2)" : undefined,
            background: arabic
              ? "linear-gradient(270deg, var(--Blue, #66E0F2) 0%, var(--Bright-Green, #89F496) 100%)"
              : "var(--gradient, linear-gradient(90deg, var(--Blue, #66E0F2) 0%, var(--Bright-Green, #89F496) 100%))",
          }}
        />
        {Array.from({ length: TRACK_TICK_COUNT }, (_, index) => (
          <span
            key={index}
            className="absolute"
            style={{
              left: arabic ? undefined : MOBILE_TRACK_TICK_FIRST_LEFT_PX + index * MOBILE_TRACK_TICK_GAP_PX,
              right: arabic ? MOBILE_TRACK_TICK_FIRST_LEFT_PX + index * MOBILE_TRACK_TICK_GAP_PX : undefined,
              top: "50%",
              width: TRACK_TICK_WIDTH_PX,
              height: MOBILE_TRACK_TICK_HEIGHT_PX,
              transform: "translateY(-50%)",
              background: "#000",
            }}
          />
        ))}
      </span>

      <span
        className="absolute"
        style={{
          top: 23 + 23 + 4 + 23 + 12 + MOBILE_TRACK_HEIGHT_PX + 12,
          left: arabic ? undefined : 21,
          right: arabic ? 21 : undefined,
        }}
      >
        <ContinueLearningCtaButton
          border="0.3px solid rgba(0, 0, 0, 0.2)"
          mirror={arabic}
          size={arabic ? "mobile" : undefined}
        />
      </span>
    </Link>
  );
}

function ContinueLearningTabletCard({
  lessonTitle,
  lessonTitleAr,
  lessonNumber,
  courseTitle,
  courseTitleAr,
  instructorName,
  instructorNameAr,
  durationLabel,
  continueHref,
}: ContinueLearningCardDto) {
  const arabic = useArabicLayout();
  const duration = arabic ? durationLabel.replace(/mins?$/i, " دقيقة") : durationLabel;
  const textStart = 27;
  const buttonSide = 35 + (arabic ? 141 : 187) + 8;
  return (
    <Link
      href={continueHref}
      className="relative box-border no-underline transition-opacity hover:opacity-90"
      style={{
        display: "flex",
        width: 622,
        height: 122,
        padding: "0 16px",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 45,
        border: SOFT_BORDER,
        background: "var(--White, #FFF)",
      }}
    >
      <span
        className="absolute flex min-w-0 items-center"
        style={{
          top: 23,
          left: arabic ? buttonSide : textStart,
          right: arabic ? textStart : buttonSide,
          flexDirection: arabic ? "row-reverse" : undefined,
          textAlign: arabic ? "right" : undefined,
        }}
      >
        {arabic ? (
          <span
            className="shrink-0"
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 24,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "23px",
              fontVariationSettings: '"wght" 500',
            }}
          >
            {lessonNumber}
          </span>
        ) : null}
        {arabic ? (
          <span
            className="shrink-0"
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 24,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "23px",
              fontVariationSettings: '"wght" 500',
            }}
          >
            .
          </span>
        ) : null}
        <span
          className="min-w-0 truncate"
          style={{
            color: "var(--Black, #000)",
            textAlign: arabic ? "right" : undefined,
            fontFamily: pangeaFont,
            fontSize: 24,
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "23px",
            fontVariationSettings: '"wght" 500',
          }}
        >
          {arabic ? null : <>{lessonNumber}.</>}
          <LocalizedText en={lessonTitle} ar={lessonTitleAr} />
        </span>
        <span
          className="shrink-0"
          style={{
            marginLeft: arabic ? 0 : 18,
            marginRight: arabic ? 18 : 0,
            opacity: 0.6,
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "23px",
            fontVariationSettings: '"wght" 400',
          }}
        >
          {duration}
        </span>
      </span>

      <span
        dir={arabic ? "rtl" : undefined}
        className="absolute min-w-0 truncate"
        style={{
          top: 23 + 23 + 3,
          left: arabic ? buttonSide : textStart,
          right: arabic ? textStart : buttonSide,
          textAlign: arabic ? "right" : undefined,
          opacity: 0.6,
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 16,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "23px",
          fontVariationSettings: '"wght" 400',
        }}
      >
        <LocalizedText en={courseTitle} ar={courseTitleAr} /> <WithWord />{" "}
        <span
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "23px",
            fontVariationSettings: '"wght" 500',
          }}
        >
          <LocalizedText en={instructorName} ar={instructorNameAr} />
        </span>
      </span>

      <span
        className="absolute box-border overflow-hidden"
        style={{
          top: 23 + 23 + 3 + 23 + 11,
          left: arabic ? undefined : textStart,
          right: arabic ? textStart : undefined,
          display: "flex",
          width: TABLET_TRACK_WIDTH_PX,
          height: TABLET_TRACK_HEIGHT_PX,
          padding: "0 16px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 24,
          border: SOFT_BORDER,
        }}
        aria-hidden
      >
        <span
          className="absolute"
          style={{
            left: arabic ? undefined : 0,
            right: arabic ? 0 : undefined,
            top: 0,
            bottom: 0,
            width: TABLET_TRACK_FILL_WIDTH_PX,
            height: "auto",
            borderRadius: 24,
            border: "none",
            borderRight: arabic ? undefined : SOFT_BORDER,
            borderLeft: arabic ? SOFT_BORDER : undefined,
            background: arabic
              ? "linear-gradient(270deg, var(--Blue, #66E0F2) 0%, var(--Bright-Green, #89F496) 100%)"
              : "var(--gradient, linear-gradient(90deg, var(--Blue, #66E0F2) 0%, var(--Bright-Green, #89F496) 100%))",
          }}
        />
        {Array.from({ length: TRACK_TICK_COUNT }, (_, index) => (
          <span
            key={index}
            className="absolute"
            style={{
              left: arabic ? undefined : TABLET_TRACK_TICK_FIRST_LEFT_PX + index * TABLET_TRACK_TICK_GAP_PX,
              right: arabic ? TABLET_TRACK_TICK_FIRST_LEFT_PX + index * TABLET_TRACK_TICK_GAP_PX : undefined,
              top: "50%",
              width: TRACK_TICK_WIDTH_PX,
              height: TABLET_TRACK_TICK_HEIGHT_PX,
              transform: "translateY(-50%)",
              background: "#000",
            }}
          />
        ))}
      </span>

      <span
        className="absolute"
        style={{
          top: "50%",
          right: arabic ? undefined : 35,
          left: arabic ? 35 : undefined,
          transform: "translateY(-50%)",
        }}
      >
        <ContinueLearningCtaButton
          border={SOFT_BORDER}
          mirror={arabic}
          size={arabic ? "tablet" : undefined}
        />
      </span>
    </Link>
  );
}

export function ContinueLearningSection({  courses,
  /** When false, skip the full-bleed rule above the heading (profile already has section rules). */
  showTopRule = true,
  /** When false, desktop rule + heading are rendered by the parent (logged-in `/home`). */
  showDesktopIntro = true,
  className = "",
}: {
  courses: ContinueLearningCardDto[];
  showTopRule?: boolean;
  showDesktopIntro?: boolean;
  className?: string;
}) {
  const arabic = useArabicLayout();

  if (courses.length === 0 && showTopRule) return null;

  const showDesktopRule = showTopRule && showDesktopIntro;

  return (
    <div className={className}>
      {showDesktopRule ? (
        <div
          className="mx-auto mt-[31px] hidden lg:block"
          style={{
            width: 1440,
            maxWidth: "100%",
            height: 0.3,
            background: "#000",
          }}
          aria-hidden
        />
      ) : null}

      <div
        className={
          arabic
            ? "max-[743px]:pr-[27px] max-[743px]:pl-0 min-[744px]:max-lg:pr-[61px] min-[744px]:max-lg:pl-0 lg:pl-[120px] lg:pr-[69px]"
            : "max-[743px]:pl-[27px] max-[743px]:pr-0 min-[744px]:max-lg:pl-[61px] min-[744px]:max-lg:pr-0 lg:pl-[120px] lg:pr-[69px]"
        }
      >
        <h2
          className={`${showTopRule ? "max-lg:mt-0 lg:mt-[40px]" : ""} m-0 w-full uppercase min-[744px]:hidden`}
          style={{ textAlign: arabic ? "right" : undefined }}
        >
          {arabic ? (
            <span
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
                fontVariationSettings: '"wght" 400',
              }}
            >
              استمر في التعلم
            </span>
          ) : (
            <>
              <span
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "120%",
                }}
              >
                <Tr>CONTINUE</Tr>{" "}
              </span>
              <span
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "24px",
                  fontStyle: "italic",
                  fontWeight: 700,
                  lineHeight: "120%",
                }}
              >
                <Tr>LEARNING</Tr>
              </span>
            </>
          )}
        </h2>

        <h2
          className={`${showTopRule ? "max-lg:mt-0" : ""} m-0 hidden w-full uppercase min-[744px]:block lg:hidden`}
          style={{ textAlign: arabic ? "right" : undefined }}
        >
          {arabic ? (
            <span
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: 32,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
                fontVariationSettings: '"wght" 400',
              }}
            >
              استمر في التعلم
            </span>
          ) : (
            <>
              <span
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: 32,
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "120%",
                }}
              >
                <Tr>CONTINUE</Tr>{" "}
              </span>
              <span
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: 32,
                  fontStyle: "italic",
                  fontWeight: 700,
                  lineHeight: "120%",
                }}
              >
                <Tr>LEARNING</Tr>
              </span>
            </>
          )}
        </h2>

        {showDesktopIntro ? (
          <h2
            className={`${showTopRule ? "mt-[40px]" : ""} hidden w-full uppercase lg:block`}
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: "36px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
              fontVariationSettings: '"wght" 400',
            }}
          >
            <Tr>CONTINUE</Tr>{" "}
            <span
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: "36px",
                fontStyle: "italic",
                fontWeight: 700,
                lineHeight: "120%",
                fontVariationSettings: '"wght" 700',
              }}
            >
              <Tr>LEARNING</Tr>
            </span>
          </h2>
        ) : null}
      </div>

      <div className="mt-[31px] flex w-full flex-col items-center gap-[16px] min-[744px]:hidden">
        {courses.map((course) => (
          <ContinueLearningMobileCard key={course.continueHref} {...course} />
        ))}
      </div>

      <div className="mt-[31px] hidden w-full flex-col items-center gap-[16px] min-[744px]:flex lg:hidden">
        {courses.map((course) => (
          <ContinueLearningTabletCard key={course.continueHref} {...course} />
        ))}
      </div>

      <div
        className="hidden lg:block"
        style={{ marginTop: 40, paddingLeft: arabic ? 0 : 120, paddingRight: arabic ? 120 : 0 }}
      >
        <div className={`flex flex-col gap-[25px] ${arabic ? "items-end" : ""}`}>
          {courses.map((course) => (
            <ContinueLearningDesktopRow key={course.continueHref} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
}