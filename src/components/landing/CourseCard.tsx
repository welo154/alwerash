import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Users, Bookmark } from "lucide-react";

export type CourseCardProps = {
  id: string;
  title: string;
  summary?: string | null;
  coverImage?: string | null;
  track?: { title: string; slug: string } | null;
  lessonCount?: number;
  badge?: string | null;
  instructorName?: string | null;
  instructorImage?: string | null;
  /** Total duration in minutes (overrides lessonCount-based estimate when set) */
  totalDurationMinutes?: number | null;
  /** Display rating e.g. 4.5 */
  rating?: number | null;
  /** Number of learners (e.g. with progress in this course) */
  studentCount?: number | null;
  className?: string;
  interactive?: boolean;
  /** "mostPlayed" = same as default style, for Trending/Most played section */
  variant?: "default" | "mostPlayed";
};

/**
 * Course card: default and mostPlayed share the same layout (white card, 180px image, instructor pill, footer).
 */
function formatDuration(totalMinutes: number | null | undefined, lessonCount: number): string {
  const mins = totalMinutes ?? lessonCount * 15;
  if (mins <= 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function CourseCard({
  id,
  title,
  summary,
  coverImage,
  track,
  lessonCount = 0,
  instructorName,
  totalDurationMinutes,
  rating,
  studentCount,
  className = "",
  interactive = true,
  variant = "default",
}: CourseCardProps) {
  const instructor = instructorName ?? track?.title ?? "Mohamed Yassin";
  const durationLabel = formatDuration(totalDurationMinutes, lessonCount);
  const displayRating = rating ?? 4.5;
  const displayStudents = studentCount ?? 0;

  const cardContent = (
    <>
      {/* Course Image */}
      <div className="relative mb-4 h-[180px] w-full shrink-0 overflow-hidden rounded-[16px] bg-slate-200">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            unoptimized
            className="object-cover object-center transition-transform duration-300 hover:scale-105"
            sizes={variant === "mostPlayed" ? "320px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-300 text-4xl font-black text-slate-400">
            {title.charAt(0)}
          </div>
        )}
      </div>

      {/* Header Section */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[22px] font-black leading-tight tracking-tight text-black uppercase">
          {title}
        </h2>
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 fill-black stroke-black" />
          <span className="text-[18px] font-bold">{displayRating}</span>
        </div>
      </div>

      {/* Instructor Tag */}
      <div className="mb-4">
        <span className="inline-block rounded-full bg-gray-400 px-4 py-1 text-[18px] font-medium italic text-white">
          {instructor}
        </span>
      </div>

      {/* Description */}
      {summary ? (
        <p className="mb-8 line-clamp-3 min-h-0 flex-1 text-[11px] font-medium leading-[1.3] text-black">
          {summary}
        </p>
      ) : (
        <div className="min-h-0 flex-1" />
      )}

      {/* Footer Info */}
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
            <span className="text-[16px] font-bold">{displayStudents}</span>
          </div>
        </div>
        <Bookmark className="h-6 w-6 shrink-0" strokeWidth={1.5} />
      </div>
    </>
  );

  const cardClassName =
    variant === "mostPlayed"
      ? `block h-[420px] w-full max-w-[320px] mx-auto flex flex-col rounded-[24px] border border-gray-100 bg-gray-200 p-4 font-sans text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${className}`
      : `flex h-[420px] max-w-[320px] flex-col rounded-[24px] border border-gray-100 bg-gray-200 p-4 font-sans text-left shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg ${className}`;

  return (
    <Link
      href={`/courses/${id}`}
      className={cardClassName}
      {...(interactive ? { "data-gsap-hover": true } : {})}
    >
      {cardContent}
    </Link>
  );
}
