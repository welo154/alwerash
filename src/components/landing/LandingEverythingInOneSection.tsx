"use client";

import type { ComponentType, CSSProperties } from "react";
import { useT } from "@/components/i18n/Tr";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

type GlyphProps = { className?: string };

function FeatureGlyphCountless({ className }: GlyphProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 39" fill="none" className={className} aria-hidden>
      <path
        d="M21.5 9.5C21.5 7.37827 20.6571 5.34344 19.1569 3.84315C17.6566 2.34285 15.6217 1.5 13.5 1.5H1.5V31.5H15.5C17.0913 31.5 18.6174 32.1321 19.7426 33.2574C20.8679 34.3826 21.5 35.9087 21.5 37.5M21.5 9.5V37.5M21.5 9.5C21.5 7.37827 22.3429 5.34344 23.8431 3.84315C25.3434 2.34285 27.3783 1.5 29.5 1.5H41.5V31.5H27.5C25.9087 31.5 24.3826 32.1321 23.2574 33.2574C22.1321 34.3826 21.5 35.9087 21.5 37.5"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureGlyphOnDemand({ className }: GlyphProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 39" fill="none" className={className} aria-hidden>
      <path
        d="M13.5 37.5H29.5M21.5 29.5V37.5M5.5 1.5H37.5C39.7091 1.5 41.5 3.29086 41.5 5.5V25.5C41.5 27.7091 39.7091 29.5 37.5 29.5H5.5C3.29086 29.5 1.5 27.7091 1.5 25.5V5.5C1.5 3.29086 3.29086 1.5 5.5 1.5Z"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureGlyphExperts({ className }: GlyphProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 47" fill="none" className={className} aria-hidden>
      <path
        d="M7.92 27.28L5.5 45.5L15.5 39.5L25.5 45.5L23.08 27.26M29.5 15.5C29.5 23.232 23.232 29.5 15.5 29.5C7.76801 29.5 1.5 23.232 1.5 15.5C1.5 7.76801 7.76801 1.5 15.5 1.5C23.232 1.5 29.5 7.76801 29.5 15.5Z"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureGlyphPaths({ className }: GlyphProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 43" fill="none" className={className} aria-hidden>
      <circle cx="10.5" cy="32.5" r="6" stroke="currentColor" strokeWidth={3} />
      <circle cx="32.5" cy="10.5" r="6" stroke="currentColor" strokeWidth={3} />
      <path
        d="M16.5 32.5H22C27.5 32.5 27.5 21.5 22 21.5H16C10.5 21.5 10.5 16.5 16 16.5H26.5"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureGlyphOneOnOne({ className }: GlyphProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47 39" fill="none" className={className} aria-hidden>
      <path
        d="M33.5 37.5V33.5C33.5 31.3783 32.6571 29.3434 31.1569 27.8431C29.6566 26.3429 27.6217 25.5 25.5 25.5H9.5C7.37827 25.5 5.34344 26.3429 3.84315 27.8431C2.34285 29.3434 1.5 31.3783 1.5 33.5V37.5M45.5 37.5V33.5C45.4987 31.7275 44.9087 30.0055 43.8227 28.6046C42.7368 27.2037 41.2163 26.2031 39.5 25.76M31.5 1.76C33.2208 2.2006 34.7461 3.2014 35.8353 4.60462C36.9245 6.00784 37.5157 7.73366 37.5157 9.51C37.5157 11.2863 36.9245 13.0122 35.8353 14.4154C34.7461 15.8186 33.2208 16.8194 31.5 17.26M25.5 9.5C25.5 13.9183 21.9183 17.5 17.5 17.5C13.0817 17.5 9.5 13.9183 9.5 9.5C9.5 5.08172 13.0817 1.5 17.5 1.5C21.9183 1.5 25.5 5.08172 25.5 9.5Z"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Light grey placeholders — left insets from design; vertical gap 68px between each pair. */
function DecoBox({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      className={`h-[134px] w-[134px] shrink-0 rounded-[50px] border border-black bg-[#E9E9E9] ${className ?? ""}`.trim()}
    />
  );
}

type FeatureRow = {
  title: string;
  body: string;
  Icon: ComponentType<GlyphProps>;
  comingSoon?: boolean;
};

function ComingSoonStamp() {
  const t = useT();
  const label = t("Coming soon");
  const lines = label.split(/\s+/).filter(Boolean);

  return (
    <span
      className="relative inline-flex h-[48px] w-[48px] shrink-0 -rotate-[14deg] items-center justify-center rounded-full border-2 border-[#FF8CFF] text-[#FF8CFF] min-[744px]:h-[68px] min-[744px]:w-[68px]"
      style={{ fontFamily: pangeaFont }}
      aria-label={label}
    >
      <span
        className="pointer-events-none absolute inset-[3px] rounded-full border border-[#FF8CFF] min-[744px]:inset-[4px]"
        aria-hidden
      />
      <span
        className="flex max-w-[40px] flex-col items-center text-center text-[7px] font-semibold uppercase leading-[1.05] tracking-[0.04em] min-[744px]:max-w-[54px] min-[744px]:text-[10px]"
        aria-hidden
      >
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </span>
    </span>
  );
}

const FEATURES: FeatureRow[] = [
  {
    title: "VARIOUS CLASSES",
    body: "Distinct creative classes. Beginner to pro.",
    Icon: FeatureGlyphCountless,
  },
  {
    title: "ON-DEMAND VIEWING",
    body: "Watch at your pace in any place.",
    Icon: FeatureGlyphOnDemand,
  },
  {
    title: "TAUGHT BY EXPERTS",
    body: "Classes are led by industry icons and pros.",
    Icon: FeatureGlyphExperts,
  },
  {
    title: "LEARNING PATHS",
    body: "Curated, sequential classes to help you meet a goal.",
    Icon: FeatureGlyphPaths,
  },
  {
    title: "1-ON-1 SESSIONS",
    body: "Book time for personalized feedback with a teacher.",
    Icon: FeatureGlyphOneOnOne,
    comingSoon: true,
  },
];

function FeatureCheckGlyph({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <circle cx="20" cy="20" r="19" stroke="#FF8CFF" strokeWidth={2} />
      <path
        d="M30 14L15.5625 28L9 21.6364"
        stroke="#FF8CFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureCheck({ size = 40 }: { size?: number }) {
  return <FeatureCheckGlyph className="shrink-0" style={{ width: size, height: size }} />;
}

const mobileFeatureTitleStyle = {
  color: "#000",
  fontFamily: pangeaFont,
  fontSize: "20px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "127%",
} as const;

const mobileFeatureBodyStyle = {
  color: "#000",
  fontFamily: pangeaFont,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "127%",
} as const;

const courseFeatureTitleStyle = {
  color: "#000",
  fontFamily: pangeaFont,
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "127%",
} as const;

const courseFeatureBodyStyle = {
  color: "#000",
  fontFamily: pangeaFont,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "127%",
} as const;

export function LandingEverythingInOneSection({
  showDecoBoxes = true,
  variant = "desktop",
  className,
  hideChecks = false,
  mobileHeading,
  mobileRowLayout = "home",
}: {
  showDecoBoxes?: boolean;
  variant?: "desktop" | "mobile";
  className?: string;
  hideChecks?: boolean;
  mobileHeading?: string;
  /** Course page uses its own row metrics; home keeps the original mobile sizes. */
  mobileRowLayout?: "home" | "course";
} = {}) {
  if (variant === "mobile") {
    const isCourseRows = mobileRowLayout === "course";
    return (
      <section
        className={`w-full ${
          isCourseRows
            ? "pl-[30px] pr-4 min-[744px]:max-lg:pl-[61px]"
            : "pl-[30px] pr-4 min-[744px]:pl-[63px] min-[744px]:pr-[61px]"
        } ${className ?? ""}`}
        aria-labelledby="everything-in-one-place-heading-mobile"
      >
        {mobileHeading ? (
          <h2
            id="everything-in-one-place-heading-mobile"
            className={`m-0 text-[16px] ${
              isCourseRows ? "min-[744px]:max-lg:mt-[49px] min-[744px]:max-lg:text-[18px]" : ""
            }`}
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              opacity: 0.6,
            }}
          >
            {mobileHeading}
          </h2>
        ) : (
        <h2
          id="everything-in-one-place-heading-mobile"
          className="m-0 w-[269px] text-left text-black min-[744px]:hidden"
          style={{ fontFamily: pangeaFont }}
        >
          <span
            className="text-[36px] font-bold italic leading-[120%] text-black min-[744px]:text-[40px]"
            style={{ fontFamily: pangeaFont }}
          >
            EVERYTHING
          </span>
          <span
            className="text-[36px] font-normal not-italic leading-[120%] text-black min-[744px]:text-[40px]"
            style={{ fontFamily: pangeaFont }}
          >
            {" "}
            IN ONE PLACE
          </span>
        </h2>
        )}

        <ul
          className={`flex list-none flex-col p-0 ${
            isCourseRows
              ? "mt-[25px] mb-[50px] gap-[25px] min-[744px]:max-lg:mt-[53px] min-[744px]:max-lg:mb-0 min-[744px]:max-lg:gap-[45px]"
              : "mt-[37px] mb-0 gap-[35px] min-[744px]:mt-[51px] min-[744px]:gap-[45px]"
          }`}
        >
          {FEATURES.map(({ title, body, Icon, comingSoon }) => (
            <li key={title} className={`flex items-center ${isCourseRows ? "min-[744px]:max-lg:items-start" : ""}`}>
              <span className="flex shrink-0 items-center justify-center text-[#1E1E1E] min-[744px]:text-[var(--sds-color-icon-default-default,#1E1E1E)]">
                <Icon
                  className={`shrink-0 ${
                    isCourseRows
                      ? "h-[21px] w-[22px] min-[744px]:max-lg:h-[31px] min-[744px]:max-lg:w-[34px]"
                      : "h-[24px] w-[26px] min-[744px]:h-[31px] min-[744px]:w-[34px]"
                  }`}
                />
              </span>
              <div
                className={
                  isCourseRows
                    ? "ml-[14px] min-w-0 min-[744px]:max-lg:ml-[27px]"
                    : "ml-[21px] w-[221px] shrink-0 min-[744px]:ml-[27px] min-[744px]:w-[480px]"
                }
              >
                <h3
                  className={isCourseRows ? "m-0 w-fit text-[16px] min-[744px]:max-lg:text-[20px]" : "m-0 w-fit"}
                  style={isCourseRows ? courseFeatureTitleStyle : mobileFeatureTitleStyle}
                >
                  {title}
                </h3>
                <p
                  className={
                    isCourseRows
                      ? "m-0 text-[14px] min-[744px]:max-lg:text-[20px]"
                      : "m-0 mt-2 text-[14px] min-[744px]:mt-0 min-[744px]:text-[20px]"
                  }
                  style={isCourseRows ? courseFeatureBodyStyle : mobileFeatureBodyStyle}
                >
                  {body}
                </p>
              </div>
              {hideChecks && !comingSoon ? null : (
              <span className="ml-[33px] shrink-0 min-[744px]:ml-auto">
                {comingSoon ? (
                  <ComingSoonStamp />
                ) : (
                  <FeatureCheckGlyph className="h-[33.171px] w-[33.171px] min-[744px]:h-[44.893px] min-[744px]:w-[44.893px]" />
                )}
              </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      className={`w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 ${className ?? "mt-[125px]"}`}
      data-gsap-reveal
      aria-labelledby="everything-in-one-place-heading"
    >
      <div className="mx-auto flex max-w-[1600px] items-start justify-center gap-6 lg:gap-10 xl:justify-between">
        {showDecoBoxes ? (
          <div className="mt-[29px] hidden w-[312px] shrink-0 flex-col xl:flex">
            <DecoBox className="ml-[178px]" />
            <DecoBox className="ml-[101px] mt-[68px]" />
            <DecoBox className="ml-[59px] mt-[68px]" />
          </div>
        ) : null}

        <div className="min-w-0 w-full max-w-[640px] flex-1 xl:max-w-none xl:px-4">
          <h2
            id="everything-in-one-place-heading"
            className="mb-[64px] text-center text-[48px] leading-[120%] text-black"
            style={{ fontFamily: pangeaFont }}
          >
            <span className="font-bold italic">EVERYTHING</span>
            <span className="font-normal not-italic"> IN ONE PLACE</span>
          </h2>

          <ul className="mb-[35px] flex list-none flex-col gap-[35px] p-0">
            {FEATURES.map(({ title, body, Icon, comingSoon }) => (
              <li key={title} className="flex items-start">
                <span className="mt-1 mr-4 flex shrink-0 items-center justify-center text-[#1E1E1E] sm:mr-6">
                  <Icon className="h-[36px] w-[44px] shrink-0" />
                </span>
                <div
                  className="mr-[115px] w-[480px] max-w-full shrink-0"
                  style={{ fontFamily: pangeaFont }}
                >
                  <h3 className="m-0 w-fit text-[24px] font-semibold not-italic leading-[127%] text-black">
                    {title}
                  </h3>
                  <p className="mt-2 text-[24px] font-normal not-italic leading-[127%] text-black">
                    {body}
                  </p>
                </div>
                <span className="-translate-x-[40px] shrink-0">
                  {comingSoon ? <ComingSoonStamp /> : <FeatureCheck />}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {showDecoBoxes ? (
          <div className="mt-[29px] hidden w-[312px] shrink-0 flex-col items-end xl:flex">
            <DecoBox className="mr-[178px]" />
            <DecoBox className="mr-[101px] mt-[68px]" />
            <DecoBox className="mr-[59px] mt-[68px]" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
