"use client";

import { useId } from "react";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const ARC_PATH =
  "M143 0.0996094C221.922 0.0996094 285.9 63.9458 285.9 142.703C285.9 172.329 276.846 199.844 261.35 222.645C255.55 231.179 243.476 231.096 235.576 224.401C227.228 217.327 225.51 204.505 231.117 195.101C240.177 179.905 245.382 162.152 245.382 143.187C245.382 87.0273 199.76 41.502 143.484 41.502C87.209 41.5022 41.5881 87.0274 41.5879 143.187C41.5879 161.831 46.6169 179.304 55.3945 194.328C61.0172 203.952 59.2026 216.996 50.6875 224.178C42.6296 230.973 30.3383 231.059 24.4551 222.357C9.07796 199.613 0.0996094 172.205 0.0996094 142.703C0.0996755 63.9458 64.0784 0.0996094 143 0.0996094Z";

const ARC_VIEW_WIDTH = 286;
const ARC_VIEW_HEIGHT = 230;

function ActivityProgressArc({ progressPercent }: { progressPercent: number }) {
  const clipId = useId();
  const gradientId = useId();
  const clamped = Math.min(100, Math.max(0, progressPercent));
  const fillWidth = (clamped / 100) * ARC_VIEW_WIDTH;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={286}
      height={238}
      viewBox="0 0 286 230"
      fill="none"
      className="block"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="286" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--Blue, #66E0F2)" />
          <stop offset="100%" stopColor="var(--Bright-Green, #89F496)" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x={0} y={0} width={fillWidth} height={ARC_VIEW_HEIGHT} />
        </clipPath>
      </defs>
      <path d={ARC_PATH} fill="#FFF" stroke="#000" strokeWidth={0.2} />
      <path
        d={ARC_PATH}
        fill={`url(#${gradientId})`}
        stroke="#000"
        strokeWidth={0.2}
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}

type Props = {
  progressPercent: number;
};

export function ActivityProgressMobileCard({ progressPercent }: Props) {
  const displayPercent = Math.min(100, Math.max(0, Math.round(progressPercent)));

  return (
    <div
      className="relative box-border h-[305px] w-[315px] max-w-full shrink-0 overflow-hidden rounded-[50px] border-[0.3px] border-[var(--Black,#000)]"
      style={{ background: "var(--White, #FFF)" }}
      aria-label={`Learning progress ${displayPercent} percent`}
    >
      <div className="absolute left-1/2 top-[21px] -translate-x-1/2">
        <ActivityProgressArc progressPercent={displayPercent} />
      </div>

      <p
        className="absolute left-1/2 top-[116px] m-0 w-full -translate-x-1/2 text-center"
        style={{
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: "40px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
          fontVariationSettings: '"wght" 400',
        }}
      >
        {displayPercent}%
      </p>

      <p
        className="absolute left-1/2 top-[164px] m-0 w-full -translate-x-1/2 text-center uppercase"
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
        PROGRESS
      </p>
    </div>
  );
}
