"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LandingSocialSignInRow } from "./LandingSocialSignInRow";
import { pangeaFontFamily, pangeaVar } from "@/lib/fonts/pangea";

export type HeroTrack = { id: string; title: string; slug: string };

const GUEST_SHELL_GREEN = "#8AF396";
const LOGO_W = 220;
const pangeaFont = pangeaFontFamily;

/** Exact Subtract path from Figma 710:1466 — viewBox 1301×762. */
const HERO_SHELL_PATH =
  "M1246 0C1276.38 1.22409e-05 1301 24.6243 1301 55V707C1301 737.376 1276.38 762 1246 762H55C24.6244 762 0 737.376 0 707V132.636C0 105.022 22.3858 82.6357 50 82.6357H176.023C200.324 82.6357 220.023 62.9363 220.023 38.6357C220.023 17.2978 237.321 0 258.659 0H1246Z";

const ALL_COURSES = [
  "Illustration courses",
  "Craft courses",
  "Marketing & Business courses",
  "Photography & Video courses",
  "Design courses",
  "3D & Animation courses",
  "Architecture & Spaces courses",
  "Writing courses",
  "Fashion courses",
  "Web & App Design courses",
  "Calligraphy & Typography courses",
  "Music & Audio courses",
  "Culinary courses",
  "Artificial Intelligence courses",
  "Wellness courses",
  "How to become courses",
];

const SOFTWARE_COURSES = [
  "Illustration courses",
  "Craft courses",
  "Marketing & Business courses",
  "Photography & Video courses",
  "Design courses",
];

const HERO_SHELL = { width: 1301, height: 762 } as const;

/** Rest mosaic: TL 282×357, TR 197×272, BL 282×224, BR 197×308; gaps 18×16. */
const HERO_MOSAIC_FRAME = { width: 497, height: 597 } as const;
const mosaicAnim = (name: string) => `${name} 8000ms linear infinite`;

export function HeroSection({ tracks: _tracks }: { tracks: HeroTrack[] }) {

  return (
    <section className={`${pangeaVar.className} bg-white px-4 pb-0 pt-[32px] sm:px-6 lg:px-8`}>
      {/* Guest shell — page top padding 32px; header row 28px below green top */}
      <div
        className="relative mx-auto flex max-w-full flex-col overflow-visible"
        style={{ width: HERO_SHELL.width, height: HERO_SHELL.height }}
      >
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          viewBox="0 0 1301 762"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d={HERO_SHELL_PATH} fill={GUEST_SHELL_GREEN} />
        </svg>

        <Link
          href="/"
          className="absolute left-0 top-[-8px] z-40 block"
          style={{ width: LOGO_W }}
        >
          <Image
            src="/brand/alwerash-logo-hero.png"
            alt="Alwerash"
            width={LOGO_W}
            height={LOGO_W}
            className="block h-auto w-[220px] max-w-none"
            unoptimized
          />
        </Link>

        <div className="relative z-30 h-full overflow-hidden">
          <div className="relative z-[3000] flex items-stretch">
            <div className="relative z-30 flex flex-1 items-center justify-end pb-5 pl-0 pr-8 pt-[28px]">
              <nav
                className="hidden items-center gap-[30px] text-[18px] font-normal text-black md:flex"
                style={{ fontFamily: pangeaFont }}
              >
                <div className="group relative">
                  <Link
                    href="/course"
                    className="inline-flex items-center gap-0 text-[18px] font-normal leading-[33px] text-black transition-opacity hover:opacity-75"
                  >
                    Courses
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4 transition-transform duration-150 group-hover:rotate-180"
                      aria-hidden
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  <div
                    className="absolute top-full left-0 z-2000 h-3 w-[min(100%,220px)] max-w-full"
                    aria-hidden
                  />

                  <div className="absolute top-full left-0 z-2000 mt-1 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
                    <div
                      className="w-[582px] rounded-[50px] border border-black bg-white px-[35px] py-[28px] shadow-[4px_4px_10px_0_rgba(0,0,0,0.25)]"
                      style={{ fontFamily: pangeaFont }}
                    >
                      <div className="grid grid-cols-2 gap-10 text-black">
                        <div>
                          <h3 className="mb-0 inline-flex items-center text-[18px] font-bold uppercase leading-[33px] text-black">
                            ALL COURSES <span aria-hidden>↗</span>
                          </h3>
                          <ul className="space-y-0 text-[18px] font-normal text-black">
                            {ALL_COURSES.map((item) => (
                              <li key={item} className="flex h-[33px] items-center leading-[33px] whitespace-nowrap">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="mb-0 inline-flex items-center text-[18px] font-bold uppercase leading-[33px] text-black">
                            SOFTWARE <span aria-hidden>↗</span>
                          </h3>
                          <ul className="space-y-0 text-[18px] font-normal text-black">
                            {SOFTWARE_COURSES.map((item) => (
                              <li key={item} className="flex h-[33px] items-center leading-[33px] whitespace-nowrap">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/library" className="transition-opacity hover:opacity-75">Library</Link>
                <Link href="/events" className="transition-opacity hover:opacity-75">Events</Link>
              </nav>

              <div className="ml-[30px] flex flex-wrap items-center">
                <div className="flex items-center gap-[15px]">
                  <div className="flex h-10 w-[350px] items-center rounded-[8px] border border-black bg-white px-3">
                    <input
                      type="text"
                      placeholder="Search for courses"
                      className="w-full bg-transparent text-[18px] text-[#73726C] placeholder:text-[#73726C] focus:outline-none"
                      style={{ fontFamily: pangeaFont }}
                      suppressHydrationWarning
                    />
                  </div>

                  <button
                    type="button"
                    aria-label="Search"
                    className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-black text-black"
                    suppressHydrationWarning
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="ml-[75px] flex items-center gap-[15px]">
                  <Link
                    href="/login"
                    className="inline-flex h-[36px] w-[81px] items-center justify-center whitespace-nowrap rounded-md border border-black bg-white px-4 text-center text-[18px] font-bold leading-none tracking-[0] text-[#141413]"
                    style={{ fontFamily: pangeaFont }}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex h-[36px] w-[85px] items-center justify-center whitespace-nowrap rounded-md border border-black bg-[#EA83F0] px-4 text-center text-[18px] font-bold leading-none tracking-[0] text-[#141413]"
                    style={{ fontFamily: pangeaFont }}
                  >
                    Sign up
                  </Link>
                  <div
                    className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-black text-[20px] font-normal leading-[100%] tracking-[0] text-black"
                    style={{ fontFamily: "Inter, var(--font-dm-sans), sans-serif" }}
                    aria-hidden
                  >
                    ع
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="z-20"
            style={{
              position: "absolute",
              top: 151, // header (28+40+20) + 63px gap below header
              left: 50,
              width: 612,
              maxWidth: "calc(100% - 50px)",
            }}
          >
            <h1
              className="m-0 max-w-full uppercase tracking-[0] text-black"
              style={{
                width: 610,
                color: "#000",
                fontFamily: pangeaFont,
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
              }}
            >
              Discover your next{" "}
              <em
                style={{
                  color: "#000",
                  fontFamily: pangeaFont,
                  fontSize: "48px",
                  fontStyle: "italic",
                  fontWeight: 700,
                  lineHeight: "120%",
                }}
              >
                creative
              </em>{" "}
              obsession.
              <br />
              From beginner to pro at your own time.
            </h1>
            <p
              className="mt-[25px] max-w-full tracking-[0] text-black"
              style={{
                width: 612,
                color: "#000",
                fontFamily: pangeaFont,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "127%",
              }}
            >
              Explore thousands of online classes in design, typography, illustration,
              photography, and more. Taught by industry professionals.
            </p>
            <Link
              href="/register"
              className="mt-[30px] inline-flex h-[91px] w-[300px] items-center justify-center rounded-md border border-black bg-white px-4 text-center text-[36px] font-normal leading-[100%] tracking-[0] text-[#141413]"
              style={{ fontFamily: pangeaFont }}
            >
              GET STARTED
            </Link>
            <p
              className="mt-6 w-[300px] text-center text-[24px] font-normal leading-[120%] tracking-[0] text-black"
              style={{ fontFamily: pangeaFont }}
            >
              Or continue with
            </p>
            <div className="mt-[24px] w-[300px]">
              <LandingSocialSignInRow variant="hero" />
            </div>
          </div>

          <div
            className="z-20"
            style={{
              position: "absolute",
              right: 39,
              bottom: 31,
            }}
          >
            <div
              className="relative"
              style={{
                width: HERO_MOSAIC_FRAME.width,
                height: HERO_MOSAIC_FRAME.height,
                animation: "alwerash-hero-grid-float 5000ms ease-in-out infinite",
              }}
            >
              <div
                className="absolute rounded-[50px] border border-black bg-white"
                style={{ animation: mosaicAnim("alwerash-hero-mosaic-tl") }}
              />
              <div
                className="absolute rounded-[50px] border border-black bg-white"
                style={{ animation: mosaicAnim("alwerash-hero-mosaic-tr") }}
              />
              <div
                className="absolute rounded-[50px] border border-black bg-white"
                style={{ animation: mosaicAnim("alwerash-hero-mosaic-br") }}
              />
              <div
                className="absolute rounded-[50px] border border-black bg-white"
                style={{ animation: mosaicAnim("alwerash-hero-mosaic-bl") }}
              />
            </div>
          </div>
        </div>

      </div>{/* end green container */}
    </section>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M5 12h12" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}











