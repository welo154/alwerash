import type { WeeklyActivitySummary } from "@/server/home/learning-activity.service";
import { formatSecondsAsHhMm } from "@/server/home/learning-activity.service";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const HIGHLIGHT = "#8AF396";
const BAR_MAX_PX = 202;
const MIN_SCALE_SECONDS = 3600;

type Props = {
  summary: WeeklyActivitySummary;
  /** 0 = Sunday … 6 = Saturday (UTC), usually `new Date().getUTCDay()`. */
  highlightDayIndex: number;
};

export function WeeklyActivityBarCard({ summary, highlightDayIndex }: Props) {
  const maxSeconds = Math.max(
    MIN_SCALE_SECONDS,
    ...summary.days.map((d) => d.watchSeconds)
  );
  const weekLabel = formatSecondsAsHhMm(summary.weekTotalSeconds);
  const highlightDay = summary.days[highlightDayIndex] ?? summary.days[0];
  const tooltipLabel = formatSecondsAsHhMm(highlightDay?.watchSeconds ?? 0);

  return (
    <div
      className="relative box-border flex h-[401px] w-[445px] max-w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded-[50px] border border-[var(--Black,#000)] pt-[31px] px-[31px] pb-[21px] transition-[border-color,box-shadow] duration-200 hover:border-[var(--Green,#8AF396)] hover:shadow-[0_0_0_1px_var(--Green,#8AF396)]"
      style={{ background: "var(--White, #FFF)" }}
      aria-label="Weekly activity"
    >
      <div>
        <p
          className="m-0 uppercase"
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
          ACTIVITY
        </p>
        <p
          className="m-0 mt-[3px]"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: "16px",
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
          className="m-0 mt-[5px]"
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
          className="flex items-end gap-[6px]"
          style={{ height: `${BAR_MAX_PX + 52}px` }}
        >
          {summary.days.map((d, i) => {
            const isHi = i === highlightDayIndex;
            const ratio = d.watchSeconds / maxSeconds;
            const barH = Math.max(10, Math.round(ratio * BAR_MAX_PX));
            return (
              <div
                key={d.dateKey}
                className="relative flex w-[49px] shrink-0 flex-col items-center justify-end"
                style={{ height: BAR_MAX_PX + 44 }}
              >
                {isHi ? (
                  <div
                    className="absolute flex h-[44px] w-[62px] items-center justify-center rounded-[50px] border-[0.3px] border-[var(--Black,#000)]"
                    style={{
                      background: "var(--Green, #8AF396)",
                      bottom: barH + 8,
                    }}
                  >
                    <p
                      className="m-0 whitespace-nowrap"
                      style={{
                        color: "var(--Black, #000)",
                        fontFamily: pangeaFont,
                        fontSize: "16px",
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

        <div className="mt-[8px] flex gap-[6px]">
          {summary.days.map((d) => (
            <p
              key={`${d.dateKey}-lab`}
              className="m-0 w-[49px] text-center"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: "16px",
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
