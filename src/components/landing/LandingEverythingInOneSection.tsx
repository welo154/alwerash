"use client";

import type { ComponentType } from "react";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

type GlyphProps = { className?: string };

function FeatureGlyphCountless({ className }: GlyphProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 39" fill="none" className={className} aria-hidden>
      <path
        d="M21.5 9.5C21.5 7.37827 20.6571 5.34344 19.1569 3.84315C17.6566 2.34285 15.6217 1.5 13.5 1.5H1.5V31.5H15.5C17.0913 31.5 18.6174 32.1321 19.7426 33.2574C20.8679 34.3826 21.5 35.9087 21.5 37.5M21.5 9.5V37.5M21.5 9.5C21.5 7.37827 22.3429 5.34344 23.8431 3.84315C25.3434 2.34285 27.3783 1.5 29.5 1.5H41.5V31.5H27.5C25.9087 31.5 24.3826 32.1321 23.2574 33.2574C22.1321 34.3826 21.5 35.9087 21.5 37.5"
        stroke="#1E1E1E"
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
        stroke="#1E1E1E"
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
        stroke="#1E1E1E"
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
      <path
        d="M26.5 17.5C24.84 17.5 23.5 16.16 23.5 14.5V4.5C23.5 2.84 24.84 1.5 26.5 1.5C28.16 1.5 29.5 2.84 29.5 4.5V14.5C29.5 16.16 28.16 17.5 26.5 17.5Z"
        stroke="#1E1E1E"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38.5 17.5H35.5V14.5C35.5 12.84 36.84 11.5 38.5 11.5C40.16 11.5 41.5 12.84 41.5 14.5C41.5 16.16 40.16 17.5 38.5 17.5Z"
        stroke="#1E1E1E"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 25.5C18.16 25.5 19.5 26.84 19.5 28.5V38.5C19.5 40.16 18.16 41.5 16.5 41.5C14.84 41.5 13.5 40.16 13.5 38.5V28.5C13.5 26.84 14.84 25.5 16.5 25.5Z"
        stroke="#1E1E1E"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 25.5H7.5V28.5C7.5 30.16 6.16 31.5 4.5 31.5C2.84 31.5 1.5 30.16 1.5 28.5C1.5 26.84 2.84 25.5 4.5 25.5Z"
        stroke="#1E1E1E"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.5 26.5C25.5 24.84 26.84 23.5 28.5 23.5H38.5C40.16 23.5 41.5 24.84 41.5 26.5C41.5 28.16 40.16 29.5 38.5 29.5H28.5C26.84 29.5 25.5 28.16 25.5 26.5Z"
        stroke="#1E1E1E"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28.5 35.5H25.5V38.5C25.5 40.16 26.84 41.5 28.5 41.5C30.16 41.5 31.5 40.16 31.5 38.5C31.5 36.84 30.16 35.5 28.5 35.5Z"
        stroke="#1E1E1E"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 16.5C17.5 14.84 16.16 13.5 14.5 13.5H4.5C2.84 13.5 1.5 14.84 1.5 16.5C1.5 18.16 2.84 19.5 4.5 19.5H14.5C16.16 19.5 17.5 18.16 17.5 16.5Z"
        stroke="#1E1E1E"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 7.5H17.5V4.5C17.5 2.84 16.16 1.5 14.5 1.5C12.84 1.5 11.5 2.84 11.5 4.5C11.5 6.16 12.84 7.5 14.5 7.5Z"
        stroke="#1E1E1E"
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
        stroke="#1E1E1E"
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
};

const FEATURES: FeatureRow[] = [
  {
    title: "COUNTLESS CLASSES",
    body: "Thousands of creative classes. Beginner to pro.",
    Icon: FeatureGlyphCountless,
  },
  {
    title: "ON-DEMAND VIEWING",
    body: "Watch at your pace and even offline.",
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
  },
];

function FeatureCheckGlyph({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
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

function FeatureCheck() {
  return <FeatureCheckGlyph className="h-10 w-10 shrink-0" />;
}

export function LandingEverythingInOneSection() {
  return (
    <section
      className="mt-[125px] w-full overflow-x-hidden px-4 sm:px-6 lg:px-8"
      data-gsap-reveal
      aria-labelledby="everything-in-one-place-heading"
    >
      <div className="mx-auto flex max-w-[1600px] items-start justify-center gap-6 lg:gap-10 xl:justify-between">
        <div className="mt-[29px] hidden w-[312px] shrink-0 flex-col xl:flex">
          <DecoBox className="ml-[178px]" />
          <DecoBox className="ml-[101px] mt-[68px]" />
          <DecoBox className="ml-[59px] mt-[68px]" />
        </div>

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
            {FEATURES.map(({ title, body, Icon }) => (
              <li key={title} className="flex items-start">
                <span className="mt-1 mr-4 flex shrink-0 items-center justify-center sm:mr-6">
                  <Icon className="h-[36px] w-[44px] shrink-0" />
                </span>
                <div
                  className="mr-[115px] w-[480px] max-w-full shrink-0"
                  style={{ fontFamily: pangeaFont }}
                >
                  <h3 className="text-[24px] font-semibold not-italic leading-[127%] text-black">
                    {title}
                  </h3>
                  <p className="mt-2 text-[24px] font-normal not-italic leading-[127%] text-black">
                    {body}
                  </p>
                </div>
                <FeatureCheck />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-[29px] hidden w-[312px] shrink-0 flex-col items-end xl:flex">
          <DecoBox className="mr-[178px]" />
          <DecoBox className="mr-[101px] mt-[68px]" />
          <DecoBox className="mr-[59px] mt-[68px]" />
        </div>
      </div>
    </section>
  );
}
