"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";

export type AdminMentorCardMentor = {
  id: string;
  name: string;
  photo: string | null;
  featuredOrder: number | null;
  landingPopularOrder: number | null;
};

export function AdminMentorCard({
  mentor,
  toggleFeatured,
  togglePopular,
}: {
  mentor: AdminMentorCardMentor;
  toggleFeatured: (mentorId: string, featured: boolean) => Promise<void>;
  togglePopular: (mentorId: string, popular: boolean) => Promise<void>;
}) {
  const [isFeatured, setIsFeatured] = useState(mentor.featuredOrder != null);
  const [isPopular, setIsPopular] = useState(mentor.landingPopularOrder != null);
  const [featuredPending, startFeaturedTransition] = useTransition();
  const [popularPending, startPopularTransition] = useTransition();

  function handleFeaturedChange(next: boolean) {
    const prev = isFeatured;
    setIsFeatured(next);
    startFeaturedTransition(async () => {
      try {
        await toggleFeatured(mentor.id, next);
      } catch {
        setIsFeatured(prev);
        alert("Featured mentor list is full (max 8). Remove one first.");
      }
    });
  }

  function handlePopularChange(next: boolean) {
    const prev = isPopular;
    setIsPopular(next);
    startPopularTransition(async () => {
      try {
        await togglePopular(mentor.id, next);
      } catch {
        setIsPopular(prev);
        alert("Popular home mentor list is full (max 12). Remove one first.");
      }
    });
  }

  return (
    <div className="group relative flex min-h-[380px] max-w-[260px] flex-col rounded-[24px] border border-gray-100 bg-gray-200 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/admin/content/mentors/${mentor.id}`}
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[24px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      >
        {isFeatured ? (
          <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            Featured
          </span>
        ) : null}
        {isPopular ? (
          <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow-sm">
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
        <div className="absolute inset-0 min-h-[260px]">
          {mentor.photo ? (
            <Image
              src={mentor.photo}
              alt={mentor.name}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              unoptimized
              sizes="260px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-300 text-4xl font-black text-slate-500">
              {mentor.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="relative mt-auto min-h-[260px] bg-gradient-to-t from-black/80 via-black/20 to-transparent px-4 pb-4 pt-24">
          <span className="text-lg font-bold leading-tight text-white drop-shadow-sm">
            {mentor.name}
          </span>
        </div>
      </Link>

      <label
        className={`m-3 mb-2 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
          isFeatured
            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        } ${featuredPending ? "pointer-events-none opacity-60" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
          checked={isFeatured}
          disabled={featuredPending}
          onChange={(e) => handleFeaturedChange(e.target.checked)}
        />
        Featured on Learn page
      </label>

      <label
        className={`mx-3 mb-3 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
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
        Popular on home page
      </label>
    </div>
  );
}
