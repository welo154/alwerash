import type { WeeklyActivitySummary } from "@/server/home/learning-activity.service";
import { formatSecondsAsHhMm } from "@/server/home/learning-activity.service";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

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
      className="relative h-[401px] w-full max-w-[509px] overflow-hidden rounded-[50px] border border-[var(--Black,#000)]"
      style={{ background: "var(--White, #FFF)" }}
      aria-label="Weekly activity"
    >
      <div className="pt-[31px] pl-[45px]">
        <p
          className="m-0 uppercase"
          style={{
            color: "#000",
            fontFamily: pangeaFont,
            fontSize: "36px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            fontVariationSettings: '"wght" 400',
          }}
        >
          ACTIVITY
        </p>
        <p
          className="m-0 mt-[6px]"
          style={{
            color: "#000",
            fontFamily: pangeaFont,
            fontSize: "18px",
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
          className="m-0 mt-[6px]"
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
          {weekLabel}
        </p>
      </div>

      <div
        className="absolute bottom-[48px] left-0 right-0 flex items-end justify-between px-[40px] pb-0"
        style={{ height: `${BAR_MAX_PX + 52}px`, paddingTop: "12px" }}
      >
        {summary.days.map((d, i) => {
          const isHi = i === highlightDayIndex;
          const ratio = d.watchSeconds / maxSeconds;
          const barH = Math.max(10, Math.round(ratio * BAR_MAX_PX));
          return (
            <div
              key={d.dateKey}
              className="relative flex w-[55px] shrink-0 flex-col items-center justify-end"
              style={{ height: BAR_MAX_PX + 44 }}
            >
              {isHi ? (
                <div
                  className="absolute flex h-[44px] min-w-[70px] items-center justify-center rounded-[50px] border border-[var(--Black,#000)] px-2"
                  style={{
                    background: HIGHLIGHT,
                    bottom: barH + 8,
                  }}
                >
                  <p
                    className="m-0 whitespace-nowrap"
                    style={{
                      color: "#000",
                      fontFamily: pangeaFont,
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                      opacity: 0.85,
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

      <div className="pointer-events-none absolute inset-x-0 bottom-[18px] flex justify-between px-[40px]">
        {summary.days.map((d) => (
          <p
            key={`${d.dateKey}-lab`}
            className="m-0 w-[55px] text-center"
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              opacity: 0.6,
              fontVariationSettings: '"wght" 400',
            }}
          >
            {d.label}
          </p>
        ))}
      </div>
    </div>
  );
}
