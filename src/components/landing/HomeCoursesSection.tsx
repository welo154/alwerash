"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Users, Bookmark } from "lucide-react";
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
  {
    id: "static-mp-6",
    title: "Lottie Animations",
    summary: "Create lightweight JSON animations for web and app.",
    coverImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
    instructorName: "Motion Studio",
    instructorImage: null,
    track: { title: "Motion Design", slug: "motion-design" },
    lessonCount: 6,
    totalDurationMinutes: 95,
    rating: 4.8,
    studentCount: 520,
  },
  {
    id: "static-mp-7",
    title: "Design Systems in Figma",
    summary: "Build scalable design systems and component libraries.",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d38794a5?w=800&q=80",
    instructorName: "Design Team",
    instructorImage: null,
    track: { title: "UI/UX Design", slug: "ui-ux-design" },
    lessonCount: 16,
    totalDurationMinutes: 280,
    rating: 4.7,
    studentCount: 1100,
  },
  {
    id: "static-mp-8",
    title: "Creative Illustration",
    summary: "From sketch to digital illustration and storytelling.",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    instructorName: "Art Studio",
    instructorImage: null,
    track: { title: "Graphic Design", slug: "graphic-design" },
    lessonCount: 11,
    totalDurationMinutes: 195,
    rating: 4.5,
    studentCount: 890,
  },
];

function formatDuration(totalMinutes: number | null, lessonCount: number): string {
  const mins = totalMinutes ?? lessonCount * 15;
  if (mins <= 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Card for the yellow "New" section – same styling as CourseCard. */
function NewSectionCard({
  course,
  onClick,
}: {
  course: CourseForCard;
  onClick: () => void;
}) {
  const durationLabel = formatDuration(course.totalDurationMinutes, course.lessonCount);
  const instructor = course.instructorName ?? course.track?.title ?? "Mohamed Yassin";
  const rating = course.rating ?? 4.5;
  const studentCount = course.studentCount ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[420px] min-w-[300px] max-w-[320px] shrink-0 flex-col rounded-[24px] border border-gray-100 bg-gray-200 p-4 text-left font-sans shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative mb-4 h-[180px] w-full shrink-0 overflow-hidden rounded-[16px] bg-slate-200">
        {course.coverImage ? (
          <Image
            src={course.coverImage}
            alt={course.title}
            fill
            unoptimized
            className="object-cover object-center transition-transform duration-300 hover:scale-105"
            sizes="320px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-300 text-4xl font-black text-slate-400">
            {course.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[22px] font-black leading-tight tracking-tight text-black uppercase">
          {course.title}
        </h2>
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 fill-black stroke-black" />
          <span className="text-[18px] font-bold">{rating}</span>
        </div>
      </div>
      <div className="mb-4">
        <span className="inline-block rounded-full bg-gray-400 px-4 py-1 text-[18px] font-medium italic text-white">
          {instructor}
        </span>
      </div>
      {course.summary ? (
        <p className="mb-8 line-clamp-3 min-h-0 flex-1 text-[11px] font-medium leading-[1.3] text-black">
          {course.summary}
        </p>
      ) : (
        <div className="min-h-0 flex-1" />
      )}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-full bg-black" />
            <div className="h-3 w-3 rounded-full bg-black" />
            <div className="h-3 w-3 rounded-full border-2 border-black" />
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-5 w-5" strokeWidth={2.5} />
            <span className="text-[16px] font-bold tracking-tight">{durationLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-5 w-5" strokeWidth={2.5} />
            <span className="text-[16px] font-bold">{studentCount}</span>
          </div>
        </div>
        <Bookmark className="h-6 w-6 shrink-0" strokeWidth={1.5} />
      </div>
    </button>
  );
}

/** Most Played card – same styling as CourseCard. */
function CourseCardBlock({
  course,
  onClick,
}: {
  course: CourseForCard;
  onClick: () => void;
}) {
  const durationLabel = formatDuration(course.totalDurationMinutes, course.lessonCount);
  const instructor = course.instructorName ?? course.track?.title ?? "Mohamed Yassin";
  const rating = course.rating ?? 4.5;
  const studentCount = course.studentCount ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[420px] w-full max-w-[320px] flex-col rounded-[24px] border border-gray-100 bg-gray-200 p-4 text-left font-sans shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative mb-4 h-[180px] w-full shrink-0 overflow-hidden rounded-[16px] bg-slate-200">
        {course.coverImage ? (
          <Image
            src={course.coverImage}
            alt={course.title}
            fill
            unoptimized
            className="object-cover object-center transition-transform duration-300 hover:scale-105"
            sizes="320px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-300 text-4xl font-black text-slate-400">
            {course.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[22px] font-black leading-tight tracking-tight text-black uppercase">
          {course.title}
        </h2>
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 fill-black stroke-black" />
          <span className="text-[18px] font-bold">{rating}</span>
        </div>
      </div>
      <div className="mb-4">
        <span className="inline-block rounded-full bg-gray-400 px-4 py-1 text-[18px] font-medium italic text-white">
          {instructor}
        </span>
      </div>
      {course.summary ? (
        <p className="mb-8 line-clamp-3 min-h-0 flex-1 text-[11px] font-medium leading-[1.3] text-black">
          {course.summary}
        </p>
      ) : (
        <div className="min-h-0 flex-1" />
      )}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-full bg-black" />
            <div className="h-3 w-3 rounded-full bg-black" />
            <div className="h-3 w-3 rounded-full border-2 border-black" />
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-5 w-5" strokeWidth={2.5} />
            <span className="text-[16px] font-bold tracking-tight">{durationLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-5 w-5" strokeWidth={2.5} />
            <span className="text-[16px] font-bold">{studentCount}</span>
          </div>
        </div>
        <Bookmark className="h-6 w-6 shrink-0" strokeWidth={1.5} />
      </div>
    </button>
  );
}

type Props = {
  newCourses: CourseForCard[];
  mostPlayedCourses: CourseForCard[];
  fields: string[];
};

const MOST_PLAYED_PAGE_SIZE = 4;

export function HomeCoursesSection({ newCourses, mostPlayedCourses, fields }: Props) {
  const [modalCourse, setModalCourse] = useState<CourseForCard | null>(null);
  const [mostPlayedPage, setMostPlayedPage] = useState(1);
  const fieldList = fields.length > 0 ? fields : FIELDS_FALLBACK;
  const newDisplay = newCourses.length > 0 ? newCourses : STATIC_NEW_CARDS;
  const mostPlayedDisplay = mostPlayedCourses.length > 0 ? mostPlayedCourses : STATIC_MOST_PLAYED_CARDS;
  const mostPlayedTotalPages = Math.max(1, Math.ceil(mostPlayedDisplay.length / MOST_PLAYED_PAGE_SIZE));
  const mostPlayedPaginated = mostPlayedDisplay.slice(
    (mostPlayedPage - 1) * MOST_PLAYED_PAGE_SIZE,
    mostPlayedPage * MOST_PLAYED_PAGE_SIZE
  );

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
                    <NewSectionCard
                      key={course.id}
                      course={course}
                      onClick={() => setModalCourse(course)}
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
                  <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {mostPlayedPaginated.map((course) => (
                        <CourseCardBlock
                          key={course.id}
                          course={course}
                          onClick={() => setModalCourse(course)}
                        />
                      ))}
                    </div>
                    {mostPlayedTotalPages > 1 && (
                      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setMostPlayedPage((p) => Math.max(1, p - 1))}
                          disabled={mostPlayedPage <= 1}
                          aria-label="Previous page"
                          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: mostPlayedTotalPages }, (_, i) => i + 1).map(
                            (page) => (
                              <button
                                key={page}
                                type="button"
                                onClick={() => setMostPlayedPage(page)}
                                aria-label={`Page ${page}`}
                                aria-current={mostPlayedPage === page ? "page" : undefined}
                                className={`min-w-[2.25rem] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                  mostPlayedPage === page
                                    ? "bg-slate-900 text-white"
                                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {page}
                              </button>
                            )
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setMostPlayedPage((p) => Math.min(mostPlayedTotalPages, p + 1))
                          }
                          disabled={mostPlayedPage >= mostPlayedTotalPages}
                          aria-label="Next page"
                          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
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
