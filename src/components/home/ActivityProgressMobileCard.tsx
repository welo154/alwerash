"use client";

import { useId } from "react";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const ARC_PATH =
  "M143 0.0996094C221.922 0.0996094 285.9 63.9458 285.9 142.703C285.9 172.329 276.846 199.844 261.35 222.645C255.55 231.179 243.476 231.096 235.576 224.401C227.228 217.327 225.51 204.505 231.117 195.101C240.177 179.905 245.382 162.152 245.382 143.187C245.382 87.0273 199.76 41.502 143.484 41.502C87.209 41.5022 41.5881 87.0274 41.5879 143.187C41.5879 161.831 46.6169 179.304 55.3945 194.328C61.0172 203.952 59.2026 216.996 50.6875 224.178C42.6296 230.973 30.3383 231.059 24.4551 222.357C9.07796 199.613 0.0996094 172.205 0.0996094 142.703C0.0996755 63.9458 64.0784 0.0996094 143 0.0996094Z";

const ARC_VIEW_WIDTH = 286;
const ARC_VIEW_HEIGHT = 230;
const ARC_CENTER_X = 143;
const ARC_CENTER_Y = 142.7;
const ARC_MID_RADIUS = 122.15;
const ARC_STROKE_WIDTH = 41.4;
const TICK_LENGTH = 13.076;
const TICK_START_DEG = 146.1;
const TICK_SWEEP_DEG = 247.8;
const TICK_END_DEG = TICK_START_DEG + TICK_SWEEP_DEG;

function roundCoord(n: number) {
  return n.toFixed(4);
}

function arcPoint(deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: ARC_CENTER_X + ARC_MID_RADIUS * Math.cos(rad),
    y: ARC_CENTER_Y + ARC_MID_RADIUS * Math.sin(rad),
  };
}

const ARC_START = arcPoint(TICK_START_DEG);
const ARC_END = arcPoint(TICK_END_DEG);
const ARC_CENTERLINE = `M ${roundCoord(ARC_START.x)} ${roundCoord(ARC_START.y)} A ${ARC_MID_RADIUS} ${ARC_MID_RADIUS} 0 1 1 ${roundCoord(ARC_END.x)} ${roundCoord(ARC_END.y)}`;

function arcTickLine(t: number) {
  const deg = TICK_START_DEG + TICK_SWEEP_DEG * t;
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const half = TICK_LENGTH / 2;
  const inner = ARC_MID_RADIUS - half;
  const outer = ARC_MID_RADIUS + half;
  return {
    x1: roundCoord(ARC_CENTER_X + inner * cos),
    y1: roundCoord(ARC_CENTER_Y + inner * sin),
    x2: roundCoord(ARC_CENTER_X + outer * cos),
    y2: roundCoord(ARC_CENTER_Y + outer * sin),
  };
}

function ActivityProgressArc({
  progressPercent,
  showTrackTicks = false,
}: {
  progressPercent: number;
  showTrackTicks?: boolean;
}) {
  const clipId = useId();
  const trackClipId = useId();
  const gradientId = useId();
  const clamped = Math.min(100, Math.max(0, progressPercent));
  const fillWidth = (clamped / 100) * ARC_VIEW_WIDTH;
  const ticks = Array.from({ length: 9 }, (_, index) => arcTickLine((index + 1) / 10));

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
        <linearGradient
          id={gradientId}
          x1="0"
          y1="119"
          x2="286"
          y2="119"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#66E0F2" />
          <stop offset="1" stopColor="#89F496" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x={0} y={0} width={fillWidth} height={ARC_VIEW_HEIGHT} />
        </clipPath>
        <clipPath id={trackClipId}>
          <path d={ARC_PATH} />
        </clipPath>
      </defs>
      <path d={ARC_PATH} fill="#FFF" stroke="#000" strokeWidth={0.2} />
      {showTrackTicks ? (
        clamped > 0 ? (
          <path
            d={ARC_CENTERLINE}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={ARC_STROKE_WIDTH}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${clamped} 100`}
            clipPath={`url(#${trackClipId})`}
          />
        ) : null
      ) : (
        <path
          d={ARC_PATH}
          fill={`url(#${gradientId})`}
          stroke="#000"
          strokeWidth={0.2}
          clipPath={`url(#${clipId})`}
        />
      )}
      {showTrackTicks
        ? ticks.map((tick) => (
            <line
              key={`${tick.x1}-${tick.y1}`}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke="#000"
              strokeWidth={0.2}
            />
          ))
        : null}
    </svg>
  );
}

type Props = {
  progressPercent: number;
  showTrackTicks?: boolean;
};

export function ActivityProgressMobileCard({
  progressPercent,
  showTrackTicks = false,
}: Props) {
  const displayPercent = Math.min(100, Math.max(0, Math.round(progressPercent)));

  return (
    <div
      className="relative box-border h-[305px] w-[315px] max-w-full shrink-0 overflow-hidden rounded-[50px] border-[0.3px] border-[var(--Black,#000)]"
      style={{ background: "var(--White, #FFF)" }}
      aria-label={`Learning progress ${displayPercent} percent`}
    >
      <div className="absolute left-1/2 top-[21px] -translate-x-1/2">
        <ActivityProgressArc
          progressPercent={displayPercent}
          showTrackTicks={showTrackTicks}
        />
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
