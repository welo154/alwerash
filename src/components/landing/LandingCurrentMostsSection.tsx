"use client";

import type { LandingMostsMentorCardDto } from "@/server/content/public.service";
import { LandingMentorCard } from "./LandingMentorCard";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

/**
 * “THE CURRENT MOSTS” strip — below Everything-in-one-place.
 * md+: 120px from viewport left to content, 112px right inset; 166px top padding.
 * Mentor grid: 112px below header; 77px / 76px horizontal insets from page (md+).
 * Cards are filled from admin Mentors (`publicListLandingMostsMentors`), text-only.
 */
export function LandingCurrentMostsSection({ mentors }: { mentors: LandingMostsMentorCardDto[] }) {
  return (
    <section
      className="relative left-1/2 mb-[90px] w-screen max-w-[100vw] -translate-x-1/2 overflow-x-hidden pl-[85px] pr-[64px] pt-[97px]"
      data-gsap-reveal
      aria-labelledby="landing-current-mosts-heading"
    >
      <div className="flex flex-col gap-6">
        <h2
          id="landing-current-mosts-heading"
          className="m-0 text-[48px] uppercase leading-[120%] text-black"
          style={{ fontFamily: pangeaFont }}
        >
          <span className="font-normal not-italic">THE CURRENT </span>
          <span className="font-bold italic">MOSTS</span>
        </h2>
      </div>

      <div className="relative left-1/2 mt-[82px] w-screen max-w-[100vw] -translate-x-1/2 px-4 sm:px-6 md:px-0">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 justify-center gap-x-[30px] gap-y-[50px] md:grid-cols-[repeat(2,409px)] md:pl-[77px] md:pr-[76px] lg:grid-cols-[repeat(3,409px)]">
          {mentors.map((m) => (
            <LandingMentorCard
              key={m.id}
              variant={m.variant}
              name={m.name}
              profession={m.profession}
              href={`/mentors/${m.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
