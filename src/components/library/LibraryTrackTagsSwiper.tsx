"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

const FULL_BLEED =
  "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2";

const TAG_GAP_PX = 25;
const TAG_TRACK_MIN_WIDTH_PX = 7200;

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

export type LibraryTrackTag = {
  slug: string;
  label: string;
};

function estimateTagWidthPx(label: string): number {
  return 32 + label.length * 14 + TAG_GAP_PX;
}

function tagsForLoopRow(tags: LibraryTrackTag[]): LibraryTrackTag[] {
  if (tags.length === 0) return [];
  const cycleWidth = tags.reduce(
    (sum, tag) => sum + estimateTagWidthPx(tag.label),
    0
  );
  const repeats = Math.max(
    8,
    Math.ceil(TAG_TRACK_MIN_WIDTH_PX / Math.max(cycleWidth, 1)) + 2
  );
  return Array.from({ length: repeats }, () => tags).flat();
}

function initTagSwiper(swiper: SwiperType) {
  requestAnimationFrame(() => {
    swiper.update();
    swiper.autoplay?.start();
  });
}

function TrackTagPill({ tag }: { tag: LibraryTrackTag }) {
  return (
    <Link
      href={`/tracks/${encodeURIComponent(tag.slug)}`}
      className="inline-flex h-[45px] shrink-0 items-center justify-center rounded-[8px] border border-black bg-white px-4 text-center text-[24px] font-bold text-black no-underline transition-colors hover:bg-slate-50"
      style={{
        fontFamily: pangeaFont,
        lineHeight: "19.6px",
      }}
    >
      {tag.label}
    </Link>
  );
}

const TAG_SWIPER_BASE = {
  modules: [Autoplay],
  slidesPerView: "auto" as const,
  spaceBetween: TAG_GAP_PX,
  loop: true,
  speed: 650,
  grabCursor: true,
  allowTouchMove: true,
  simulateTouch: true,
  observer: true,
  observeParents: true,
  watchSlidesProgress: true,
};

function TrackTagsMarqueeRow({
  rowId,
  tags,
  autoplayDelayMs,
  className = "",
}: {
  rowId: string;
  tags: LibraryTrackTag[];
  autoplayDelayMs: number;
  className?: string;
}) {
  const loopTags = useMemo(() => tagsForLoopRow(tags), [tags]);
  if (loopTags.length === 0) return null;

  return (
    <div className={`${FULL_BLEED} overflow-hidden pl-6 sm:pl-8 ${className}`.trim()}>
      <Swiper
        {...TAG_SWIPER_BASE}
        loopAdditionalSlides={Math.max(tags.length * 2, 8)}
        autoplay={{
          delay: autoplayDelayMs,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="landing-showcase-swiper landing-showcase-swiper--tags w-full"
        onSwiper={initTagSwiper}
        onResize={initTagSwiper}
      >
        {loopTags.map((tag, index) => (
          <SwiperSlide key={`${rowId}-${tag.slug}-${index}`}>
            <TrackTagPill tag={tag} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export function LibraryTrackTagsSwiper({
  row1,
  row2,
}: {
  row1: LibraryTrackTag[];
  row2: LibraryTrackTag[];
}) {
  const mergedRow1 = useMemo(() => {
    const merged = [...row1];
    for (const tag of row2) {
      if (!merged.some((item) => item.slug === tag.slug)) {
        merged.push(tag);
      }
    }
    return merged;
  }, [row1, row2]);

  if (row1.length === 0 && row2.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-hidden">
      {mergedRow1.length > 0 ? (
        <TrackTagsMarqueeRow rowId="library-r1" tags={mergedRow1} autoplayDelayMs={2400} />
      ) : null}
      {row2.length > 0 ? (
        <TrackTagsMarqueeRow
          rowId="library-r2"
          tags={row2}
          autoplayDelayMs={2600}
          className="mt-[11px]"
        />
      ) : null}
    </div>
  );
}
