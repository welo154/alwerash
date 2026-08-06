"use client";

import Link from "next/link";
import { useId } from "react";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

/** Mentor portrait for all landing mentor cards (Figma subtract shape). */
const MENTOR_CARD_PHOTO = "/landing/mentor-card-photo.png";

/** Card silhouette — viewBox 383×357 (Figma), rendered 1:1 at 383×357px. */
const CARD_PATH =
  "M328 0C358.376 2.67367e-06 383 24.6244 383 55V302C383 332.376 358.376 357 328 357H55C24.6244 357 0.000156442 332.376 0 302V110.48C0 82.8662 22.3858 60.4805 50 60.4805H136.197C150.557 60.4805 162.197 48.8396 162.197 34.4805C162.197 15.4374 177.635 0 196.678 0H328Z";

/** Figma “inside” stroke path — paired with mask for a clean 0.3px outline. */
const CARD_STROKE_MASK_PATH =
  "M328 0V-0.3V-0.3V0ZM383 55H383.3V55H383ZM383 302H383.3V302H383ZM55 357V357.3V357.3V357ZM0 302H-0.3V302H0ZM162.197 34.4805L162.497 34.4805V34.4805H162.197ZM328 0V0.3C358.21 0.300003 382.7 24.7901 382.7 55H383H383.3C383.3 24.4587 358.541 -0.299997 328 -0.3V0ZM383 55H382.7V302H383H383.3V55H383ZM383 302H382.7C382.7 332.21 358.21 356.7 328 356.7V357V357.3C358.541 357.3 383.3 332.541 383.3 302H383ZM328 357V356.7H55V357V357.3H328V357ZM55 357V356.7C24.7901 356.7 0.300156 332.21 0.3 302H0H-0.3C-0.299843 332.541 24.4588 357.3 55 357.3V357ZM0 302H0.3V110.48H0H-0.3V302H0ZM50 60.4805V60.7805H136.197V60.4805V60.1805H50V60.4805ZM136.197 60.4805V60.7805C150.722 60.7805 162.497 49.0053 162.497 34.4805L162.197 34.4805L161.897 34.4805C161.897 48.674 150.391 60.1805 136.197 60.1805V60.4805ZM196.678 0V0.3H328V0V-0.3H196.678V0ZM162.197 34.4805H162.497C162.497 15.6031 177.8 0.3 196.678 0.3V0V-0.3C177.469 -0.3 161.897 15.2717 161.897 34.4805H162.197ZM0 110.48H0.3C0.3 83.0319 22.5515 60.7805 50 60.7805V60.4805V60.1805C22.2201 60.1805 -0.3 82.7005 -0.3 110.48H0Z";

export type LandingMentorCardProps = {
  variant: "popular" | "watched";
  name: string;
  profession: string;
  /** When set, the whole card links to the public mentor profile. */
  href?: string;
  /** When set, card click opens a modal instead of navigating. */
  onOpen?: () => void;
  widthPx?: number;
  heightPx?: number;
  /** Fill grid cell width; height follows {@link MENTOR_CARD_ASPECT}. */
  fillWidth?: boolean;
};

const MENTOR_CARD_ASPECT = 383 / 357;

export function LandingMentorCard({
  variant,
  name,
  profession,
  href,
  onOpen,
  widthPx = 383,
  heightPx = 357,
  fillWidth = false,
}: LandingMentorCardProps) {
  const badge = variant === "popular" ? "MOST POPULAR" : "MOST WATCHED";
  const rawId = useId().replace(/:/g, "");
  const maskId = `mentor-card-mask-${rawId}`;
  const clipId = `mentor-card-clip-${rawId}`;
  const isInteractive = Boolean(onOpen || href);

  const sizeStyle = fillWidth
    ? ({ width: "100%", aspectRatio: `${MENTOR_CARD_ASPECT}` } as const)
    : ({ width: `${widthPx}px`, height: `${heightPx}px` } as const);

  const card = (
    <article
      className={`group relative max-w-full shrink-0 overflow-hidden${fillWidth ? " mx-auto w-full" : " ml-0"}`}
      style={sizeStyle}
      aria-hidden={isInteractive ? true : undefined}
      aria-label={isInteractive ? undefined : `${name}, ${profession}. ${badge}`}
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{ overflow: "hidden" }}
        viewBox="0 0 383 357"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={CARD_PATH} />
          </clipPath>
          <mask id={maskId} fill="white">
            <path d={CARD_PATH} fill="white" />
          </mask>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          <foreignObject x="0" y="0" width="383" height="357">
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MENTOR_CARD_PHOTO}
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 22%",
                  transform: "scale(1.14)",
                  transformOrigin: "center 28%",
                  display: "block",
                }}
              />
            </div>
          </foreignObject>
        </g>

        {/* Default thin black outline */}
        <path
          d={CARD_STROKE_MASK_PATH}
          className="fill-black transition-opacity duration-200 group-hover:opacity-0"
          mask={`url(#${maskId})`}
        />

        {/* Hover: 2px inside stroke (strokeWidth 4 + clip ≈ 2px visible) */}
        <g
          clipPath={`url(#${clipId})`}
          className="pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          <path
            d={CARD_PATH}
            fill="none"
            stroke="var(--Green, #8AF396)"
            strokeWidth={4}
          />
        </g>

        <foreignObject x="24" y="10" width="131" height="52">
          <div
            className="text-black transition-colors duration-200 group-hover:text-[#004B3C]"
            style={{
              fontFamily: pangeaFont,
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "99%",
              width: "131px",
              maxWidth: "131px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            <span style={{ fontStyle: "normal" }}>MOST </span>
            <span style={{ fontStyle: "italic" }}>
              {variant === "popular" ? "POPULAR" : "WATCHED"}
            </span>
          </div>
        </foreignObject>

        <foreignObject x="27" y="0" width="356" height="357">
          <div
            style={{
              boxSizing: "border-box",
              height: "100%",
              paddingBottom: 38,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              maxWidth: "356px",
            }}
          >
            <div
              className="text-[color:var(--White,#FFF)] transition-colors duration-200 group-hover:text-[color:var(--Green,#8AF396)]"
              style={{
                fontFamily: pangeaFont,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                opacity: 0.6,
                marginBottom: 6,
              }}
            >
              MEET
            </div>
            <div
              className="text-[color:var(--White,#FFF)] transition-colors duration-200 group-hover:text-[color:var(--Green,#8AF396)]"
              style={{
                fontFamily: pangeaFont,
                fontSize: "32px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                width: 250,
                maxWidth: 250,
                overflowWrap: "break-word",
              }}
            >
              {name}
            </div>
            <div
              className="text-[color:var(--White,#FFF)] transition-colors duration-200 group-hover:text-[color:var(--Green,#8AF396)]"
              style={{
                fontFamily: pangeaFont,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              {profession}
            </div>
          </div>
        </foreignObject>
      </svg>

      <span className="sr-only">
        {name}, {profession}.
      </span>
    </article>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${name}, ${profession}. ${badge}`}
        className={`group mx-auto block max-w-full shrink-0 cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left text-inherit outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2${fillWidth ? " w-full" : ""}`}
        style={sizeStyle}
      >
        {card}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${name}, ${profession}. ${badge}`}
        className={`group mx-auto block max-w-full shrink-0 overflow-hidden text-inherit no-underline outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2${fillWidth ? " w-full" : ""}`}
        style={sizeStyle}
      >
        {card}
      </Link>
    );
  }

  return card;
}
