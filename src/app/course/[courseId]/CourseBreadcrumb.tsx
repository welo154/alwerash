"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { LocalizedText } from "@/components/i18n/LocalizedText";
import { useArabicLayout } from "@/components/providers/LocaleProvider";

type CourseBreadcrumbProps = {
  courseTitle: string;
  courseTitleAr?: string | null;
  fontFamily: string;
};

function BreadcrumbChevron({ pointLeft }: { pointLeft: boolean }) {
  const flip = pointLeft ? "scaleX(-1)" : undefined;
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="5"
        height="10"
        viewBox="0 0 5 10"
        fill="none"
        className="h-[10px] w-[5px] shrink-0 min-[744px]:hidden"
        style={{ transform: flip }}
        aria-hidden
      >
        <path
          opacity="0.6"
          d="M0.5 9.5L4.5 5L0.5 0.5"
          stroke="var(--Black, #000)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="15"
        viewBox="0 0 8 15"
        fill="none"
        className="hidden h-[15px] w-[8px] shrink-0 min-[744px]:block"
        style={{ opacity: 0.6, transform: flip }}
        aria-hidden
      >
        <path
          d="M0.75 13.75L6.75 7.25L0.749999 0.75"
          stroke="var(--Black, #000)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}

/** Pull the rule out to the visible page edges, inside the layout viewport. */
function useFullPageWidthRule() {
  const ref = useRef<HTMLHRElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const width = document.documentElement.clientWidth;
      el.style.marginLeft = "0px";
      el.style.width = `${width}px`;
      const left = el.getBoundingClientRect().left;
      el.style.marginLeft = `${-left}px`;
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return ref;
}

export function CourseBreadcrumb({ courseTitle, courseTitleAr, fontFamily }: CourseBreadcrumbProps) {
  const arabic = useArabicLayout();
  const ruleRef = useFullPageWidthRule();
  const textStyle = {
    color: "var(--Black, #000)",
    fontFamily,
    fontStyle: "normal" as const,
    fontWeight: 400,
    fontVariationSettings: '"wght" 400',
    lineHeight: "normal",
    opacity: 0.6,
    textAlign: arabic ? ("right" as const) : undefined,
  };

  return (
    <>
      <div
        className={`mx-auto w-full max-[743px]:max-w-[393px] min-[744px]:max-lg:max-w-[744px] min-[744px]:max-lg:pt-[100px] min-[744px]:max-lg:-mt-[75.6px] ${
          arabic
            ? "max-[743px]:pr-[30px] min-[744px]:max-lg:pr-[34px]"
            : "max-[743px]:pl-[30px] min-[744px]:max-lg:pl-[34px]"
        }`}
      >
        <nav
          aria-label="Breadcrumb"
          dir={arabic ? "rtl" : "ltr"}
          className="flex w-full items-center gap-[18px] min-[744px]:gap-[15px]"
        >
          <Link
            href="/course"
            className="text-[14px] leading-normal hover:opacity-80 min-[744px]:text-[18px]"
            style={textStyle}
          >
            {arabic ? "الدورات" : "Courses"}
          </Link>
          <BreadcrumbChevron pointLeft={arabic} />
          <Link
            href="/course"
            className="text-[14px] leading-normal hover:opacity-80 min-[744px]:text-[18px]"
            style={textStyle}
          >
            {arabic ? "الفصول" : "Classes"}
          </Link>
          <BreadcrumbChevron pointLeft={arabic} />
          <span className="text-[14px] leading-normal min-[744px]:text-[18px]" style={textStyle}>
            <LocalizedText en={courseTitle} ar={courseTitleAr} />
          </span>
        </nav>
      </div>

      <hr
        ref={ruleRef}
        className="mt-[7px] block h-0 border-0 border-t border-black bg-black opacity-30 min-[744px]:mt-[13px] min-[744px]:opacity-60"
      />
    </>
  );
}
