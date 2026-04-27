"use client";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

/**
 * Matches {@link LearnFeaturedCoursesPanel} heading row (pill + 60px circle arrow).
 * Wire `onNext` when a popular carousel exists.
 */
export function LearnPopularClassesHeading({ onNext }: { onNext?: () => void }) {
  return (
    <div className="relative inline-flex items-center pr-[30px]">
      <div className="inline-flex h-[72px] items-center rounded-[44px] bg-white pl-[22px] pr-[22px]">
        <h2 className="m-0 uppercase leading-none" style={{ fontFamily: pangeaFont, lineHeight: "57.6px" }}>
          <span
            style={{
              color: "#000",
              fontSize: "48px",
              fontStyle: "italic",
              fontWeight: 700,
            }}
          >
            POPULAR
          </span>
          <span
            style={{
              color: "#000",
              fontSize: "48px",
              fontStyle: "normal",
              fontWeight: 400,
            }}
          >
            {" "}
            CLASSES
          </span>
        </h2>
      </div>
      <button
        type="button"
        className="absolute left-full top-1/2 z-0 inline-flex h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0"
        aria-label="Next popular classes"
        suppressHydrationWarning
        onClick={() => onNext?.()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={60}
          height={60}
          viewBox="0 0 62 62"
          fill="none"
          className="h-[60px] w-[60px]"
          aria-hidden
        >
          <path
            d="M31 61C47.5685 61 61 47.5685 61 31C61 14.4315 47.5685 1 31 1C14.4315 1 1 14.4315 1 31C1 47.5685 14.4315 61 31 61Z"
            fill="var(--White, #FFF)"
          />
          <path d="M31 43L43 31L31 19" fill="var(--White, #FFF)" />
          <path
            d="M31 43L43 31M43 31L31 19M43 31L19 31M61 31C61 47.5685 47.5685 61 31 61C14.4315 61 1 47.5685 1 31C1 14.4315 14.4315 1 31 1C47.5685 1 61 14.4315 61 31Z"
            stroke="var(--Black, #000)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
