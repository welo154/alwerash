"use client";

import { useId } from "react";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

/** Card silhouette — matches design SVG (409×425). */
const CARD_PATH =
  "M354 0C384.376 2.09384e-06 409 24.6244 409 55V370C409 400.375 384.376 425 354 425H55C24.6245 425 0.000205489 400.375 0 370V122C0 94.3858 22.3858 72 50 72H147.208C161.567 72 173.208 60.3594 173.208 46C173.208 20.5949 193.803 0 219.208 0H354Z";

/** Figma “inside” stroke path — paired with mask for a clean 1px outline. */
const CARD_STROKE_MASK_PATH =
  "M354 0V-1V-1V0ZM409 55H410V55L409 55ZM409 370H410V370H409ZM55 425V426V426V425ZM0 370H-1V370H0ZM354 0V1C383.823 1 408 25.1767 408 55L409 55L410 55C410 24.0721 384.928 -0.999998 354 -1V0ZM409 55H408V370H409H410V55H409ZM409 370H408C408 399.823 383.823 424 354 424V425V426C384.928 426 410 400.928 410 370H409ZM354 425V424H55V425V426H354V425ZM55 425V424C25.1768 424 1.0002 399.823 1 370H0H-1C-0.999791 400.928 24.0722 426 55 426V425ZM0 370H1V122H0H-1V370H0ZM50 72V73H147.208V72V71H50V72ZM147.208 72V73C162.12 73 174.208 60.9117 174.208 46H173.208H172.208C172.208 59.8071 161.015 71 147.208 71V72ZM219.208 0V1H354V0V-1H219.208V0ZM173.208 46H174.208C174.208 21.1472 194.355 1 219.208 1V0V-1C193.251 -1 172.208 20.0426 172.208 46H173.208ZM0 122H1C1 94.938 22.938 73 50 73V72V71C21.8335 71 -1 93.8335 -1 122H0Z";

export type LandingMentorCardProps = {
  variant: "popular" | "watched";
  name: string;
  profession: string;
};

export function LandingMentorCard({ variant, name, profession }: LandingMentorCardProps) {
  const badge = variant === "popular" ? "MOST POPULAR" : "MOST WATCHED";
  const rawId = useId().replace(/:/g, "");
  const maskId = `mentor-card-mask-${rawId}`;

  return (
    <article
      className="relative mx-auto aspect-[409/425] w-full max-w-[409px] shrink-0 overflow-visible"
      aria-label={`${name}, ${profession}. ${badge}`}
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 409 425"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          <mask id={maskId} fill="white">
            <path d={CARD_PATH} fill="white" />
          </mask>
        </defs>
        <path d={CARD_PATH} fill="var(--White, #FFF)" />
        <path d={CARD_STROKE_MASK_PATH} fill="#000" mask={`url(#${maskId})`} />

        <foreignObject x="24" y="10" width="131" height="52">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="text-black"
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

        <foreignObject x="27" y="0" width="382" height="425">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              boxSizing: "border-box",
              height: "100%",
              paddingBottom: 38,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              maxWidth: "382px",
            }}
          >
            <div
              style={{
                color: "var(--Black, #000)",
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
              style={{
                color: "var(--Black, #000)",
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
              style={{
                color: "var(--Black, #000)",
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
}
