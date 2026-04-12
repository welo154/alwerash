"use client";

import { LandingMentorCard } from "./LandingMentorCard";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const MENTORS = [
  {
    variant: "popular" as const,
    name: "AHMAD KHALED HUSSEIN",
    profession: "Illustrator",
  },
  {
    variant: "watched" as const,
    name: "EHAB MOHAMED IBRAHIM",
    profession: "Graphic Designer",
  },
  {
    variant: "popular" as const,
    name: "MOHAMED SHERIF RAMZY",
    profession: "Illustrator",
  },
  {
    variant: "popular" as const,
    name: "SHERIF ZAKI ABDELHAMID",
    profession: "Animator",
  },
  {
    variant: "watched" as const,
    name: "KARIM HASSAN MAHMOUD",
    profession: "Motion Designer",
  },
  {
    variant: "popular" as const,
    name: "OMAR YASSER SALEH",
    profession: "UI Designer",
  },
] as const;

/**
 * “THE CURRENT MOSTS” strip — below Everything-in-one-place.
 * md+: 120px from viewport left to content, 112px right inset; 166px top padding.
 * Mentor grid: 112px below header; 77px / 76px horizontal insets from page (md+).
 */
export function LandingCurrentMostsSection() {
  return (
    <section
      className="mb-[90px] w-full overflow-x-hidden px-4 pt-[166px] sm:px-6 md:px-0 md:pl-[120px] md:pr-[112px]"
      data-gsap-reveal
      aria-labelledby="landing-current-mosts-heading"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <h2
            id="landing-current-mosts-heading"
            className="text-[48px] uppercase leading-[120%] text-black"
            style={{ fontFamily: pangeaFont }}
          >
            <span className="font-normal not-italic">THE CURRENT </span>
            <span className="font-bold italic">MOSTS</span>
          </h2>
          <p
            className="shrink-0 self-end text-left lg:ml-auto"
            style={{
              fontFamily: pangeaFont,
              color: "#000",
              fontSize: "22px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "127%",
              width: "361px",
              maxWidth: "100%",
              height: "60px",
            }}
          >
            Explore our most popular and most watched mentors and instructors.
          </p>
        </div>
      </div>

      <div className="relative left-1/2 mt-[112px] w-screen max-w-[100vw] -translate-x-1/2 px-4 sm:px-6 md:px-0">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 justify-items-center gap-x-8 gap-y-10 md:grid-cols-2 md:pl-[77px] md:pr-[76px] lg:grid-cols-3">
          {MENTORS.map((m) => (
            <LandingMentorCard
              key={m.name}
              variant={m.variant}
              name={m.name}
              profession={m.profession}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
