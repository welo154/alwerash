"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Star, Clock, User, Bookmark } from "lucide-react";

export type CourseForModal = {
  id: string;
  title: string;
  summary?: string | null;
  coverImage?: string | null;
  instructorName?: string | null;
  instructorImage?: string | null;
  track?: { title: string; slug: string } | null;
  lessonCount?: number;
};

type Props = {
  course: CourseForModal | null;
  open: boolean;
  onClose: () => void;
};

export function CourseModal({ course, open, onClose }: Props) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !course) return null;

  const durationLabel = course.lessonCount
    ? `${Math.floor((course.lessonCount * 15) / 60)}h ${(course.lessonCount * 15) % 60}m`
    : "7h 38m";
  const instructor = course.instructorName ?? course.track?.title ?? "Mohamed Yassin";
  const previewImage = course.coverImage ?? course.instructorImage ?? null;

  return (
    <div
      className="fixed  inset-0 z-50 flex h-full items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      aria-modal
      role="dialog"
      aria-labelledby="modal-course-title"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 z-0"
        aria-label="Close overlay"
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-scale-in sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-auto right-2 top-2 z-20 rounded-full bg-white/95 p-1.5 shadow-md transition-colors hover:bg-white hover:shadow-sm sm:right-3 sm:top-3"
          aria-label="Close"
        >
          <X className="h-6 w-6 text-black" />
        </button>

        {/* One card: photo + details, with padding around the whole card */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Video / course preview image - inside card with rounded corners */}
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-gray-200">
            {previewImage ? (
              <Image
                src={previewImage}
                alt={course.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 672px) 100vw, 672px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gray-400">
                {course.title.charAt(0)}
              </div>
            )}
          </div>

          {/* Content - same card, below image */}
          <div className="flex min-h-0 flex-1 flex-col items-center overflow-hidden pt-6 text-center sm:pt-8">
          <h2
            id="modal-course-title"
            className="text-4xl font-black uppercase italic tracking-tight text-black"
          >
            {course.title}
          </h2>

          <Link
            href={`/courses/${course.id}`}
            className="w-full rounded-xl py-4 text-4xl font-black text-black shadow-sm transition-colors hover:opacity-95"
            style={{ backgroundColor: "#FFD700" }}
          >
            Watch Now
          </Link>

          {course.summary && (
            <p className="max-w-lg text-sm leading-relaxed text-gray-600">
              {course.summary}
            </p>
          )}

          {/* Instructor & Rating Bar - instructor in light gray box like in photo */}
          <div className="flex w-full items-center justify-between rounded-lg bg-gray-100 p-2">
            <div className="rounded-lg bg-gray-200 px-6 py-2 text-2xl font-bold italic text-black">
              {instructor}
            </div>
            <div className="flex items-center gap-1 text-2xl font-bold">
              <Star className="h-6 w-6 fill-current" />
              <span>4.5</span>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex w-full items-center justify-between border-t border-gray-100 pt-4 self-stretch">
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-black" />
              <div className="h-8 w-8 rounded-full bg-black" />
              <div className="h-8 w-8 rounded-full border-2 border-black" />
            </div>
            <div className="flex items-center gap-6 text-xl font-bold">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                <span>{durationLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-6 w-6" />
                <span>254</span>
              </div>
            </div>
            <button type="button" className="transition-colors hover:text-gray-600">
              <Bookmark className="h-7 w-7" />
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
