"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ContinueLearningSection } from "@/components/home/ContinueLearningSection";
import { TrackActivitySection } from "@/components/home/TrackActivitySection";
import { ProfileProjectsSection } from "@/components/profile/ProfileProjectsSection";
import type { ContinueLearningCardDto } from "@/server/home/continue-learning.service";
import type { WeeklyActivitySummary } from "@/lib/learning-activity";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const TABS = ["Learning", "Activity", "Projects"] as const;
type ProfileTab = (typeof TABS)[number];

function parseProfileTab(value: string | null | undefined): ProfileTab | undefined {
  if (value === "Learning" || value === "Activity" || value === "Projects") {
    return value;
  }
  return undefined;
}

function FullBleedRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 ${className}`.trim()}
      style={{
        height: 0,
        borderTop: "1px solid #000",
        opacity: 0.6,
      }}
      aria-hidden
    />
  );
}

export function ProfileSectionTabs({
  initialTab = "Learning",
  continueLearningCourses,
  weeklyActivity,
  activityHighlightDayIndex,
}: {
  initialTab?: ProfileTab;
  continueLearningCourses: ContinueLearningCardDto[];
  weeklyActivity: WeeklyActivitySummary;
  activityHighlightDayIndex: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = useState<ProfileTab>(
    () => parseProfileTab(searchParams.get("tab")) ?? initialTab
  );

  useEffect(() => {
    const next = parseProfileTab(searchParams.get("tab"));
    if (next) setSelected(next);
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.get("tab")) return;
    document.getElementById("profile-sections")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [searchParams]);

  function selectTab(tab: ProfileTab) {
    setSelected(tab);
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", tab);
    next.delete("edit");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div id="profile-sections">
      <FullBleedRule className="mt-[59px]" />

      <div
        className="flex items-center"
        style={{
          height: 65,
          paddingLeft: 120,
          gap: 50,
        }}
        role="tablist"
        aria-label="Profile sections"
      >
        {TABS.map((tab) => {
          const isSelected = selected === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => selectTab(tab)}
              className="border-0 bg-transparent p-0"
              style={{
                color: isSelected
                  ? "var(--Purple, #FF8CFF)"
                  : "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: 24,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <FullBleedRule />

      {selected === "Learning" ? (
        <ContinueLearningSection
          courses={continueLearningCourses}
          showTopRule={false}
          className="mt-[67px] pb-16"
        />
      ) : null}

      {selected === "Activity" ? (
        <TrackActivitySection
          weeklyActivity={weeklyActivity}
          activityHighlightDayIndex={activityHighlightDayIndex}
          className="mt-[67px] pb-16"
        />
      ) : null}

      {selected === "Projects" ? (
        <ProfileProjectsSection className="mt-[68px] pb-16" />
      ) : null}
    </div>
  );
}
