import type { WeeklyActivitySummary } from "@/lib/learning-activity";
import { formatSecondsAsHhMm } from "@/lib/learning-activity";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const HIGHLIGHT = "#8AF396";

type Props = {
  summary: WeeklyActivitySummary;
  /** 0 = Sunday … 6 = Saturday (UTC), usually `new Date().getUTCDay()`. */
  highlightDayIndex: number;
  variant?: "desktop" | "mobile" | "tablet";
};

export function WeeklyActivityBarCard({
  summary,
  highlightDayIndex,
  variant = "desktop",
}: Props) {
  const isMobile = variant === "mobile";
  const BAR_MAX_PX = isMobile ? 122 : 202;
  const MIN_SCALE_SECONDS = 3600;
  const barColWidth = isMobile ? 34 : 49;
  const barGap = isMobile ? 5 : 6;

  const maxSeconds = Math.max(
    MIN_SCALE_SECONDS,
    ...summary.days.map((d) => d.watchSeconds)
  );
  const weekLabel = formatSecondsAsHhMm(summary.weekTotalSeconds);
  const highlightDay = summary.days[highlightDayIndex] ?? summary.days[0];
  const tooltipLabel = formatSecondsAsHhMm(highlightDay?.watchSeconds ?? 0);

  return (
    <div
      className={`relative box-border flex max-w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded-[50px] border-[var(--Black,#000)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--Green,#8AF396)] hover:shadow-[0_0_0_1px_var(--Green,#8AF396)] ${
        isMobile
          ? "h-[305px] w-[315px] border-[0.3px] pt-[23px] pr-[24px] pb-[15px] pl-[24px]"
          : "h-[401px] w-[445px] border pt-[31px] px-[31px] pb-[21px]"
      }`}
      style={{ background: "var(--White, #FFF)" }}
      aria-label="Weekly activity"
    >
      <div>
        <p
          className="m-0 uppercase"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: isMobile ? "24px" : "32px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            fontVariationSettings: '"wght" 400',
          }}
        >
          ACTIVITY
        </p>
        <p
          className="m-0 mt-[3px]"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: isMobile ? "14px" : "16px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            opacity: 0.6,
            fontVariationSettings: '"wght" 400',
          }}
        >
          Learnt this week
        </p>
        <p
          className={`m-0 ${isMobile ? "mt-[4px]" : "mt-[5px]"}`}
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: "32px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            fontVariationSettings: '"wght" 400',
          }}
        >
          {weekLabel}
        </p>
      </div>

      <div className="relative mt-auto flex min-h-0 flex-1 flex-col justify-end">
        <div
          className="flex items-end"
          style={{
            gap: `${barGap}px`,
            height: `${BAR_MAX_PX + (isMobile ? 36 : 52)}px`,
          }}
        >
          {summary.days.map((d, i) => {
            const isHi = i === highlightDayIndex;
            const ratio = d.watchSeconds / maxSeconds;
            const barH = Math.max(8, Math.round(ratio * BAR_MAX_PX));
            return (
              <div
                key={d.dateKey}
                className="relative flex shrink-0 flex-col items-center justify-end"
                style={{
                  width: barColWidth,
                  height: BAR_MAX_PX + (isMobile ? 32 : 44),
                }}
              >
                {isHi ? (
                  <div
                    className="absolute flex items-center justify-center rounded-[50px] border-[0.3px] border-[var(--Black,#000)]"
                    style={{
                      background: "var(--Green, #8AF396)",
                      bottom: barH + (isMobile ? 6 : 8),
                      height: isMobile ? 28 : 44,
                      width: isMobile ? 44 : 62,
                    }}
                  >
                    <p
                      className="m-0 whitespace-nowrap"
                      style={{
                        color: "var(--Black, #000)",
                        fontFamily: pangeaFont,
                        fontSize: isMobile ? "10px" : "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "normal",
                        opacity: 0.6,
                        fontVariationSettings: '"wght" 400',
                      }}
                    >
                      {tooltipLabel}
                    </p>
                  </div>
                ) : null}
                <div
                  className="w-full rounded-[50px] border border-[var(--Black,#000)]"
                  style={{
                    height: barH,
                    background: isHi ? HIGHLIGHT : "#fff",
                  }}
                />
              </div>
            );
          })}
        </div>

        <div
          className="flex"
          style={{
            marginTop: isMobile ? "8px" : "8px",
            gap: `${barGap}px`,
          }}
        >
          {summary.days.map((d) => (
            <p
              key={`${d.dateKey}-lab`}
              className="m-0 text-center"
              style={{
                width: barColWidth,
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: isMobile ? "12px" : "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                fontVariationSettings: '"wght" 400',
              }}
            >
              {d.label}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
