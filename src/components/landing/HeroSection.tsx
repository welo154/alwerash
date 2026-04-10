"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export type HeroTrack = { id: string; title: string; slug: string };

const GUEST_SHELL_GREEN = "#8AF396";
const LOGO_W = 325;
const LOGO_H = 116;
const R = 50;
const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

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

export function HeroSection({ tracks: _tracks }: { tracks: HeroTrack[] }) {
  const { data: session, status } = useSession();

  // Signed-in users on home use LoggedInAppHeader only — hide marketing hero (nav + intro).
  if (status === "authenticated" && session?.user) {
    return null;
  }

  return (
    <section className="bg-white px-4 pt-[35px] pb-8 sm:px-6 lg:px-8">
      {/* ── Guest shell from Figma (node 17:1467) ── */}
      <div className="relative mx-auto max-w-[1600px] overflow-hidden flex flex-col">
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          viewBox="0 0 1360 959"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d="M1305 0C1335.38 0 1360 24.6243 1360 55V904C1360 934.376 1335.38 959 1305 959H55C24.6243 959 1.38534e-06 934.376 0 904V154C0 126.386 22.3858 104 50 104H186C210.301 104 230 84.3005 230 60V50C230 22.3858 252.386 0 280 0H1305Z"
            fill={GUEST_SHELL_GREEN}
          />
        </svg>

        <div className="relative z-30 min-h-[841px] overflow-hidden">
          <div className="relative z-[3000] flex items-stretch">
            <div
              className="relative z-10 top-[13px] left-4 flex shrink-0 overflow-hidden bg-transparent"
              style={{ width: LOGO_W, height: LOGO_H, borderBottomRightRadius: R }}
            >
              <Link href="/" className="block">
                <span className="block h-[62px] w-[220px] overflow-hidden">
                  <Image
                    src="/brand/alwerash-logo.png"
                    alt="Alwerash"
                    width={325}
                    height={116}
                    className="h-[88px] w-[250px] -translate-y-[9px] object-contain"
                    unoptimized
                  />
                </span>
              </Link>
            </div>

            <div className="relative z-30 flex flex-1 items-center rounded-[50px] bg-transparent px-8 py-5">
              <nav
                className="-ml-[20px] mr-auto hidden items-center gap-[30px] text-[18px] font-normal text-black md:flex"
                style={{ fontFamily: pangeaFont }}
              >
                <div className="group relative">
                  <Link
                    href="/learn"
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

                  <div className="absolute top-full left-0 z-2000 mt-1 opacity-0 transition-opacity delay-500 duration-1000 ease-out pointer-events-none hover:pointer-events-auto hover:opacity-100 hover:delay-0 hover:duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:delay-0 group-hover:duration-200">
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
                <Link href="/tracks" className="transition-opacity hover:opacity-75">Library</Link>
                <Link href="/tracks" className="transition-opacity hover:opacity-75">Events</Link>
              </nav>

              <div className="flex flex-wrap items-center gap-[15px]">
                <div className="flex h-10 w-[350px] items-center rounded-[8px] border border-black bg-white px-3">
                  <input
                    type="text"
                    placeholder="Search for courses"
                    className="w-full bg-transparent text-[18px] text-[#73726C] placeholder:text-[#73726C] focus:outline-none"
                    style={{ fontFamily: pangeaFont }}
                  />
                </div>

                <button
                  type="button"
                  aria-label="Search"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-black text-black"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </button>

                <div className="w-[100px]" />

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

          <div className="relative z-20 rounded-[50px] bg-transparent pl-[78px] pr-[58px] pb-[106px] pt-12">
            <div className="grid grid-cols-1 gap-[58px] lg:grid-cols-12">
              <div className="lg:col-span-6">
                <h1
                  className="mt-[85px] w-[612px] text-[48px] font-normal uppercase leading-[120%] tracking-[0] text-black"
                  style={{ fontFamily: pangeaFont }}
                >
                  Discover your next{" "}
                  <em
                    className="text-[48px] font-bold italic leading-[120%] tracking-[0] text-black"
                    style={{ fontFamily: pangeaFont }}
                  >
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
                  Explore thousands of online classes in design, typography, illustration,
                  photography, and more. Taught by industry professionals.
                </p>
                <Link
                  href="/register"
                  className="mt-[30px] inline-flex h-[91px] w-[300px] items-center justify-center rounded-md border border-black bg-white px-4 text-center text-[36px] font-normal leading-[100%] tracking-[0] text-[#141413]"
                  style={{ fontFamily: pangeaFont }}
                >
                  Get Started
                </Link>
                <p
                  className="mt-6 w-[300px] text-center text-[24px] font-normal leading-[120%] tracking-[0] text-black"
                  style={{ fontFamily: pangeaFont }}
                >
                  Or continue with
                </p>
                <div className="mt-[24px] flex w-[300px] items-center justify-center gap-[13px]">
                  <Image src="/social/google.png" alt="Google" width={46} height={46} className="h-[46px] w-[46px]" unoptimized />
                  <Image src="/social/apple.png" alt="Apple" width={46} height={46} className="h-[46px] w-[46px]" unoptimized />
                  <Image src="/social/facebook.png" alt="Facebook" width={46} height={46} className="h-[46px] w-[46px]" unoptimized />
                  <Image src="/social/email.png" alt="Email" width={46} height={46} className="h-[46px] w-[46px]" unoptimized />
                </div>
              </div>

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











