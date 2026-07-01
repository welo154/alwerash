"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";

export type AdminCourseCardCourse = {
  id: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  published: boolean;
  featuredMostPlayedOrder: number | null;
  featuredTrendingOrder: number | null;
  track: { title: string } | null;
};

export function AdminCourseCard({
  course,
  togglePopular,
  toggleTrending,
}: {
  course: AdminCourseCardCourse;
  togglePopular: (courseId: string, popular: boolean) => Promise<void>;
  toggleTrending: (courseId: string, trending: boolean) => Promise<void>;
}) {
  const [isPopular, setIsPopular] = useState(course.featuredMostPlayedOrder != null);
  const [isTrending, setIsTrending] = useState(course.featuredTrendingOrder != null);
  const [popularPending, startPopularTransition] = useTransition();
  const [trendingPending, startTrendingTransition] = useTransition();

  function handlePopularChange(next: boolean) {
    const prev = isPopular;
    setIsPopular(next);
    startPopularTransition(async () => {
      try {
        await togglePopular(course.id, next);
      } catch {
        setIsPopular(prev);
      }
    });
  }

  function handleTrendingChange(next: boolean) {
    const prev = isTrending;
    setIsTrending(next);
    startTrendingTransition(async () => {
      try {
        await toggleTrending(course.id, next);
      } catch {
        setIsTrending(prev);
        alert("Trending list is full (max 6 courses). Remove one first.");
      }
    });
  }

  return (
    <div className="group relative flex min-h-[420px] max-w-[300px] flex-col rounded-[24px] border border-gray-100 bg-gray-200 p-4 font-sans text-left shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/admin/content/courses/${course.id}`}
        className="flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 rounded-[16px]"
      >
        <div className="relative mb-3 h-[140px] w-full shrink-0 overflow-hidden rounded-[16px] bg-slate-200">
          {isTrending ? (
            <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-violet-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Trending
            </span>
          ) : null}
          {isPopular ? (
            <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3 w-3"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  clipRule="evenodd"
                />
              </svg>
              Popular
            </span>
          ) : null}
          {course.coverImage ? (
            <Image
              src={course.coverImage}
              alt=""
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
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-black leading-tight tracking-tight text-black uppercase">
            {course.title}
          </h3>
        </div>
        <div className="mb-4">
          <span className="inline-block rounded-full bg-gray-400 px-3 py-1 text-sm font-medium italic text-white">
            {course.track?.title ?? "No track"}
          </span>
        </div>
        {course.summary ? (
          <p className="mb-2 line-clamp-2 min-h-0 flex-1 text-[11px] font-medium leading-[1.3] text-black">
            {course.summary}
          </p>
        ) : (
          <div className="min-h-0 flex-1" />
        )}
        <div className="mt-auto flex items-center justify-between">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              course.published ? "bg-gray-400 text-white" : "bg-slate-300 text-slate-600"
            }`}
          >
            {course.published ? "Published" : "Draft"}
          </span>
          <span className="text-sm font-bold text-black group-hover:text-[var(--color-primary)]">
            Manage →
          </span>
        </div>
      </Link>

      <label
        className={`mt-3 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
          isPopular
            ? "border-amber-300 bg-amber-50 text-amber-900"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        } ${popularPending ? "pointer-events-none opacity-60" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
          checked={isPopular}
          disabled={popularPending}
          onChange={(e) => handlePopularChange(e.target.checked)}
        />
        Popular class
      </label>

      <label
        className={`mt-2 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
          isTrending
            ? "border-violet-300 bg-violet-50 text-violet-900"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        } ${trendingPending ? "pointer-events-none opacity-60" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-violet-500 focus:ring-violet-400"
          checked={isTrending}
          disabled={trendingPending}
          onChange={(e) => handleTrendingChange(e.target.checked)}
        />
        Trending class
      </label>
    </div>
  );
}
