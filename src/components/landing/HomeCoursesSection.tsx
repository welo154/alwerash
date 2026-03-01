"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Users, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { CourseModal, type CourseForModal } from "./CourseModal";

function CarouselNavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:pointer-events-none"
    >
      <Icon className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}

export type CourseForCard = CourseForModal;

const FIELDS_FALLBACK = [
  "AI & Innovation",
  "Animation & 3D",
  "Art & Illustration",
  "Crafts & DIY",
  "Creative Career",
  "Creativity & Inspiration",
  "Design",
  "Development",
  "Film & Video",
  "Home & Lifestyle",
  "Marketing & Business",
  "Music & Audio",
  "Personal Development",
  "Photography",
  "Productivity",
];

/** Card for the yellow "New" section: min-w 300px, aspect 1.4/1 image, smaller type. */
function NewSectionCard({
  course,
  onClick,
}: {
  course: CourseForCard;
  onClick: () => void;
}) {
  const durationLabel = course.lessonCount
    ? `${Math.floor((course.lessonCount * 15) / 60)}h ${(course.lessonCount * 15) % 60}m`
    : "7h 38m";
  const instructor = course.instructorName ?? course.track?.title ?? "Mohamed Yassin";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[420px] min-w-[300px] shrink-0 flex-col rounded-[24px] border border-gray-200 bg-gray-200 p-4 text-left font-sans shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Photo: fixed height */}
      <div className="relative mb-4 h-[180px] w-full shrink-0 overflow-hidden rounded-[12px] bg-slate-200">
        {course.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.coverImage}
            alt={course.title}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-300 text-4xl font-black text-slate-400">
            {course.title.charAt(0)}
          </div>
        )}
      </div>
      {/* Content distributed vertically */}
      <div className="flex min-h-0 flex-1 flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-black uppercase leading-tight tracking-tighter text-black">
            {course.title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-black stroke-black" />
            <span className="text-[16px] font-bold">4.5</span>
          </div>
        </div>
        <div>
          <span className="inline-block rounded-full bg-gray-300 px-4 py-0.5 text-[14px] font-semibold italic text-black">
            {instructor}
          </span>
        </div>
        {course.summary ? (
          <p className="line-clamp-3 text-[10px] font-medium leading-[1.3] text-gray-900">
            {course.summary}
          </p>
        ) : (
          <div className="min-h-[2.5rem]" />
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="h-2.5 w-2.5 rounded-full bg-black" />
              <div className="h-2.5 w-2.5 rounded-full bg-black" />
              <div className="h-2.5 w-2.5 rounded-full border-2 border-black" />
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} strokeWidth={2.5} />
              <span className="text-[14px] font-bold">{durationLabel}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} strokeWidth={2.5} />
              <span className="text-[14px] font-bold">254</span>
            </div>
          </div>
          <Bookmark size={20} strokeWidth={1.5} className="shrink-0 cursor-pointer hover:fill-black" />
        </div>
      </div>
    </button>
  );
}

/** Most Played card - same content, text and structure as New section card. */
function CourseCardBlock({
  course,
  onClick,
}: {
  course: CourseForCard;
  onClick: () => void;
}) {
  const durationLabel = course.lessonCount
    ? `${Math.floor((course.lessonCount * 15) / 60)}h ${(course.lessonCount * 15) % 60}m`
    : "7h 38m";
  const instructor = course.instructorName ?? course.track?.title ?? "Mohamed Yassin";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-[420px] w-full max-w-[320px] flex-col rounded-[24px] border border-gray-200 bg-gray-200 p-4 text-left font-sans shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Photo - same as New section */}
      <div className="relative mb-4 h-[180px] w-full shrink-0 overflow-hidden rounded-[12px] bg-slate-200">
        {course.coverImage ? (
          <Image
            src={course.coverImage}
            alt={course.title}
            fill
            unoptimized
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            sizes="320px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-300 text-4xl font-black text-slate-400">
            {course.title.charAt(0)}
          </div>
        )}
      </div>
      {/* Content distributed vertically */}
      <div className="flex min-h-0 flex-1 flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-black uppercase leading-tight tracking-tighter text-black">
            {course.title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-black stroke-black" />
            <span className="text-[16px] font-bold">4.5</span>
          </div>
        </div>
        <div>
          <span className="inline-block rounded-full bg-gray-300 px-4 py-0.5 text-[14px] font-semibold italic text-black">
            {instructor}
          </span>
        </div>
        {course.summary ? (
          <p className="line-clamp-3 text-[10px] font-medium leading-[1.3] text-gray-900">
            {course.summary}
          </p>
        ) : (
          <div className="min-h-[2.5rem]" />
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="h-2.5 w-2.5 rounded-full bg-black" />
              <div className="h-2.5 w-2.5 rounded-full bg-black" />
              <div className="h-2.5 w-2.5 rounded-full border-2 border-black" />
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} strokeWidth={2.5} />
              <span className="text-[14px] font-bold">{durationLabel}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} strokeWidth={2.5} />
              <span className="text-[14px] font-bold">254</span>
            </div>
          </div>
          <Bookmark size={20} strokeWidth={1.5} className="shrink-0 cursor-pointer hover:fill-black" />
        </div>
      </div>
    </button>
  );
}

type Props = {
  courses: CourseForCard[];
  fields: string[];
};

export function HomeCoursesSection({ courses, fields }: Props) {
  const [modalCourse, setModalCourse] = useState<CourseForModal | null>(null);
  const mostPlayedSwiperRef = useRef<SwiperType | null>(null);
  const fieldList = fields.length > 0 ? fields : FIELDS_FALLBACK;
  const newCourses = courses.slice(0, 3);
  const mostPlayedCourses = courses.length > 0 ? courses : [];

  return (
    <>
      <section className="border-b border-slate-200/80 bg-white px-4 py-16 sm:px-6" data-gsap-reveal>
        <div className="mx-auto max-w-[1920px]">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900 sm:text-3xl">
            COURSES
          </h2>

          <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:gap-12">
            {/* Left: FIELDS sidebar */}
            <aside className="w-full shrink-0 lg:w-48">
              <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">
                FIELDS
              </h3>
              <ul className="mt-4 space-y-2">
                {fieldList.slice(0, 16).map((title) => (
                  <li key={title}>
                    <Link
                      href="/learn"
                      className="text-sm text-slate-700 transition-colors hover:text-slate-900"
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Right: NEW + MOST PLAYED — wider area, max 5 cards visible */}
            <div className="min-w-0 flex-1 space-y-12">
              {/* NEW: yellow background, "New" label on the left, horizontal scroll cards */}
              <div
                className="flex flex-row overflow-hidden rounded-[24px] p-4 md:gap-6 md:p-6"
                style={{ backgroundColor: "#FFD700" }}
              >
                {/* Left: vertical "New" label - black, 5xl */}
                <div className="flex min-w-[100px] shrink-0 items-center justify-center border-black/10 pr-2 sm:min-w-[120px] md:min-w-[140px] md:border-r md:pr-4">
                  <h2
                    className="select-none text-5xl font-black uppercase leading-none tracking-tighter text-black"
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "center center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    New
                  </h2>
                </div>
                <div className="flex flex-1 items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {newCourses.length === 0 ? (
                    <div className="flex h-40 min-w-[300px] items-center justify-center rounded-lg border-2 border-dashed border-black/20 text-slate-600">
                      No courses yet
                    </div>
                  ) : (
                    newCourses.map((course) => (
                      <NewSectionCard
                        key={course.id}
                        course={course}
                        onClick={() => setModalCourse(course)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* MOST PLAYED: carousel, 5 cards per row on large screens */}
              <div>
                <h3 className="mb-4 text-lg font-bold uppercase tracking-tight text-slate-900">
                  MOST PLAYED
                </h3>
                {mostPlayedCourses.length === 0 ? (
                  <div className="flex h-40 w-72 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-slate-400">
                    No courses yet
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CarouselNavButton
                      direction="prev"
                      onClick={() => mostPlayedSwiperRef.current?.slidePrev()}
                    />
                    <Swiper
                      spaceBetween={12}
                      slidesPerView={1}
                      onSwiper={(swiper) => {
                        mostPlayedSwiperRef.current = swiper;
                      }}
                      breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1280: { slidesPerView: 4 },
                        1536: { slidesPerView: 4 },
                      }}
                      className="min-w-0 flex-1"
                    >
                      {mostPlayedCourses.map((course) => (
                        <SwiperSlide key={course.id}>
                          <div className="h-full">
                            <CourseCardBlock
                              course={course}
                              onClick={() => setModalCourse(course)}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <CarouselNavButton
                      direction="next"
                      onClick={() => mostPlayedSwiperRef.current?.slideNext()}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CourseModal
        course={modalCourse}
        open={modalCourse !== null}
        onClose={() => setModalCourse(null)}
      />
    </>
  );
}
