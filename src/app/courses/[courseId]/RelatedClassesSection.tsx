"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

type RelatedClassesSectionProps = {
  fontFamily: string;
};

type CourseStackCardProps = {
  titleInstructorLine: string;
  lectureLine: string;
  topicTitle: string;
  continueHref: string;
};

const COURSE_CARD_STACK_OVERLAP_PX = 281 - 69;

function ContinueCourseChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 43" fill="none" width={41} height={41} className="shrink-0" aria-hidden>
      <path
        d="M21.25 41.75C32.5718 41.75 41.75 32.5718 41.75 21.25C41.75 9.92816 32.5718 0.75 21.25 0.75C9.92816 0.75 0.75 9.92816 0.75 21.25C0.75 32.5718 9.92816 41.75 21.25 41.75Z"
        fill="var(--White, #FFF)"
      />
      <path d="M21.25 29.45L29.45 21.25L21.25 13.05" fill="var(--White, #FFF)" />
      <path
        d="M21.25 29.45L29.45 21.25M29.45 21.25L21.25 13.05M29.45 21.25L13.05 21.25M41.75 21.25C41.75 32.5718 32.5718 41.75 21.25 41.75C9.92816 41.75 0.75 32.5718 0.75 21.25C0.75 9.92816 9.92816 0.75 21.25 0.75C32.5718 0.75 41.75 9.92816 41.75 21.25Z"
        stroke="var(--Black, #000)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CourseStackCard({ titleInstructorLine, lectureLine, topicTitle, continueHref, fontFamily }: CourseStackCardProps & { fontFamily: string }) {
  const cardBase = "box-border w-full max-w-[347px] rounded-[50px] border border-[var(--Black,#000)]";

  return (
    <div className="relative w-[347px] max-w-full shrink-0">
      <div
        className={`relative z-1 ${cardBase}`}
        style={{
          height: "378px",
          background: "var(--Grey, #E9E9E9)",
        }}
      >
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "48px", width: "78px", height: "78px" }} aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" className="h-full w-full" style={{ color: "var(--Black, #000)" }}>
            <path
              d="M40 79C61.5391 79 79 61.5391 79 40C79 18.4609 61.5391 1 40 1C18.4609 1 1 18.4609 1 40C1 61.5391 18.4609 79 40 79Z"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M32.2 24.4L55.6 40L32.2 55.6V24.4Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div
        className={`relative z-2 flex min-h-[281px] flex-col overflow-hidden ${cardBase}`}
        style={{
          marginTop: `-${COURSE_CARD_STACK_OVERLAP_PX}px`,
          background: "var(--White, #FFF)",
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col py-[23px] pl-[37px]">
          <p className="m-0 whitespace-pre-line" style={{ color: "#000", fontFamily, fontSize: "18px", fontWeight: 400, opacity: 0.6 }}>
            {titleInstructorLine}
          </p>
          <p className="m-0 mt-[70px]" style={{ color: "#000", fontFamily, fontSize: "18px", fontWeight: 400, opacity: 0.6 }}>
            {lectureLine}
          </p>
          <p className="m-0 mt-[6px]" style={{ color: "#000", fontFamily, fontSize: "24px", fontWeight: 400 }}>
            {topicTitle}
          </p>
          <Link href={continueHref} className="relative mt-[17px] inline-flex shrink-0 pr-[calc(41px/2)] transition-opacity hover:opacity-90">
            <span
              className="flex h-[43px] w-[106px] shrink-0 items-center border border-white px-[16px]"
              style={{
                borderRadius: "var(--Radius-MD, 8px)",
                background: "var(--Dark-Green, #004B3C)",
              }}
            >
              <span style={{ color: "#FFF", fontFamily, fontSize: "18px", fontWeight: 700, lineHeight: "19.6px" }}>START</span>
            </span>
            <span className="absolute left-[106px] top-1/2 z-1 -translate-x-1/2 -translate-y-1/2" aria-hidden>
              <ContinueCourseChevronIcon />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RelatedClassesSection({ fontFamily }: RelatedClassesSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [atBeginning, setAtBeginning] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const cards: CourseStackCardProps[] = [
    { titleInstructorLine: "Illustration Basics -\nAhmad Khaled", lectureLine: "LECTURE - 10mins", topicTitle: "BRUSH TECHNIQUES", continueHref: "/course" },
    { titleInstructorLine: "Color in Practice -\nMona Samir", lectureLine: "LECTURE - 8mins", topicTitle: "COLOR HARMONY", continueHref: "/course" },
    { titleInstructorLine: "Character Design -\nYoussef Adel", lectureLine: "LECTURE - 12mins", topicTitle: "SILHOUETTE FLOW", continueHref: "/course" },
    { titleInstructorLine: "Digital Sketching -\nNouran Ali", lectureLine: "READING - 5mins", topicTitle: "LINE CONFIDENCE", continueHref: "/course" },
    { titleInstructorLine: "Concept Art Intro -\nKarim Tarek", lectureLine: "LECTURE - 11mins", topicTitle: "MOOD BOARDS", continueHref: "/course" },
  ];

  return (
    <section className="mt-[70px] w-full">
      <div className="flex items-center">
        <h2
          className="m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily,
            fontSize: "48px",
            fontStyle: "italic",
            fontWeight: 600,
            lineHeight: "120%",
          }}
        >
          RELATED <span style={{ fontStyle: "normal", fontWeight: 400 }}>CLASSES</span>
        </h2>
        <svg className="ml-[27px]" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 62 62" fill="none" aria-hidden>
          <path d="M31 61C47.5685 61 61 47.5685 61 31C61 14.4315 47.5685 1 31 1C14.4315 1 1 14.4315 1 31C1 47.5685 14.4315 61 31 61Z" fill="var(--White, #FFF)" />
          <path d="M31 43L43 31L31 19" fill="var(--White, #FFF)" />
          <path
            d="M31 43L43 31M43 31L31 19M43 31L19 31M61 31C61 47.5685 47.5685 61 31 61C14.4315 61 1 47.5685 1 31C1 14.4315 14.4315 1 31 1C47.5685 1 61 14.4315 61 31Z"
            stroke="var(--Black, #000)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="relative left-1/2 mt-[50px] w-screen -translate-x-1/2 overflow-hidden pl-[55px] pr-[60px]">
        <Swiper
          slidesPerView="auto"
          spaceBetween={30}
          slidesPerGroup={1}
          speed={450}
          grabCursor
          allowTouchMove
          simulateTouch
          className="overflow-visible!"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setAtBeginning(swiper.isBeginning);
            setAtEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setAtBeginning(swiper.isBeginning);
            setAtEnd(swiper.isEnd);
          }}
          onResize={(swiper) => {
            setAtBeginning(swiper.isBeginning);
            setAtEnd(swiper.isEnd);
          }}
        >
          {cards.map((card, idx) => (
            <SwiperSlide key={`related-card-${idx}`} className="w-[347px]!">
              <CourseStackCard {...card} fontFamily={fontFamily} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          aria-label="Previous related classes"
          disabled={atBeginning}
          onClick={() => swiperRef.current?.slidePrev(450)}
          className="absolute left-[8px] top-1/2 z-20 -translate-y-1/2 disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 62 62" fill="none" aria-hidden className="scale-x-[-1]">
            <path d="M31 61C47.5685 61 61 47.5685 61 31C61 14.4315 47.5685 1 31 1C14.4315 1 1 14.4315 1 31C1 47.5685 14.4315 61 31 61Z" fill="white" />
            <path d="M31 43L43 31L31 19" fill="white" />
            <path
              d="M31 43L43 31M43 31L31 19M43 31L19 31M61 31C61 47.5685 47.5685 61 31 61C14.4315 61 1 47.5685 1 31C1 14.4315 14.4315 1 31 1C47.5685 1 61 14.4315 61 31Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Next related classes"
          disabled={atEnd}
          onClick={() => swiperRef.current?.slideNext(450)}
          className="absolute right-[8px] top-1/2 z-20 -translate-y-1/2 disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 62 62" fill="none" aria-hidden>
            <path d="M31 61C47.5685 61 61 47.5685 61 31C61 14.4315 47.5685 1 31 1C14.4315 1 1 14.4315 1 31C1 47.5685 14.4315 61 31 61Z" fill="white" />
            <path d="M31 43L43 31L31 19" fill="white" />
            <path
              d="M31 43L43 31M43 31L31 19M43 31L19 31M61 31C61 47.5685 47.5685 61 31 61C14.4315 61 1 47.5685 1 31C1 14.4315 14.4315 1 31 1C47.5685 1 61 14.4315 61 31Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}

