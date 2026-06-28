"use client";

import Link from "next/link";
import { useState } from "react";
import { CatalogShowcaseCard, CATALOG_SHOWCASE_CARD_H } from "@/components/cards";
import type { LandingShowcaseSlide } from "@/components/cards/catalog-showcase-map";
import type { HomeTrackMetaFilter, HomeTrackPill } from "@/types/home-track-explorer";

const FULL_BLEED = "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2";

const META_FILTERS: { id: HomeTrackMetaFilter; label: string }[] = [
  { id: "featured", label: "FEATURED" },
  { id: "topRated", label: "TOP RATED" },
  { id: "activity", label: "ACTIVITY" },
];

const pillFont = {
  fontFamily: '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif',
  lineHeight: "19.6px",
} as const;

function MetaFilterPill({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`inline-flex h-[45px] shrink-0 items-center justify-center rounded-[8px] border border-black px-4 text-center text-[24px] font-bold text-black ${
        pressed ? "bg-[#59CBE8]" : "bg-white"
      }`}
      style={pillFont}
    >
      {label}
    </button>
  );
}

function TrackLinkPill({ pill }: { pill: HomeTrackPill }) {
  return (
    <Link
      href={`/tracks/${encodeURIComponent(pill.slug)}`}
      className="inline-flex h-[45px] shrink-0 items-center justify-center rounded-[8px] border border-black bg-white px-4 text-center text-[24px] font-bold text-black no-underline transition-colors hover:bg-slate-50"
      style={pillFont}
    >
      {pill.label}
    </Link>
  );
}

export type HomeTrackExplorerSectionProps = {
  trackPillRow1: HomeTrackPill[];
  trackPillRow2: HomeTrackPill[];
  slidesByFilter: Record<HomeTrackMetaFilter, LandingShowcaseSlide[]>;
  showDiscoverCta?: boolean;
  sectionClassName?: string;
};

export function HomeTrackExplorerSection({
  trackPillRow1,
  trackPillRow2,
  slidesByFilter,
  showDiscoverCta = true,
  sectionClassName = "mt-[107px]",
}: HomeTrackExplorerSectionProps) {
  const [metaFilter, setMetaFilter] = useState<HomeTrackMetaFilter>("featured");
  const slides = slidesByFilter[metaFilter] ?? [];

  return (
    <section className={`${sectionClassName} w-full overflow-x-hidden`}>
      <div className={`${FULL_BLEED} flex flex-wrap gap-[25px] px-6 sm:px-8`}>
        {META_FILTERS.map((f) => (
          <MetaFilterPill
            key={f.id}
            label={f.label}
            pressed={metaFilter === f.id}
            onClick={() => setMetaFilter(f.id)}
          />
        ))}
      </div>

      {trackPillRow1.length > 0 ? (
        <div className={`${FULL_BLEED} mt-[25px] flex flex-wrap gap-[25px] px-6 sm:px-8`}>
          {trackPillRow1.map((pill) => (
            <TrackLinkPill key={pill.slug} pill={pill} />
          ))}
        </div>
      ) : null}

      {trackPillRow2.length > 0 ? (
        <div className={`${FULL_BLEED} mt-[11px] flex flex-wrap gap-[25px] px-6 sm:px-8 pr-[68px]`}>
          {trackPillRow2.map((pill) => (
            <TrackLinkPill key={pill.slug} pill={pill} />
          ))}
        </div>
      ) : null}

      <div
        className="mx-auto mt-[64px] w-full max-w-[1600px] px-6 sm:px-8"
        style={{ minHeight: CATALOG_SHOWCASE_CARD_H }}
      >
        <div key={metaFilter} className="flex flex-wrap justify-center gap-[30px]">
          {slides.map(({ slug, cardProps }) => (
            <CatalogShowcaseCard key={slug} {...cardProps} showcaseSlug={slug} />
          ))}
        </div>
      </div>

      {showDiscoverCta ? (
        <div className="mx-auto mt-[65px] max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[216px] flex-wrap items-center justify-between gap-6 lg:pl-[92px] lg:pr-[72px]">
            <p className="w-[612px] max-w-full text-[24px] font-normal leading-[127%] text-black" style={pillFont}>
              Explore thousands of online classes in design, typography, illustration, photography, and more. Taught by
              industry professionals.
            </p>
            <Link
              href="/course"
              className="inline-flex h-[91px] w-[247px] shrink-0 items-center justify-center rounded-[8px] border border-black px-4 text-center text-[36px] font-normal leading-[19.6px] text-[color:var(--Text-Primary,#141413)] no-underline transition-opacity hover:opacity-90"
              style={{ ...pillFont, backgroundColor: "var(--Blue, #64E1FF)" }}
            >
              Discover
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
