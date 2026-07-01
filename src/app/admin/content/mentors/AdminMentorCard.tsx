"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";

export type AdminMentorCardMentor = {
  id: string;
  name: string;
  photo: string | null;
  featuredOrder: number | null;
};

export function AdminMentorCard({
  mentor,
  toggleFeatured,
}: {
  mentor: AdminMentorCardMentor;
  toggleFeatured: (mentorId: string, featured: boolean) => Promise<void>;
}) {
  const [isFeatured, setIsFeatured] = useState(mentor.featuredOrder != null);
  const [pending, startTransition] = useTransition();

  function handleFeaturedChange(next: boolean) {
    const prev = isFeatured;
    setIsFeatured(next);
    startTransition(async () => {
      try {
        await toggleFeatured(mentor.id, next);
      } catch {
        setIsFeatured(prev);
        alert("Featured mentor list is full (max 8). Remove one first.");
      }
    });
  }

  return (
    <div className="group relative flex h-[320px] max-w-[260px] flex-col rounded-[24px] border border-gray-100 bg-gray-200 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/admin/content/mentors/${mentor.id}`}
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      >
        {isFeatured ? (
          <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            Featured
          </span>
        ) : null}
        <div className="absolute inset-0">
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
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12">
          <span className="text-lg font-bold leading-tight text-white drop-shadow-sm">
            {mentor.name}
          </span>
        </div>
      </Link>

      <label
        className={`m-3 mt-0 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
          isFeatured
            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        } ${pending ? "pointer-events-none opacity-60" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
          checked={isFeatured}
          disabled={pending}
          onChange={(e) => handleFeaturedChange(e.target.checked)}
        />
        Featured on Learn page
      </label>
    </div>
  );
}
