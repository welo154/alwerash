import { ActivityScheduleCard } from "@/components/home/ActivityScheduleCard";
import { WeeklyActivityBarCard } from "@/components/home/WeeklyActivityBarCard";
import type { WeeklyActivitySummary } from "@/lib/learning-activity";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

export function TrackActivitySection({
  weeklyActivity,
  activityHighlightDayIndex,
  className = "",
}: {
  weeklyActivity: WeeklyActivitySummary;
  activityHighlightDayIndex: number;
  className?: string;
}) {
  return (
    <section
      className={`w-full pl-[120px] pr-6 ${className}`.trim()}
      aria-label="Activity tracking"
    >
      <h2
        className="uppercase"
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
        TRACK YOUR ACTIVITY
      </h2>

      <div className="mt-[43px] flex w-full flex-wrap gap-[30px]">
        <WeeklyActivityBarCard
          summary={weeklyActivity}
          highlightDayIndex={activityHighlightDayIndex}
        />
        <ActivityScheduleCard />
      </div>
    </section>
  );
}
