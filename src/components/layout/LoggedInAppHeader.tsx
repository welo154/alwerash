"use client";

import Image from "next/image";
import Link from "next/link";
import { UserMenu } from "./UserMenu";
import { SearchBar } from "./SearchBar";

export type LoggedInAppHeaderProps = {
  user: { name?: string | null; email?: string | null; image?: string | null };
  isAdmin: boolean;
};

const BAR_GREEN = "#004B3C";
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

export function LoggedInAppHeader({ user }: LoggedInAppHeaderProps) {
  return (
    <header className="relative z-50 mb-[50px] w-full px-[40px] pt-[35px]" aria-label="Logged in header">
      <div className="relative h-[112px] w-full">
        <svg
          className="absolute inset-0 z-30 h-full w-full"
          viewBox="0 0 1345 112"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1289.96 0C1320.34 0 1344.96 24.6243 1344.96 55V57C1344.96 87.3757 1320.34 112 1289.96 112H9.96477C-5.88179 112 -1.61592 96 14.2306 96H170.965C195.265 95.9998 214.965 76.3004 214.965 52V50C214.965 22.3858 237.351 0 264.965 0H1289.96Z"
            fill={BAR_GREEN}
          />
        </svg>

        <Link
          href="/home"
          className="absolute top-[8px] left-0 z-10 block bg-transparent"
          aria-label="Go to home"
        >
          <Image
            src="/brand/alwerash-logo.png"
            alt="Alwerash"
            width={220}
            height={96}
            className="h-[96px] w-[220px] bg-transparent object-contain mix-blend-multiply"
            unoptimized
            priority
          />
        </Link>

        <div
          className="absolute inset-0 z-40 flex min-w-0 items-center justify-between pl-[280px] pr-[55px] text-white"
          style={{ fontFamily: pangeaFont }}
        >
          <div className="flex min-w-0 items-center">
            <nav className="hidden items-center gap-[30px] text-[18px] font-normal leading-normal text-white lg:flex">
              <div className="group relative">
                <Link
                  href="/course"
                  className="inline-flex items-center gap-0 text-[18px] font-normal leading-[33px] text-white hover:opacity-90"
                >
                  Courses
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4 transition-transform duration-150 group-hover:rotate-180"
                    aria-hidden
                  >
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                {/* Bridges the gap so group-hover stays active while moving to the panel */}
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
              <Link href="/library" className="text-white hover:opacity-90">
                Library
              </Link>
              <Link href="/events" className="text-white hover:opacity-90">
                Events
              </Link>
            </nav>

            <div className="ml-[30px] flex h-10 w-[350px] shrink-0 items-center justify-center px-3">
              <SearchBar variant="toolbar" />
            </div>
            <button
              type="button"
              aria-label="Search"
              className="ml-[15px] flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10"
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 42 42"
              fill="none"
              className="h-10 w-10"
              aria-hidden
            >
              <path
                d="M20.75 28.75L28.75 20.75M28.75 20.75L20.75 12.75M28.75 20.75H12.75M40.75 20.75C40.75 31.7957 31.7957 40.75 20.75 40.75C9.7043 40.75 0.75 31.7957 0.75 20.75C0.75 9.7043 9.7043 0.75 20.75 0.75C31.7957 0.75 40.75 9.7043 40.75 20.75Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            </button>
          </div>

          <div className="flex shrink-0 items-center">
            <Link
              href="/course"
              className="mr-[8px] hidden whitespace-nowrap text-[18px] font-normal leading-normal text-white hover:opacity-90 md:inline"
            >
              My Learning
            </Link>
            <Link
              href="/course"
              className="mr-[5px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Favorites"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 18"
                fill="none"
                className="h-[20px] w-[18px]"
                aria-hidden
              >
                <path
                  d="M17.4121 2.21452C16.9723 1.76608 16.4501 1.41034 15.8753 1.16763C15.3005 0.924925 14.6845 0.800003 14.0623 0.800003C13.4402 0.800003 12.8241 0.924925 12.2494 1.16763C11.6746 1.41034 11.1524 1.76608 10.7126 2.21452L9.79982 3.14476L8.88704 2.21452C7.99863 1.30912 6.79369 0.800472 5.5373 0.800472C4.2809 0.800472 3.07596 1.30912 2.18756 2.21452C1.29915 3.11992 0.800049 4.3479 0.800049 5.62833C0.800049 6.90876 1.29915 8.13674 2.18756 9.04214L9.79982 16.8L17.4121 9.04214C17.8521 8.59391 18.2012 8.06171 18.4393 7.47596C18.6775 6.89021 18.8 6.26237 18.8 5.62833C18.8 4.99428 18.6775 4.36645 18.4393 3.7807C18.2012 3.19495 17.8521 2.66275 17.4121 2.21452Z"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <button
              type="button"
              className="mr-[20px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 22"
                fill="none"
                className="h-[20px] w-[18px]"
                aria-hidden
              >
                <path
                  d="M11.5801 19.8534C11.4043 20.1565 11.1519 20.4081 10.8483 20.583C10.5447 20.7579 10.2005 20.85 9.8501 20.85C9.49972 20.85 9.15549 20.7579 8.85187 20.583C8.54826 20.4081 8.29591 20.1565 8.1201 19.8534M15.8501 6.85106C15.8501 5.25948 15.218 3.73309 14.0927 2.60767C12.9675 1.48225 11.4414 0.849998 9.8501 0.849998C8.2588 0.849998 6.73268 1.48225 5.60746 2.60767C4.48224 3.73309 3.8501 5.25948 3.8501 6.85106C3.8501 13.8523 0.850098 15.8527 0.850098 15.8527H18.8501C18.8501 15.8527 15.8501 13.8523 15.8501 6.85106Z"
                  stroke="white"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <UserMenu user={user} theme="green" />
          </div>
        </div>
      </div>
    </header>
  );
}











