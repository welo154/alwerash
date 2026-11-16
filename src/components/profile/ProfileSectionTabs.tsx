"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ContinueLearningSection } from "@/components/home/ContinueLearningSection";
import { TrackActivitySection } from "@/components/home/TrackActivitySection";
import { ProfileProjectsSection } from "@/components/profile/ProfileProjectsSection";
import { useT } from "@/components/i18n/Tr";
import { useArabicLayout } from "@/components/providers/LocaleProvider";
import type { ContinueLearningCardDto } from "@/server/home/continue-learning.service";
import type { WeeklyActivitySummary } from "@/lib/learning-activity";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

function AccountSettingsLink() {
  const t = useT();
  const label = t("Account Settings");

  return (
    <Link
      href="/profile?edit=1"
      className="absolute flex items-center"
      style={{
        right: 120,
        top: "50%",
        transform: "translateY(-50%)",
        textDecoration: "none",
      }}
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={21}
        height={21}
        viewBox="0 0 23 23"
        fill="none"
        aria-hidden
        className="block shrink-0"
      >
        <path
          d="M14.1136 11.25C14.1136 12.8315 12.8315 14.1136 11.25 14.1136C9.66846 14.1136 8.38636 12.8315 8.38636 11.25C8.38636 9.66846 9.66846 8.38636 11.25 8.38636C12.8315 8.38636 14.1136 9.66846 14.1136 11.25ZM18.3136 14.1136C18.1866 14.4015 18.1487 14.7209 18.2048 15.0306C18.261 15.3402 18.4086 15.6259 18.6286 15.8509L18.6859 15.9082C18.8634 16.0855 19.0042 16.296 19.1003 16.5278C19.1964 16.7596 19.2458 17.008 19.2458 17.2589C19.2458 17.5097 19.1964 17.7582 19.1003 17.9899C19.0042 18.2217 18.8634 18.4322 18.6859 18.6095C18.5086 18.787 18.2981 18.9279 18.0663 19.0239C17.8345 19.12 17.5861 19.1695 17.3352 19.1695C17.0843 19.1695 16.8359 19.12 16.6042 19.0239C16.3724 18.9279 16.1618 18.787 15.9845 18.6095L15.9273 18.5523C15.7023 18.3322 15.4166 18.1846 15.1069 18.1285C14.7973 18.0723 14.4779 18.1102 14.19 18.2373C13.9077 18.3583 13.6669 18.5592 13.4973 18.8153C13.3277 19.0714 13.2367 19.3715 13.2355 19.6786V19.8409C13.2355 20.3472 13.0343 20.8328 12.6763 21.1908C12.3183 21.5489 11.8327 21.75 11.3264 21.75C10.82 21.75 10.3345 21.5489 9.97643 21.1908C9.61841 20.8328 9.41727 20.3472 9.41727 19.8409V19.755C9.40988 19.4391 9.30761 19.1326 9.12376 18.8756C8.93991 18.6185 8.68297 18.4227 8.38636 18.3136C8.09846 18.1866 7.77909 18.1487 7.46944 18.2048C7.15979 18.261 6.87406 18.4086 6.64909 18.6286L6.59182 18.6859C6.41451 18.8634 6.20396 19.0042 5.9722 19.1003C5.74044 19.1964 5.49202 19.2458 5.24114 19.2458C4.99025 19.2458 4.74183 19.1964 4.51007 19.1003C4.27831 19.0042 4.06776 18.8634 3.89045 18.6859C3.71295 18.5086 3.57214 18.2981 3.47607 18.0663C3.37999 17.8345 3.33054 17.5861 3.33054 17.3352C3.33054 17.0843 3.37999 16.8359 3.47607 16.6042C3.57214 16.3724 3.71295 16.1618 3.89045 15.9845L3.94773 15.9273C4.16779 15.7023 4.3154 15.4166 4.37155 15.1069C4.42769 14.7973 4.38979 14.4779 4.26273 14.19C4.14173 13.9077 3.94081 13.6669 3.68472 13.4973C3.42862 13.3277 3.12852 13.2367 2.82136 13.2355H2.65909C2.15277 13.2355 1.66718 13.0343 1.30916 12.6763C0.951136 12.3183 0.75 11.8327 0.75 11.3264C0.75 10.82 0.951136 10.3345 1.30916 9.97643C1.66718 9.61841 2.15277 9.41727 2.65909 9.41727H2.745C3.06095 9.40988 3.36737 9.30761 3.62442 9.12376C3.88148 8.93991 4.07727 8.68297 4.18636 8.38636C4.31343 8.09846 4.35133 7.77909 4.29519 7.46944C4.23904 7.15979 4.09142 6.87406 3.87136 6.64909L3.81409 6.59182C3.63659 6.41451 3.49578 6.20396 3.3997 5.9722C3.30363 5.74044 3.25418 5.49202 3.25418 5.24114C3.25418 4.99025 3.30363 4.74183 3.3997 4.51007C3.49578 4.27831 3.63659 4.06776 3.81409 3.89045C3.99139 3.71295 4.20194 3.57214 4.4337 3.47607C4.66546 3.37999 4.91389 3.33054 5.16477 3.33054C5.41566 3.33054 5.66408 3.37999 5.89584 3.47607C6.1276 3.57214 6.33815 3.71295 6.51545 3.89045L6.57273 3.94773C6.79769 4.16779 7.08342 4.3154 7.39307 4.37155C7.70272 4.42769 8.02209 4.38979 8.31 4.26273H8.38636C8.66869 4.14173 8.90947 3.94081 9.07907 3.68472C9.24867 3.42862 9.33968 3.12852 9.34091 2.82136V2.65909C9.34091 2.15277 9.54205 1.66718 9.90007 1.30916C10.2581 0.951136 10.7437 0.75 11.25 0.75C11.7563 0.75 12.2419 0.951136 12.5999 1.30916C12.958 1.66718 13.1591 2.15277 13.1591 2.65909V2.745C13.1603 3.05216 13.2513 3.35226 13.4209 3.60835C13.5905 3.86445 13.8313 4.06536 14.1136 4.18636C14.4015 4.31343 14.7209 4.35133 15.0306 4.29519C15.3402 4.23904 15.6259 4.09142 15.8509 3.87136L15.9082 3.81409C16.0855 3.63659 16.296 3.49578 16.5278 3.3997C16.7596 3.30363 17.008 3.25418 17.2589 3.25418C17.5097 3.25418 17.7582 3.30363 17.9899 3.3997C18.2217 3.49578 18.4322 3.63659 18.6095 3.81409C18.787 3.99139 18.9279 4.20194 19.0239 4.4337C19.12 4.66546 19.1695 4.91389 19.1695 5.16477C19.1695 5.41566 19.12 5.66408 19.0239 5.89584C18.9279 6.1276 18.787 6.33815 18.6095 6.51545L18.5523 6.57273C18.3322 6.79769 18.1846 7.08342 18.1285 7.39307C18.0723 7.70272 18.1102 8.02209 18.2373 8.31V8.38636C18.3583 8.66869 18.5592 8.90947 18.8153 9.07907C19.0714 9.24867 19.3715 9.33968 19.6786 9.34091H19.8409C20.3472 9.34091 20.8328 9.54205 21.1908 9.90007C21.5489 10.2581 21.75 10.7437 21.75 11.25C21.75 11.7563 21.5489 12.2419 21.1908 12.5999C20.8328 12.958 20.3472 13.1591 19.8409 13.1591H19.755C19.4478 13.1603 19.1477 13.2513 18.8916 13.4209C18.6356 13.5905 18.4346 13.8313 18.3136 14.1136Z"
          stroke="var(--Purple, #FF8CFF)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{
          marginLeft: 7,
          color: "var(--Purple, #FF8CFF)",
          fontFamily: pangeaFont,
          fontSize: 18,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
          textDecorationLine: "underline",
          textDecorationStyle: "solid",
          textDecorationSkipInk: "auto",
          textUnderlinePosition: "from-font",
        }}
      >
        {label}
      </span>
    </Link>
  );
}

function AccountSettingsIconButton({ side = "right" }: { side?: "left" | "right" }) {
  const t = useT();
  const label = t("Account Settings");

  return (
    <Link
      href="/profile?edit=1"
      className="absolute flex items-center justify-center"
      style={{
        ...(side === "left" ? { left: 61 } : { right: 61 }),
        top: "50%",
        transform: "translateY(-50%)",
        width: 28,
        height: 28,
        textDecoration: "none",
      }}
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={28}
        height={28}
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden
        className="block shrink-0"
      >
        <path
          d="M18.5682 14.75C18.5682 16.8587 16.8587 18.5682 14.75 18.5682C12.6413 18.5682 10.9318 16.8587 10.9318 14.75C10.9318 12.6413 12.6413 10.9318 14.75 10.9318C16.8587 10.9318 18.5682 12.6413 18.5682 14.75ZM24.1682 18.5682C23.9988 18.9521 23.9482 19.3779 24.0231 19.7907C24.0979 20.2036 24.2948 20.5846 24.5882 20.8845L24.6645 20.9609C24.9012 21.1973 25.089 21.478 25.2171 21.7871C25.3452 22.0961 25.4111 22.4273 25.4111 22.7618C25.4111 23.0963 25.3452 23.4276 25.2171 23.7366C25.089 24.0456 24.9012 24.3263 24.6645 24.5627C24.4281 24.7994 24.1474 24.9871 23.8384 25.1152C23.5294 25.2433 23.1981 25.3093 22.8636 25.3093C22.5291 25.3093 22.1979 25.2433 21.8889 25.1152C21.5799 24.9871 21.2991 24.7994 21.0627 24.5627L20.9864 24.4864C20.6864 24.193 20.3054 23.9961 19.8926 23.9213C19.4797 23.8464 19.0539 23.8969 18.67 24.0664C18.2936 24.2277 17.9725 24.4956 17.7464 24.837C17.5203 25.1785 17.3989 25.5786 17.3973 25.9882V26.2045C17.3973 26.8796 17.1291 27.5271 16.6517 28.0045C16.1744 28.4818 15.5269 28.75 14.8518 28.75C14.1767 28.75 13.5293 28.4818 13.0519 28.0045C12.5745 27.5271 12.3064 26.8796 12.3064 26.2045V26.09C12.2965 25.6687 12.1602 25.2602 11.915 24.9174C11.6699 24.5747 11.3273 24.3136 10.9318 24.1682C10.5479 23.9988 10.1221 23.9482 9.70925 24.0231C9.29638 24.0979 8.91541 24.2948 8.61545 24.5882L8.53909 24.6645C8.30269 24.9012 8.02195 25.089 7.71294 25.2171C7.40393 25.3452 7.07269 25.4111 6.73818 25.4111C6.40367 25.4111 6.07244 25.3452 5.76342 25.2171C5.45441 25.089 5.17368 24.9012 4.93727 24.6645C4.70061 24.4281 4.51286 24.1474 4.38476 23.8384C4.25666 23.5294 4.19072 23.1981 4.19072 22.8636C4.19072 22.5291 4.25666 22.1979 4.38476 21.8889C4.51286 21.5799 4.70061 21.2991 4.93727 21.0627L5.01364 20.9864C5.30705 20.6864 5.50387 20.3054 5.57873 19.8926C5.65359 19.4797 5.60306 19.0539 5.43364 18.67C5.2723 18.2936 5.00442 17.9725 4.66296 17.7464C4.3215 17.5203 3.92136 17.3989 3.51182 17.3973H3.29545C2.62036 17.3973 1.97291 17.1291 1.49555 16.6517C1.01818 16.1744 0.75 15.5269 0.75 14.8518C0.75 14.1767 1.01818 13.5293 1.49555 13.0519C1.97291 12.5745 2.62036 12.3064 3.29545 12.3064H3.41C3.83127 12.2965 4.23982 12.1602 4.58256 11.915C4.9253 11.6699 5.18637 11.3273 5.33182 10.9318C5.50124 10.5479 5.55178 10.1221 5.47691 9.70925C5.40205 9.29638 5.20523 8.91541 4.91182 8.61545L4.83545 8.53909C4.59879 8.30269 4.41104 8.02195 4.28294 7.71294C4.15484 7.40393 4.08891 7.07269 4.08891 6.73818C4.08891 6.40367 4.15484 6.07244 4.28294 5.76342C4.41104 5.45441 4.59879 5.17368 4.83545 4.93727C5.07186 4.70061 5.35259 4.51286 5.66161 4.38476C5.97062 4.25666 6.30185 4.19072 6.63636 4.19072C6.97088 4.19072 7.30211 4.25666 7.61112 4.38476C7.92013 4.51286 8.20087 4.70061 8.43727 4.93727L8.51364 5.01364C8.81359 5.30705 9.19457 5.50387 9.60743 5.57873C10.0203 5.65359 10.4461 5.60306 10.83 5.43364H10.9318C11.3083 5.2723 11.6293 5.00442 11.8554 4.66296C12.0816 4.3215 12.2029 3.92136 12.2045 3.51182V3.29545C12.2045 2.62036 12.4727 1.97291 12.9501 1.49555C13.4275 1.01818 14.0749 0.75 14.75 0.75C15.4251 0.75 16.0725 1.01818 16.5499 1.49555C17.0273 1.97291 17.2955 2.62036 17.2955 3.29545V3.41C17.2971 3.81955 17.4184 4.21968 17.6446 4.56114C17.8707 4.9026 18.1917 5.17048 18.5682 5.33182C18.9521 5.50124 19.3779 5.55178 19.7907 5.47691C20.2036 5.40205 20.5846 5.20523 20.8845 4.91182L20.9609 4.83545C21.1973 4.59879 21.478 4.41104 21.7871 4.28294C22.0961 4.15484 22.4273 4.08891 22.7618 4.08891C23.0963 4.08891 23.4276 4.15484 23.7366 4.28294C24.0456 4.41104 24.3263 4.59879 24.5627 4.83545C24.7994 5.07186 24.9871 5.35259 25.1152 5.66161C25.2433 5.97062 25.3093 6.30185 25.3093 6.63636C25.3093 6.97088 25.2433 7.30211 25.1152 7.61112C24.9871 7.92013 24.7994 8.20087 24.5627 8.43727L24.4864 8.51364C24.193 8.81359 23.9961 9.19457 23.9213 9.60743C23.8464 10.0203 23.8969 10.4461 24.0664 10.83V10.9318C24.2277 11.3083 24.4956 11.6293 24.837 11.8554C25.1785 12.0816 25.5786 12.2029 25.9882 12.2045H26.2045C26.8796 12.2045 27.5271 12.4727 28.0045 12.9501C28.4818 13.4275 28.75 14.0749 28.75 14.75C28.75 15.4251 28.4818 16.0725 28.0045 16.5499C27.5271 17.0273 26.8796 17.2955 26.2045 17.2955H26.09C25.6805 17.2971 25.2803 17.4184 24.9389 17.6446C24.5974 17.8707 24.3295 18.1917 24.1682 18.5682Z"
          stroke="var(--Purple, #FF8CFF)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

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
        opacity: 0.35,
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
          opacity: 0.35,
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
  const t = useT();
  const arabic = useArabicLayout();
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
    paddingLeft?: number;
    paddingRight?: number;
    height: number;
    justify?: "flex-start" | "center" | "flex-end";
    reverse?: boolean;
  }) {
    const tabs = opts.reverse ? [...TABS].reverse() : TABS;
    return (
      <div
        className="flex items-center"
        style={{
          height: opts.height,
          paddingLeft: opts.paddingLeft,
          paddingRight: opts.paddingRight,
          gap: opts.gap,
          justifyContent: opts.justify ?? "flex-start",
        }}
        role="tablist"
        aria-label="Profile sections"
      >
        {tabs.map((tab) => {
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
              {t(tab)}
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
        {renderTabs({
          fontSize: 20,
          gap: 61,
          paddingLeft: arabic ? undefined : 30,
          height: 56,
          justify: arabic ? "center" : "flex-start",
          reverse: arabic,
        })}
        <MobileRule />
      </div>

      <div className="mt-[23px] hidden min-[744px]:block lg:hidden">
        <FullBleedRule />
        <div className="relative" style={{ height: 56 }}>
          {renderTabs({
            fontSize: 24,
            gap: 61,
            paddingLeft: arabic ? undefined : 61,
            paddingRight: arabic ? 61 : undefined,
            height: 56,
            justify: arabic ? "flex-end" : "flex-start",
            reverse: arabic,
          })}
          <AccountSettingsIconButton side={arabic ? "left" : "right"} />
        </div>
        <FullBleedRule />
      </div>

      <div className="hidden lg:block">
        <FullBleedRule className="mt-[59px]" />
        <div className="relative" style={{ height: 65 }}>
          {renderTabs({ fontSize: 24, gap: 50, paddingLeft: 120, height: 65 })}
          <AccountSettingsLink />
        </div>
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
