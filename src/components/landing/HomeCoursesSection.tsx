"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import Link from "next/link";
import { CatalogShowcaseCard, catalogShowcasePropsFromCourse } from "@/components/cards";
import { CourseModal } from "./CourseModal";
import type { CourseForCard } from "@/server/content/public.service";

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

/** Static fallback cards when API returns no courses (New section). */
const STATIC_NEW_CARDS: CourseForCard[] = [
  {
    id: "static-new-1",
    title: "Figma Fundamentals",
    summary: "Master the basics of Figma for UI design. Covers frames, components, and prototyping.",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d38794a5?w=800&q=80",
    instructorName: "Design Team",
    instructorImage: null,
    track: { title: "UI/UX Design", slug: "ui-ux-design" },
    lessonCount: 12,
    totalDurationMinutes: 180,
    rating: 4.5,
    studentCount: 1240,
  },
  {
    id: "static-new-2",
    title: "Motion Design in After Effects",
    summary: "Create smooth animations and motion graphics. From keyframes to expressions.",
    coverImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
    instructorName: "Motion Studio",
    instructorImage: null,
    track: { title: "Motion Design", slug: "motion-design" },
    lessonCount: 18,
    totalDurationMinutes: 320,
    rating: 4.8,
    studentCount: 890,
  },
  {
    id: "static-new-3",
    title: "Logo & Brand Identity",
    summary: "Design memorable logos and build cohesive brand systems.",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    instructorName: "Brand Lab",
    instructorImage: null,
    track: { title: "Graphic Design", slug: "graphic-design" },
    lessonCount: 10,
    totalDurationMinutes: 145,
    rating: 4.6,
    studentCount: 2100,
  },
];

/** Static fallback cards when API returns no courses (Most played section). */
const STATIC_MOST_PLAYED_CARDS: CourseForCard[] = [
  {
    id: "static-mp-1",
    title: "Figma Fundamentals",
    summary: "Master the basics of Figma for UI design.",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d38794a5?w=800&q=80",
    instructorName: "Design Team",
    instructorImage: null,
    track: { title: "UI/UX Design", slug: "ui-ux-design" },
    lessonCount: 12,
    totalDurationMinutes: 180,
    rating: 4.5,
    studentCount: 1240,
  },
  {
    id: "static-mp-2",
    title: "Prototyping in Figma",
    summary: "Create interactive prototypes and hand off to dev.",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    instructorName: "Design Team",
    instructorImage: null,
    track: { title: "UI/UX Design", slug: "ui-ux-design" },
    lessonCount: 8,
    totalDurationMinutes: 120,
    rating: 4.7,
    studentCount: 980,
  },
  {
    id: "static-mp-3",
    title: "Logo Design Masterclass",
    summary: "Design memorable logos and brand identities.",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    instructorName: "Brand Lab",
    instructorImage: null,
    track: { title: "Graphic Design", slug: "graphic-design" },
    lessonCount: 10,
    totalDurationMinutes: 145,
    rating: 4.6,
    studentCount: 2100,
  },
  {
    id: "static-mp-4",
    title: "After Effects Basics",
    summary: "Get started with motion design and animation.",
    coverImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
    instructorName: "Motion Studio",
    instructorImage: null,
    track: { title: "Motion Design", slug: "motion-design" },
    lessonCount: 14,
    totalDurationMinutes: 220,
    rating: 4.5,
    studentCount: 756,
  },
  {
    id: "static-mp-5",
    title: "Typography Fundamentals",
    summary: "Typography principles and best practices for design.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    instructorName: "Brand Lab",
    instructorImage: null,
    track: { title: "Graphic Design", slug: "graphic-design" },
    lessonCount: 9,
    totalDurationMinutes: 135,
    rating: 4.6,
    studentCount: 1680,
  },
];

type Props = {
  newCourses: CourseForCard[];
  mostPlayedCourses: CourseForCard[];
  fields: string[];
};

export function HomeCoursesSection({ newCourses, mostPlayedCourses, fields }: Props) {
  const [modalCourse, setModalCourse] = useState<CourseForCard | null>(null);
  const fieldList = fields.length > 0 ? fields : FIELDS_FALLBACK;
  const newDisplay = newCourses.length > 0 ? newCourses : STATIC_NEW_CARDS;
  const mostPlayedDisplay = mostPlayedCourses.length > 0 ? mostPlayedCourses : STATIC_MOST_PLAYED_CARDS;

  return (
    <>
      <section className="border-b border-slate-200/80 bg-white px-4 py-16 sm:px-6" data-gsap-reveal>
        <div className="mx-auto max-w-[1920px]">
          <h2 className="text-center text-7xl font-black uppercase tracking-tight text-slate-900">
            COURSES
          </h2>

          <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:gap-12">
            {/* Left: Fields sidebar */}
            <aside className="w-full shrink-0 lg:w-56">
              <h2 className="mb-6 text-xl font-black uppercase tracking-tight text-slate-900">
                Fields
              </h2>
              <ul className="space-y-3">
                {fieldList.slice(0, 16).map((title) => (
                  <li key={title}>
                    <Link
                      href="/learn"
                      className="text-[15px] font-medium text-gray-800 transition-colors hover:text-black cursor-pointer"
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
                  {newDisplay.map((course) => (
                    <CatalogShowcaseCard
                      key={course.id}
                      {...catalogShowcasePropsFromCourse(course, {
                        levelLabel: "New",
                        onOpenModal: () => setModalCourse(course),
                      })}
                      className="shrink-0"
                    />
                  ))}
                </div>
              </div>

              {/* MOST PLAYED: grid with pagination */}
              <div>
                <h3 className="mb-4 text-lg font-bold uppercase tracking-tight text-slate-900">
                  MOST PLAYED
                </h3>
                {mostPlayedDisplay.length === 0 ? (
                  <div className="flex h-40 w-72 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-slate-400">
                    No courses yet
                  </div>
                ) : (
                  <div className="relative w-full overflow-hidden">
                    <Swiper
                      slidesPerView="auto"
                      spaceBetween={30}
                      grabCursor
                      className="overflow-visible!"
                    >
                      {mostPlayedDisplay.map((course) => (
                        <SwiperSlide key={course.id} className="w-[347px]!">
                          <CatalogShowcaseCard
                            {...catalogShowcasePropsFromCourse(course, {
                              onOpenModal: () => setModalCourse(course),
                            })}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
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
