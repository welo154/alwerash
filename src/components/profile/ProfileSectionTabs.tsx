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

function MobileRule() {
  return (
    <div className="flex w-full justify-center" aria-hidden>
      <div
        style={{
          width: 391,
          maxWidth: "100%",
          height: 0,
          opacity: 0.6,
          background: "#000",
          borderTop: "1px solid #000",
        }}
      />
    </div>
  );
}

export function ProfileSectionTabs({
  initialTab = "Learning",
  continueLearningCourses,
  weeklyActivity,
  activityHighlightDayIndex,
  learningProgressPercent,
}: {
  initialTab?: ProfileTab;
  continueLearningCourses: ContinueLearningCardDto[];
  weeklyActivity: WeeklyActivitySummary;
  activityHighlightDayIndex: number;
  learningProgressPercent: number;
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

  function renderTabs(opts: {
    fontSize: number;
    gap: number;
    paddingLeft: number;
    height: number;
  }) {
    return (
      <div
        className="flex items-center"
        style={{
          height: opts.height,
          paddingLeft: opts.paddingLeft,
          gap: opts.gap,
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
                fontSize: opts.fontSize,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                fontVariationSettings: '"wght" 400',
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div id="profile-sections">
      <div className="min-[744px]:hidden" style={{ marginTop: 23 }}>
        <MobileRule />
        {renderTabs({ fontSize: 20, gap: 61, paddingLeft: 30, height: 56 })}
        <MobileRule />
      </div>

      <div className="mt-[23px] hidden min-[744px]:block lg:hidden">
        <FullBleedRule />
        {renderTabs({ fontSize: 24, gap: 61, paddingLeft: 61, height: 56 })}
        <FullBleedRule />
      </div>

      <div className="hidden lg:block">
        <FullBleedRule className="mt-[59px]" />
        {renderTabs({ fontSize: 24, gap: 50, paddingLeft: 120, height: 65 })}
        <FullBleedRule />
      </div>

      {selected === "Learning" ? (
        <ContinueLearningSection
          courses={continueLearningCourses}
          showTopRule={false}
          className="max-[743px]:mt-[40px] max-[743px]:pb-[40px] min-[744px]:max-lg:mt-[48px] min-[744px]:max-lg:pb-[40px] lg:mt-[67px] lg:pb-16"
        />
      ) : null}

      {selected === "Activity" ? (
        <TrackActivitySection
          weeklyActivity={weeklyActivity}
          activityHighlightDayIndex={activityHighlightDayIndex}
          learningProgressPercent={learningProgressPercent}
          className="max-[743px]:mt-[40px] max-[743px]:pb-[40px] min-[744px]:max-lg:mt-[48px] min-[744px]:max-lg:pb-[40px] lg:mt-[67px] lg:pb-16"
        />
      ) : null}

      {selected === "Projects" ? (
        <ProfileProjectsSection className="max-lg:mt-[40px] max-lg:pb-[40px] lg:mt-[68px] lg:pb-16" />
      ) : null}
    </div>
  );
}
