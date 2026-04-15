import type { MonthActivitySummary, WeeklyActivitySummary } from "@/server/home/learning-activity.service";
import { formatSecondsAsHhMm } from "@/server/home/learning-activity.service";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

type Props = {
  weekly: WeeklyActivitySummary;
  month: MonthActivitySummary;
  highlightDayIndex: number;
};

export function WeekDailyOverviewCard({ weekly, month, highlightDayIndex }: Props) {
  const monthTitle = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(month.year, month.monthIndex, 1)));

  const todaySeconds = weekly.days[highlightDayIndex]?.watchSeconds ?? 0;

  return (
    <div
      className="relative min-h-[401px] w-full max-w-[794px] flex-1 overflow-hidden rounded-[50px] border border-[var(--Black,#000)] px-10 py-8"
      style={{ background: "var(--White, #FFF)" }}
      aria-label="Daily and monthly overview"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-6">
        <h3
          className="m-0 uppercase"
          style={{
            color: "#000",
            fontFamily: pangeaFont,
            fontSize: "28px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            fontVariationSettings: '"wght" 400',
          }}
        >
          {monthTitle}
        </h3>
        <p
          className="m-0"
          style={{
            color: "#000",
            fontFamily: pangeaFont,
            fontSize: "18px",
            opacity: 0.65,
          }}
        >
          Month total:{" "}
          <span style={{ opacity: 1, fontWeight: 500 }}>
            {formatSecondsAsHhMm(month.monthTotalSeconds)}
          </span>
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <p
            className="m-0 text-sm uppercase tracking-wide opacity-50"
            style={{ fontFamily: pangeaFont }}
          >
            Today (UTC)
          </p>
          <p
            className="m-0 mt-2"
            style={{
              fontFamily: pangeaFont,
              fontSize: "42px",
              fontWeight: 500,
              lineHeight: "1.1",
            }}
          >
            {formatSecondsAsHhMm(todaySeconds)}
          </p>
        </div>
        <div>
          <p
            className="m-0 text-sm uppercase tracking-wide opacity-50"
            style={{ fontFamily: pangeaFont }}
          >
            This week (UTC)
          </p>
          <p
            className="m-0 mt-2"
            style={{
              fontFamily: pangeaFont,
              fontSize: "28px",
              fontWeight: 500,
              lineHeight: "1.15",
            }}
          >
            {formatSecondsAsHhMm(weekly.weekTotalSeconds)}
          </p>
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {weekly.days.map((d, i) => {
          const isToday = i === highlightDayIndex;
          return (
            <li
              key={d.dateKey}
              className="flex items-center justify-between rounded-2xl border border-black/15 px-4 py-3"
              style={{
                background: isToday ? "rgba(138, 243, 150, 0.25)" : "transparent",
              }}
            >
              <span style={{ fontFamily: pangeaFont, fontSize: "18px", fontWeight: isToday ? 600 : 400 }}>
                {d.label} · {d.dateKey}
                {isToday ? " · today" : ""}
              </span>
              <span
                style={{
                  fontFamily: pangeaFont,
                  fontSize: "18px",
                  opacity: 0.75,
                  fontWeight: isToday ? 600 : 400,
                }}
              >
                {formatSecondsAsHhMm(d.watchSeconds)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
