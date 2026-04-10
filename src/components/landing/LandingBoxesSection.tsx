"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const TAGS = [
  "FEATURED",
  "DRAWING & PAINTING",
  "ANIMATION",
  "UI/UX DESIGN",
  "CREATIVE WRITING",
  "DIGITAL ILLUSTRATION",
  "FILM & VIDEO",
  "CRAFTS",
  "GRAPHIC DESIGN",
  "TYPOGRAPHY",
  "PRODUCTIVITY",
];

const TAGS_ROW_2 = [
  "PHOTOGRAPHY",
  "ACTIVITY",
  "MARKETING",
  "ART & DESIGN",
  "MOTION",
  "BRANDING",
  "3D & VFX",
  "ILLUSTRATION",
  "VIDEO EDITING",
  "SOCIAL MEDIA",
  "BUSINESS",
];

export function LandingBoxesSection() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeTagRow2, setActiveTagRow2] = useState<string | null>(null);

  return (
    <section className="mt-[107px] w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            loop
            slidesPerView="auto"
            spaceBetween={25}
            grabCursor
            autoplay={{ delay: 2400, disableOnInteraction: false }}
            className="overflow-visible!"
          >
            {TAGS.map((tag, i) => (
              <SwiperSlide key={tag} className="w-auto!">
                <button
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  aria-pressed={activeTag === tag}
                  className={`inline-flex h-[45px] items-center justify-center rounded-[8px] border border-black px-4 text-center text-[24px] font-bold text-black ${
                    activeTag === tag ? "bg-[#59CBE8]" : "bg-white"
                  }`}
                  style={{
                    fontFamily:
                      '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
                    lineHeight: "19.6px",
                  }}
                >
                  {tag}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="relative left-1/2 mt-[11px] w-screen -translate-x-1/2 overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            loop
            slidesPerView="auto"
            spaceBetween={25}
            grabCursor
            autoplay={{ delay: 2600, disableOnInteraction: false }}
            className="overflow-visible!"
          >
            {TAGS_ROW_2.map((tag) => (
              <SwiperSlide key={tag} className="w-auto!">
                <button
                  type="button"
                  onClick={() => setActiveTagRow2(tag)}
                  aria-pressed={activeTagRow2 === tag}
                  className={`inline-flex h-[45px] items-center justify-center rounded-[8px] border border-black px-4 text-center text-[24px] font-bold text-black ${
                    activeTagRow2 === tag ? "bg-[#59CBE8]" : "bg-white"
                  }`}
                  style={{
                    fontFamily:
                      '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
                    lineHeight: "19.6px",
                  }}
                >
                  {tag}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="relative left-1/2 mt-[64px] w-screen -translate-x-1/2 overflow-hidden">
          <Swiper
            loop
            slidesPerView="auto"
            spaceBetween={30}
            grabCursor
            allowTouchMove
            simulateTouch
            className="overflow-visible!"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SwiperSlide key={i} className="w-[347px]!">
                <div className="relative h-[585px] w-[347px] overflow-hidden rounded-[50px] border border-black bg-[#E9E9E9]">
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between pl-[38px] pr-[30px] pt-[28px]">
                    <span className="inline-flex h-[36px] items-center justify-center rounded-[8px] border border-black bg-white px-4 text-[20px] leading-none text-black">
                      Beginner
                    </span>
                    <span
                      className="text-[18px] font-normal leading-normal text-black opacity-60"
                      style={{
                        fontFamily:
                          '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
                      }}
                    >
                      12hrs
                    </span>
                  </div>

                  <div
                    className="absolute bottom-[351px] left-[38px] text-[32px] font-normal uppercase leading-normal text-black"
                    style={{
                      fontFamily:
                        '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
                    }}
                  >
                    DIGITAL
                    <br />
                    ILLUSTRATION
                    <span className="ml-2 inline-flex h-[20px] w-[20px] align-middle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 23 23"
                        fill="none"
                        className="h-[20px] w-[20px]"
                        aria-hidden
                      >
                        <path
                          d="M1.25 1.25L21.25 21.25M21.25 21.25V1.25M21.25 21.25H1.25"
                          stroke="#1E1E1E"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 h-[339px] rounded-[50px] bg-white shadow-[inset_0_1px_0_0_#000]" />

                  <button
                    type="button"
                    className="absolute bottom-[26px] left-[38px] flex h-[43px] w-[166px] items-center rounded-[8px] border border-[#004B3C] bg-[#004B3C] pl-4 pr-10 text-white"
                    style={{
                      fontFamily:
                        '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
                      fontSize: "18px",
                      fontWeight: 700,
                      lineHeight: "19.6px",
                    }}
                  >
                    VIEW MORE
                    <span className="absolute top-[20.5px] right-[7px] inline-flex  -translate-y-1/2 translate-x-1/2 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 43 43"
                        fill="none"
                        className="h-[43.5px] w-[43px]"
                        aria-hidden
                      >
                        <path
                          d="M21.25 41.75C32.5718 41.75 41.75 32.5718 41.75 21.25C41.75 9.92816 32.5718 0.75 21.25 0.75C9.92816 0.75 0.75 9.92816 0.75 21.25C0.75 32.5718 9.92816 41.75 21.25 41.75Z"
                          fill="white"
                        />
                        <path d="M21.25 29.45L29.45 21.25L21.25 13.05" fill="white" />
                        <path
                          d="M21.25 29.45L29.45 21.25M29.45 21.25L21.25 13.05M29.45 21.25L13.05 21.25M41.75 21.25C41.75 32.5718 32.5718 41.75 21.25 41.75C9.92816 41.75 0.75 32.5718 0.75 21.25C0.75 9.92816 9.92816 0.75 21.25 0.75C32.5718 0.75 41.75 9.92816 41.75 21.25Z"
                          stroke="#1E1E1E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
