"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

export type HeroTrack = { id: string; title: string; slug: string };

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const LOGO_W = 325;   // width of the white logo column
const LOGO_H = 116;   // height of the logo image
const R = 50;         // shared border-radius

export function HeroSection({ tracks: _tracks }: { tracks: HeroTrack[] }) {
  const { data: session, status } = useSession();

  // Signed-in users on home use LoggedInAppHeader only — hide marketing hero (nav + intro).
  if (status === "authenticated" && session?.user) {
    return null;
  }

  return (
    <section className="bg-white px-4 pt-[35px] pb-8 sm:px-6 lg:px-8">
      {/* ── Single green background block, constrained to page width ── */}
      <div className="relative mx-auto max-w-[1600px] rounded-[50px] bg-[#89F496] flex flex-col">

        {/* White box 1 — half logo width, double height */}
        <div
          className="absolute top-0 left-0 z-10 bg-white"
          style={{ width: LOGO_W / 2, height: LOGO_H * 2 }}
        />

        {/* White box 2 — double width, 33px height */}
        <div
          className="absolute top-0 left-0 z-10 bg-white"
          style={{ width: LOGO_W * 2, height: 45 }}
        />

        {/* ── ROW: Logo (white) + Navbar ── */}
        <div className="flex items-stretch">

          {/* 1. Logo — white tile; PNG is black wordmark on white (committed asset) */}
          <div
            className="relative z-20 flex shrink-0 items-center justify-center bg-white overflow-hidden"
            style={{ width: LOGO_W, borderBottomRightRadius: R }}
          >
            <Link href="/" className="block">
              <Image
                src="/brand/alwerash-logo.png"
                alt="Alwerash"
                width={325}
                height={116}
                className="h-[116px] w-[325px] object-contain"
                unoptimized
              />
            </Link>
          </div>

          {/* 2. Navbar — transparent (inherits green), rounded */}
          <div
            className="relative z-30 flex flex-1 items-center rounded-[50px] bg-[#89F496] px-8 py-5"
          >
            <nav
              className="mr-auto hidden items-center gap-[30px] text-[18px] font-normal text-[#141413] md:flex"
              style={{ fontFamily: pangeaFont }}
            >
              <Link href="/learn" className="transition-opacity hover:opacity-75">Courses</Link>
              <Link href="/tracks" className="transition-opacity hover:opacity-75">Library</Link>
              <Link href="/tracks" className="transition-opacity hover:opacity-75">Events</Link>
            </nav>

            <div className="flex flex-wrap items-center gap-[15px]">
              {/* Search bar */}
              <div className="flex h-10 w-[350px] items-center rounded-[8px] border border-black/30 bg-white px-3">
                <input
                  type="text"
                  placeholder="Search for courses"
                  className="w-full bg-transparent text-[18px] text-[#73726C] placeholder:text-[#73726C] focus:outline-none"
                  style={{ fontFamily: pangeaFont }}
                />
              </div>

              {/* Arrow button */}
              <button
                type="button"
                aria-label="Search"
                className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-black text-black"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>

              {/* Spacer between search and auth buttons */}
              <div className="w-[100px]" />

              {/* Auth buttons */}
              {!session ? (
                <>
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
                </>
              ) : (
                <Link
                  href="/learn"
                  className="inline-flex h-[36px] items-center justify-center whitespace-nowrap rounded-md border border-black bg-white px-4 text-center text-[18px] font-bold leading-none tracking-[0] text-[#141413]"
                  style={{ fontFamily: pangeaFont }}
                >
                  My courses
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. Content section — rounded, full width inside green container ── */}
        <div className="relative z-30 min-h-[841px] rounded-[50px] bg-[#89F496] pl-[78px] pr-[58px] pb-[106px] pt-12">
          <div className="grid grid-cols-1 gap-[58px] lg:grid-cols-12">
            {/* Left: headline + body + CTA */}
            <div className="lg:col-span-6">
              <h1
                className="mt-[120px] w-[612px] text-[48px] font-normal uppercase leading-[120%] tracking-[0] text-black"
                style={{ fontFamily: pangeaFont }}
              >
                Discover your next{" "}
                <em className="text-[48px] font-bold italic leading-[120%] tracking-[0] text-black" style={{ fontFamily: pangeaFont }}>
                  creative
                </em>{" "}
                obsession.
                <br />
                From beginner to pro at your own time.
              </h1>
              <p
                className="mt-[30px] w-full text-[24px] font-normal leading-[127%] tracking-[0] text-black"
                style={{ fontFamily: pangeaFont }}
              >
                Explore thousands of online classes in design, typography,
                illustration, photography, and more. Taught by industry
                professionals.
              </p>
              <Link
                href="/register"
                className="mt-[30px] inline-flex h-[91px] w-[300px] items-center justify-center rounded-md border border-black bg-white px-4 text-center text-[36px] font-normal leading-[100%] tracking-[0] text-[#141413]"
                style={{ fontFamily: pangeaFont }}
              >
                Get Started
              </Link>
              <p className="mt-6 w-[300px] text-center text-[24px] font-normal leading-[120%] tracking-[0] text-black" style={{ fontFamily: pangeaFont }}>
                Or continue with
              </p>
              <div className="mt-[24px] flex w-[300px] items-center justify-center gap-[13px]">
                <Image src="/social/google.png" alt="Google" width={46} height={46} className="h-[46px] w-[46px]" unoptimized />
                <Image src="/social/apple.png" alt="Apple" width={46} height={46} className="h-[46px] w-[46px]" unoptimized />
                <Image src="/social/facebook.png" alt="Facebook" width={46} height={46} className="h-[46px] w-[46px]" unoptimized />
                <Image src="/social/email.png" alt="Email" width={46} height={46} className="h-[46px] w-[46px]" unoptimized />
              </div>
            </div>

            {/* Right: white box layout (exact figma dimensions) */}
            <div className="lg:col-span-6">
              <div className="flex gap-[20px]">
                <div className="flex w-[314px] flex-col gap-[20px]">
                  <div className="h-[423px] w-[314px] rounded-[50px] border border-black bg-white" />
                  <div className="h-[266px] w-[314px] rounded-[50px] border border-black bg-white" />
                </div>
                <div className="flex w-[220px] flex-col gap-[20px]">
                  <div className="h-[323px] w-[220px] rounded-[50px] border border-black bg-white" />
                  <div className="h-[366px] w-[220px] rounded-[50px] border border-black bg-white" />
                </div>
              </div>
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

