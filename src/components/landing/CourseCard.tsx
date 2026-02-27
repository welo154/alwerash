import Link from "next/link";
import Image from "next/image";

export type CourseCardProps = {
  id: string;
  title: string;
  summary?: string | null;
  coverImage?: string | null;
  track?: { title: string; slug: string } | null;
  lessonCount?: number;
  /** Optional badge in top-right (e.g. "Featured" or "ينفع") */
  badge?: string | null;
  /** Optional instructor name; falls back to track title */
  instructorName?: string | null;
  /** Optional instructor image URL for avatar */
  instructorImage?: string | null;
  /** Card container class (e.g. for grid layout) */
  className?: string;
  /** Use card-hover and data-gsap-hover for landing sections */
  interactive?: boolean;
};

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

/**
 * Course card matching the reference: top image + lime-to-teal gradient overlay
 * with pill-highlighted title and subtitle; bottom section with title, duration, instructor.
 */
export function CourseCard({
  id,
  title,
  summary,
  coverImage,
  track,
  lessonCount = 0,
  badge,
  instructorName,
  instructorImage,
  className = "",
  interactive = true,
}: CourseCardProps) {
  const subtitle = instructorName ?? track?.title ?? "Course";
  const durationLabel =
    lessonCount > 0 ? `${lessonCount} lesson${lessonCount === 1 ? "" : "s"}` : "—";

  const linkClass = interactive
    ? "group card-hover block overflow-hidden rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-400/80"
    : "block overflow-hidden rounded-2xl border border-slate-200/90 bg-white";

  return (
    <Link
      href={`/courses/${id}`}
      className={`${linkClass} ${className}`}
      {...(interactive ? { "data-gsap-hover": true } : {})}
    >
      {/* Top section: image + gradient overlay + title/subtitle with pill highlights (~60%) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500">
            Course
          </div>
        )}
        {/* Gradient overlay: lime left → teal right */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-lime-500/85 via-emerald-600/85 to-teal-600/90"
          aria-hidden
        />
        {/* Content overlay: bottom-left */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
          <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm sm:text-xl">
            <span className="inline rounded-md bg-emerald-500/95 px-1.5 py-0.5">
              {title}
            </span>
          </h3>
          <p className="mt-1.5 text-sm font-bold text-white/95 sm:text-base">
            <span className="inline rounded-md bg-emerald-600/95 px-1.5 py-0.5">
              {subtitle}
            </span>
          </p>
        </div>
        {/* Optional badge: top-right */}
        {badge ? (
          <div
            className="absolute right-3 top-3 text-sm font-medium text-white/95"
            style={{ fontFamily: "system-ui, sans-serif" }}
            aria-hidden
          >
            {badge}
          </div>
        ) : null}
      </div>

      {/* Bottom section: white, title + meta row with clock and instructor (~40%) */}
      <div className="bg-white p-4 sm:p-5">
        <h3 className="font-bold text-emerald-700 sm:text-lg">{title}</h3>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4 shrink-0 text-slate-400" />
            {durationLabel}
          </span>
          <span className="inline-flex items-center gap-2">
            <span>{subtitle}</span>
            {instructorImage ? (
              <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-slate-200">
                <Image
                  src={instructorImage}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="24px"
                />
              </span>
            ) : (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-xs font-medium text-emerald-700">
                {subtitle.charAt(0)}
              </span>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
