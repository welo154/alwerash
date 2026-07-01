"use client";

type LearnCarouselEdgeNavProps = {
  atBeginning: boolean;
  atEnd: boolean;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
};

export function LearnCarouselEdgeNav({
  atBeginning,
  atEnd,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: LearnCarouselEdgeNavProps) {
  return (
    <>
      <button
        type="button"
        className="absolute top-1/2 left-0 z-20 flex h-[43px] w-[43px] -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/90 p-0 shadow-sm transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-35"
        aria-label={prevLabel}
        disabled={atBeginning}
        suppressHydrationWarning
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPrev();
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M15 6L9 12L15 18"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        className="absolute top-1/2 right-0 z-20 flex h-[43px] w-[43px] -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/90 p-0 shadow-sm transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-35"
        aria-label={nextLabel}
        disabled={atEnd}
        suppressHydrationWarning
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNext();
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 6L15 12L9 18"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
