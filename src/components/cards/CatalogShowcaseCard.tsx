"use client";

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { CatalogShowcaseCardProps } from "./catalog-showcase-map";
import { appendShowcaseToHref } from "./catalog-showcase-map";
import { useArabicLayout } from "@/components/providers/LocaleProvider";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

export type { CatalogShowcaseCardProps } from "./catalog-showcase-map";

const pangeaFont = pangeaFontFamily;

function ExternalLinkGlyph({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 23 23"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M1.25 1.25L21.25 21.25M21.25 21.25V1.25M21.25 21.25H1.25"
        stroke="#1E1E1E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma track card: white text panel (323×323.077) on top, photo panel (323×289.744) below. */
const SHOWCASE_PHOTO_H = 289.744;
const SHOWCASE_TOP_H = 323.077;
/** Panels intersect by (photo height − 176)px, leaving 176px of the photo panel clear. */
const SHOWCASE_PANEL_OVERLAP = SHOWCASE_PHOTO_H - 176;
const SHOWCASE_PHOTO_TOP = SHOWCASE_TOP_H - SHOWCASE_PANEL_OVERLAP;
const SHOWCASE_CARD_H = SHOWCASE_PHOTO_TOP + SHOWCASE_PHOTO_H;
const SHOWCASE_ACCENT = "#89F496";

const SHOWCASE_TITLE_AR: Record<string, string> = {
  "creative coding": "البرمجة الإبداعية",
  branding: "الهوية البصرية",
  "3d design": "التصميم ثلاثي الأبعاد",
  "ui / ux": "واجهة وتجربة المستخدم",
  "ui/ux": "واجهة وتجربة المستخدم",
  calligraphy: "الخط",
  ornamentation: "الزخرفة",
  illustration: "الرسم",
  "cv & portfolio": "السيرة والأعمال",
  "business & design": "الأعمال والتصميم",
};

function arabicShowcaseTitle(primary: string, secondary?: string) {
  const joined = [primary, secondary].filter(Boolean).join(" ").replace(/\s+/g, " ").trim().toLowerCase();
  return SHOWCASE_TITLE_AR[joined] ?? [primary, secondary].filter(Boolean).join(" ");
}

function arabicLevelLabel(label: string) {
  const key = label.trim().toLowerCase();
  if (key === "beginner") return "مبتــدئ";
  if (key === "intermediate") return "متوسط";
  if (key === "advanced") return "متقدم";
  return label;
}

function arabicDurationLabel(label: string) {
  const hoursAndMinutes = label.match(/(\d+)\s*h(?:rs?)?(?:\s*(\d+)\s*m)?/i);
  if (hoursAndMinutes) {
    const hours = Number(hoursAndMinutes[1]);
    const minutes = hoursAndMinutes[2] ? Number(hoursAndMinutes[2]) : 0;
    if (hours > 0 && minutes > 0) return `${hours} ساعة و ${minutes} دقيقة`;
    if (hours > 0) return `${hours} ساعة`;
    return `${minutes} دقيقة`;
  }
  const minutesOnly = label.match(/(\d+)\s*m/i);
  if (minutesOnly) return `${minutesOnly[1]} دقيقة`;
  return label;
}

/** Fixed catalog tile size — keep carousels in sync with CatalogShowcaseCard layout. */
export const CATALOG_SHOWCASE_CARD_W = 323;
export const CATALOG_SHOWCASE_CARD_H = SHOWCASE_CARD_H;

export function FeaturedViewMoreCircle() {
  return (
    <span className="relative block h-[50px] w-[50px]" aria-hidden>
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 51 51" fill="none" className="block h-[50px] w-[50px]">
        <path
          d="M25.1499 50.15C38.957 50.15 50.1499 38.9571 50.1499 25.15C50.1499 11.3429 38.957 0.149994 25.1499 0.149994C11.3428 0.149994 0.149902 11.3429 0.149902 25.15C0.149902 38.9571 11.3428 50.15 25.1499 50.15Z"
          fill="#FFF"
        />
        <path
          d="M50.1499 25.15C50.1499 38.9571 38.957 50.15 25.1499 50.15C11.3428 50.15 0.149902 38.9571 0.149902 25.15C0.149902 11.3429 11.3428 0.149994 25.1499 0.149994C38.957 0.149994 50.1499 11.3429 50.1499 25.15Z"
          stroke="var(--Black, #000)"
          strokeWidth={0.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 22 22"
        fill="none"
        className="absolute top-1/2 left-1/2 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2"
      >
        <path d="M10.75 20.75L15.75 15.75L20.75 10.75L10.75 0.75" fill="#FFF" />
        <path
          d="M10.75 0.75L20.75 10.75L15.75 15.75L10.75 20.75M20.75 10.75L0.75 10.75"
          stroke="var(--Black, #000)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ViewMoreCircleGlyph({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 43" fill="none" className={className} aria-hidden>
      <path
        d="M21.25 41.75C32.5718 41.75 41.75 32.5718 41.75 21.25C41.75 9.92816 32.5718 0.75 21.25 0.75C9.92816 0.75 0.75 9.92816 0.75 21.25C0.75 32.5718 9.92816 41.75 21.25 41.75Z"
        fill="white"
      />
      <path d="M21.25 29.45L29.45 21.25L21.25 13.05" fill="white" />
      <path
        d="M21.25 29.45L29.45 21.25M29.45 21.25L21.25 13.05M29.45 21.25L13.05 21.25M41.75 21.25C41.75 32.5718 32.5718 41.75 21.25 41.75C9.92816 41.75 0.75 32.5718 0.75 21.25C0.75 9.92816 9.92816 0.75 21.25 0.75C32.5718 0.75 41.75 9.92816 41.75 21.25Z"
        stroke="#1E1E1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HOVER_PORTAL_Z = 2147483000;

/** Expanded hover card — Figma-style two panels */
const HOVER_EXPAND_W = 618;
const HOVER_EXPAND_TOP_H = 403;
const HOVER_EXPAND_BOTTOM_H = 305;
const HOVER_EXPAND_OVERLAP = HOVER_EXPAND_BOTTOM_H - 221;
const HOVER_EXPAND_WHITE_TOP = HOVER_EXPAND_TOP_H - HOVER_EXPAND_OVERLAP;
const HOVER_EXPAND_CARD_H = HOVER_EXPAND_WHITE_TOP + HOVER_EXPAND_BOTTOM_H;

const BRIGHT_GREEN = "#89F496";

function HoverHeartGlyph({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 30" fill="none" className={className} aria-hidden>
      <path
        d="M29.4097 3.27539C28.6522 2.49062 27.7528 1.86808 26.763 1.44334C25.7731 1.0186 24.7121 0.799988 23.6407 0.799988C22.5692 0.799988 21.5082 1.0186 20.5184 1.44334C19.5285 1.86808 18.6291 2.49062 17.8717 3.27539L16.2997 4.90331L14.7276 3.27539C13.1976 1.69094 11.1224 0.800809 8.95864 0.800809C6.79485 0.800809 4.71968 1.69094 3.18965 3.27539C1.65961 4.85984 0.800049 7.00881 0.800049 9.24956C0.800049 11.4903 1.65961 13.6393 3.18965 15.2237L16.2997 28.8L29.4097 15.2237C30.1675 14.4393 30.7686 13.508 31.1788 12.4829C31.5889 11.4578 31.8 10.3591 31.8 9.24956C31.8 8.13998 31.5889 7.04127 31.1788 6.01621C30.7686 4.99114 30.1675 4.0598 29.4097 3.27539Z"
        fill="#FFF"
        stroke="var(--sds-color-icon-default-default, #1E1E1E)"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HoverLearnersGlyph({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 20" fill="none" className={className} aria-hidden>
      <path
        d="M16.2727 19V17C16.2727 15.9391 15.8705 14.9217 15.1544 14.1716C14.4384 13.4214 13.4672 13 12.4545 13H4.81818C3.80554 13 2.83437 13.4214 2.11832 14.1716C1.40227 14.9217 1 15.9391 1 17V19M22 19V17C21.9994 16.1137 21.7178 15.2528 21.1995 14.5523C20.6812 13.8519 19.9555 13.3516 19.1364 13.13M15.3182 1.13C16.1395 1.3503 16.8674 1.8507 17.3873 2.55231C17.9071 3.25392 18.1893 4.11683 18.1893 5.005C18.1893 5.89317 17.9071 6.75608 17.3873 7.45769C16.8674 8.1593 16.1395 8.6597 15.3182 8.88M12.4545 5C12.4545 7.20914 10.7451 9 8.63636 9C6.52764 9 4.81818 7.20914 4.81818 5C4.81818 2.79086 6.52764 1 8.63636 1C10.7451 1 12.4545 2.79086 12.4545 5Z"
        stroke="var(--sds-color-icon-default-default, #1E1E1E)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HoverLikeGlyph({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 22" fill="none" className={className} aria-hidden>
      <path
        d="M5.79167 9.625L9.625 1C10.3875 1 11.1188 1.3029 11.6579 1.84207C12.1971 2.38124 12.5 3.1125 12.5 3.875V7.70833H17.9242C18.202 7.70519 18.4772 7.76248 18.7307 7.87625C18.9842 7.99002 19.2099 8.15754 19.3922 8.3672C19.5745 8.57687 19.7091 8.82366 19.7865 9.09049C19.864 9.35732 19.8825 9.6378 19.8408 9.9125L18.5183 18.5375C18.449 18.9945 18.2169 19.4111 17.8647 19.7105C17.5124 20.0099 17.0639 20.1719 16.6017 20.1667H5.79167M5.79167 9.625V20.1667M5.79167 9.625H2.91667C2.40834 9.625 1.92082 9.82693 1.56138 10.1864C1.20193 10.5458 1 11.0333 1 11.5417V18.25C1 18.7583 1.20193 19.2458 1.56138 19.6053C1.92082 19.9647 2.40834 20.1667 2.91667 20.1667H5.79167"
        stroke="var(--sds-color-icon-default-default, #1E1E1E)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const featuredMetaText = {
  color: "var(--Text-Primary, #141413)",
  textAlign: "center" as const,
  fontFamily: pangeaFont,
  fontSize: 18,
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
};

function FeaturedHoverMeta({
  levelLabel,
  durationLabel,
}: {
  levelLabel: string;
  durationLabel: string;
}) {
  const arabic = useArabicLayout();
  const level = arabic ? arabicLevelLabel(levelLabel) : levelLabel;
  const duration = arabic ? arabicDurationLabel(durationLabel) : durationLabel;

  return (
    <>
      <div
        dir={arabic ? "rtl" : undefined}
        className="featured-hover-only pointer-events-none absolute flex items-center"
        style={{ top: 25, height: 36, ...(arabic ? { right: 38 } : { left: 38 }) }}
      >
        <span
          className="inline-flex items-center justify-center"
          style={{
            height: 36,
            padding: "0 16px",
            borderRadius: 23,
            border: "1px solid var(--Black, #000)",
            background: "var(--Green, #8AF396)",
            ...featuredMetaText,
          }}
        >
          {level}
        </span>
        <span
          className="relative flex items-center"
          style={{
            marginInlineStart: 10,
            width: 164,
            height: 36,
            padding: "0 16px",
            borderRadius: 23,
            border: "1px solid var(--Black, #000)",
            background: "var(--White, #FFF)",
          }}
        >
          <span className="absolute top-1/2 -translate-y-1/2" style={{ insetInlineStart: 13 }}>
            <HoverLearnersGlyph className="block h-[18px] w-[21px]" />
          </span>
          <span className="absolute top-1/2 flex -translate-y-1/2 items-center" style={{ insetInlineStart: 47, gap: 5 }}>
            <span style={{ ...featuredMetaText, fontStyle: "italic" }}>234</span>
            <span style={featuredMetaText}>{arabic ? "متعلم" : "learners"}</span>
          </span>
        </span>
        <span
          className="relative flex items-center"
          style={{
            marginInlineStart: 10,
            width: 79,
            height: 36,
            padding: "0 16px",
            borderRadius: 23,
            border: "1px solid var(--Black, #000)",
            background: "var(--White, #FFF)",
          }}
        >
          <span className="absolute top-1/2 -translate-y-1/2" style={{ insetInlineStart: 10 }}>
            <HoverLikeGlyph className="block h-[19.167px] w-[18.863px]" />
          </span>
          <span className="absolute top-1/2 -translate-y-1/2" style={{ insetInlineStart: 33.863, ...featuredMetaText }}>
            98%
          </span>
        </span>
        <span className="inline-flex items-center" style={{ marginInlineStart: 16 }} aria-hidden>
          <HoverHeartGlyph className="block h-[28px] w-[31px]" />
        </span>
        <span
          style={{
            marginInlineStart: 23,
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 18,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            opacity: 0.6,
            textAlign: arabic ? "right" : undefined,
          }}
        >
          {duration}
        </span>
      </div>
      <p
        dir={arabic ? "rtl" : undefined}
        className="featured-hover-only pointer-events-none absolute"
        style={{
          top: 104,
          width: 501,
          margin: 0,
          textAlign: arabic ? "right" : undefined,
          ...(arabic ? { right: 38 } : { left: 38 }),
        }}
      >
        <span
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 18,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            opacity: 0.6,
          }}
        >
          {arabic
            ? "في هذه الدورات ستتعلم كل ما تحتاجه لتصبح فنانًا رقميًا محترفًا، من الأساسيات إلى المستوى المتقدم."
            : "In these courses you will learn everything you need to become a professional digital artist, from basic to advanced."}
        </span>
      </p>
    </>
  );
}

/** Portal-mounted expanded preview: bright-green + white two-panel card. */
function CatalogShowcaseHoverCard({
  visible,
  position,
  levelLabel,
  durationLabel,
  titlePrimary,
  titleSecondary,
  href,
  onHoverCardEnter,
  onHoverCardLeave,
  onClose,
}: {
  visible: boolean;
  position: { left: number; top: number } | null;
  levelLabel: string;
  durationLabel: string;
  titlePrimary: string;
  titleSecondary?: string;
  /** Course href — used to navigate from inside the expanded card */
  href?: string;
  onHoverCardEnter: () => void;
  onHoverCardLeave: () => void;
  onClose: () => void;
}) {
  if (!visible || !position || typeof document === "undefined") return null;

  const pillLevelClass =
    "inline-flex h-9 shrink-0 items-center justify-center rounded-[8px] border border-black bg-white px-4 text-center text-[18px] font-normal not-italic leading-[19.6px] text-[color:var(--Text-Primary,#141413)]";
  const pillLearnersClass =
    "flex h-9 w-[164px] shrink-0 items-center justify-center gap-1.5 rounded-[8px] border border-black bg-white px-4 text-center";
  const hoverPillTextPrimary =
    "text-[18px] font-normal leading-[19.6px] text-[color:var(--Text-Primary,#141413)]";
  const pillLikesClass =
    "flex h-9 w-[79px] shrink-0 items-center justify-center gap-1.5 rounded-[8px] border border-black bg-white px-4 text-center";

  return createPortal(
    <div
      data-slot="catalog-showcase-hover-card"
      className="fixed cursor-default overflow-hidden rounded-[50px] shadow-2xl"
      style={{
        zIndex: HOVER_PORTAL_Z,
        left: position.left,
        top: position.top,
        width: HOVER_EXPAND_W,
        height: HOVER_EXPAND_CARD_H,
      }}
      onMouseEnter={onHoverCardEnter}
      onMouseLeave={onHoverCardLeave}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button — lets touch users dismiss without navigating */}
      <button
        type="button"
        aria-label="Close preview"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white hover:bg-black/45"
        style={{ fontSize: "20px", lineHeight: 1 }}
      >
        ✕
      </button>

      <div
        className="absolute inset-x-0 top-0 z-1 rounded-[50px] border border-black max-lg:border-black/20"
        style={{ height: HOVER_EXPAND_TOP_H, backgroundColor: BRIGHT_GREEN }}
      />

      <div
        className="absolute inset-x-0 z-2 rounded-[50px] border border-black max-lg:border-black/20 bg-white"
        style={{ top: HOVER_EXPAND_WHITE_TOP, height: HOVER_EXPAND_BOTTOM_H }}
      />

      <div
        className="absolute inset-0 z-3 pt-[36px] pl-[49px] pr-10"
        style={{ fontFamily: pangeaFont }}
      >
        <div className="flex flex-wrap items-center gap-[10px]">
          <span className={pillLevelClass}>{levelLabel}</span>
          <span className={pillLearnersClass}>
            <HoverLearnersGlyph className="h-[18px] w-[21px] shrink-0" />
            <span className={`${hoverPillTextPrimary} italic`}>234</span>
            <span className={`${hoverPillTextPrimary} not-italic`}> Learners</span>
          </span>
          <span className={pillLikesClass}>
            <HoverLikeGlyph className="h-[19.167px] w-[18.863px] shrink-0" />
            <span className={`${hoverPillTextPrimary} not-italic`}>98%</span>
          </span>
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0 text-inherit outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/35"
            aria-label="Save"
            suppressHydrationWarning
          >
            <HoverHeartGlyph className="h-[28px] w-[31px] shrink-0" />
          </button>
          <span className="ml-auto text-[15px] font-medium text-black/80">{durationLabel}</span>
        </div>

        <p className="mt-[45px] max-w-[540px] text-[18px] font-normal not-italic leading-[normal] text-[color:var(--Black,#000)]">
          In these courses you will learn everything you need to become a professional digital artist, from basic to
          advanced.
        </p>

        <div className="mt-[40px] flex items-end gap-2 text-[32px] font-normal not-italic leading-[normal] text-[color:var(--Black,#000)]">
          <div className="flex flex-col">
            <span>{titlePrimary}</span>
            {titleSecondary ? <span>{titleSecondary}</span> : null}
          </div>
          <span className="inline-flex h-[22px] w-[22px] shrink-0 -translate-y-[10px]">
            <ExternalLinkGlyph className="h-[22px] w-[22px]" />
          </span>
        </div>

        <p className="absolute top-[372px] right-[49px] text-right text-[12px] font-medium text-black/60">
          Last Updated 3/2026
        </p>

        {/* VIEW MORE inside the expanded card — this one actually navigates */}
        {href ? (
          <Link
            href={href}
            className="absolute bottom-7 left-[49px] flex h-[43px] w-[166px] items-center rounded-[8px] border border-[#004B3C] bg-[#004B3C] pl-4 pr-10 text-[18px] font-bold leading-none text-white no-underline transition-colors hover:bg-white hover:text-[#004B3C]"
            style={{ fontFamily: pangeaFont }}
          >
            VIEW MORE
            <span className="absolute top-[20.5px] right-[7px] inline-flex -translate-y-1/2 translate-x-1/2">
              <ViewMoreCircleGlyph className="h-[43.5px] w-[43px]" />
            </span>
          </Link>
        ) : (
          <div
            className="absolute bottom-7 left-[49px] flex h-[43px] w-[166px] items-center rounded-[8px] border border-[#004B3C] bg-[#004B3C] pl-4 pr-10 text-[18px] font-bold leading-none text-white transition-colors hover:bg-white hover:text-[#004B3C]"
            style={{ fontFamily: pangeaFont }}
          >
            VIEW MORE
            <span className="absolute top-[20.5px] right-[7px] inline-flex -translate-y-1/2 translate-x-1/2">
              <ViewMoreCircleGlyph className="h-[43.5px] w-[43px]" />
            </span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/** Tall catalog tile (landing hero strip, learn page, grids). */
export function CatalogShowcaseCard({
  showcaseSlug,
  levelLabel = "Beginner",
  durationLabel = "12hrs",
  titlePrimary,
  titleSecondary,
  viewMoreLabel = "VIEW MORE",
  viewMoreHref,
  onViewMore,
  disableViewMoreHover = false,
  expandCardOnHover = false,
  className = "",
  topImageSrc,
  bottomImageSrc,
}: CatalogShowcaseCardProps) {
  const [viewMoreHovered, setViewMoreHovered] = useState(false);
  const arabic = useArabicLayout();
  const arabicFeatured = arabic && expandCardOnHover;
  const [hoverOverlayPosition, setHoverOverlayPosition] = useState<{ left: number; top: number } | null>(null);
  const cardShellRef = useRef<HTMLDivElement | null>(null);
  const hideHoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncHoverOverlayToCard = useCallback(() => {
    const el = cardShellRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setHoverOverlayPosition({
      left: r.left,
      top: r.top + r.height / 2 - HOVER_EXPAND_CARD_H / 2,
    });
  }, []);

  const cancelHideHover = useCallback(() => {
    if (hideHoverTimeoutRef.current !== null) {
      clearTimeout(hideHoverTimeoutRef.current);
      hideHoverTimeoutRef.current = null;
    }
  }, []);

  const openHover = useCallback(() => {
    cancelHideHover();
    setViewMoreHovered(true);
  }, [cancelHideHover]);

  const scheduleHideHover = useCallback(() => {
    cancelHideHover();
    hideHoverTimeoutRef.current = setTimeout(() => {
      setViewMoreHovered(false);
      setHoverOverlayPosition(null);
      hideHoverTimeoutRef.current = null;
    }, 150);
  }, [cancelHideHover]);

  useLayoutEffect(() => {
    if (viewMoreHovered) syncHoverOverlayToCard();
  }, [viewMoreHovered, syncHoverOverlayToCard]);

  useEffect(() => {
    if (!viewMoreHovered) return;
    const onScrollOrResize = () => syncHoverOverlayToCard();
    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [viewMoreHovered, syncHoverOverlayToCard]);

  useEffect(() => () => cancelHideHover(), [cancelHideHover]);

  const resolvedViewMoreHref =
    viewMoreHref && showcaseSlug ? appendShowcaseToHref(viewMoreHref, showcaseSlug) : viewMoreHref;

  const isTrackLink = Boolean(viewMoreHref?.startsWith("/tracks/"));

  const shellClass = `relative overflow-visible rounded-[50px] ${expandCardOnHover ? "h-full w-full" : "w-[323px]"} ${viewMoreHovered ? "z-[99999]" : "z-[1]"} ${className}`.trim();

  const ctaHoverHandlers = disableViewMoreHover
    ? {}
    : {
        onMouseEnter: openHover,
        onMouseLeave: scheduleHideHover,
      };

  /** Track covers historically used `topImageSrc`; photo always renders in the lower panel. */
  const photoSrc = bottomImageSrc ?? topImageSrc;

  const ctaClassName = expandCardOnHover
    ? "pointer-events-auto absolute z-10 box-border flex items-center overflow-visible no-underline"
    : "pointer-events-auto absolute bottom-[26px] left-[38px] z-10 flex h-[43px] w-[166px] items-center rounded-[8px] border border-black bg-[#89F496] pl-4 pr-10 text-black no-underline transition-colors hover:bg-black hover:text-[#89F496]";

  const ctaStyle = expandCardOnHover
    ? arabicFeatured
      ? {
          bottom: 32,
          right: 29,
          display: "flex",
          width: 180,
          height: 50,
          padding: "0 15px",
          justifyContent: "flex-end",
          alignItems: "center",
          borderRadius: 23,
          border: "0.3px solid rgb(0 0 0 / 40%)",
          background: "var(--Green, #8AF396)",
        }
      : {
          bottom: 31,
          left: 27,
          width: 198,
          height: 50,
          padding: "0 16px",
          borderRadius: 23,
          border: "0.3px solid var(--Black, #000)",
          background: "var(--Green, #8AF396)",
        }
    : {
        fontFamily: pangeaFont,
        fontSize: "18px",
        fontWeight: 700,
        lineHeight: "19.6px",
      };

  const ctaInner = expandCardOnHover ? (
    arabicFeatured ? (
      <>
        <span
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 24,
            fontStyle: "normal",
            fontWeight: 500,
            fontVariationSettings: '"wght" 500',
            lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
          }}
        >
          عرض المزيد
        </span>
        <span
          className="pointer-events-none absolute top-1/2"
          style={{ right: 137, width: 50, height: 50, transform: "translateY(-50%)" }}
        >
          <span className="block h-full w-full" style={{ transform: "rotate(180deg)" }}>
            <FeaturedViewMoreCircle />
          </span>
        </span>
      </>
    ) : (
      <>
        <span
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: 24,
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
          }}
        >
          {viewMoreLabel}
        </span>
        <span className="absolute top-1/2 -translate-y-1/2" style={{ left: 154 }}>
          <FeaturedViewMoreCircle />
        </span>
      </>
    )
  ) : (
    <>
      {viewMoreLabel}
      <span className="absolute top-[20.5px] right-[7px] inline-flex -translate-y-1/2 translate-x-1/2 items-center justify-center">
        <ViewMoreCircleGlyph className="h-[43.5px] w-[43px]" />
      </span>
    </>
  );

  const titleClassName =
    "pointer-events-auto mt-[18px] block max-w-[270px] text-[32px] font-normal uppercase leading-normal text-black no-underline hover:opacity-90";

  const featuredTitleStyle = arabicFeatured
    ? {
        color: "var(--Black, #000)",
        fontFamily: pangeaFont,
        fontSize: 30,
        fontStyle: "normal",
        fontWeight: 400,
        fontVariationSettings: '"wght" 400',
        lineHeight: "normal",
        textAlign: "right" as const,
        right: 36,
        left: "auto",
        marginTop: 0,
        maxWidth: "calc(100% - 56px)",
      }
    : {
        color: "var(--Black, #000)",
        fontFamily: pangeaFont,
        fontSize: 24,
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        left: 36,
        marginTop: 0,
      };

  const titleInner = (
    <>
      {arabicFeatured ? (
        arabicShowcaseTitle(titlePrimary, titleSecondary)
      ) : (
        <>
          {titlePrimary}
          {titleSecondary ? (
            <>
              <br />
              {titleSecondary}
            </>
          ) : null}
        </>
      )}
      <span
        className="inline-flex h-[20px] w-[20px] align-middle"
        style={{ marginInlineStart: 8, ...(arabicFeatured ? { transform: "scaleX(-1)" } : {}) }}
      >
        <ExternalLinkGlyph className="h-[20px] w-[20px]" />
      </span>
    </>
  );

  return (
    <>
      <div
        ref={cardShellRef}
        dir="ltr"
        className={shellClass}
        style={{ height: SHOWCASE_CARD_H }}
        {...(showcaseSlug ? { "data-showcase-slug": showcaseSlug } : {})}
      >
        {/* Upper white text panel */}
        <div
          className={`absolute inset-x-0 top-0 z-1 overflow-hidden rounded-[50px] border border-black bg-white ${
            expandCardOnHover ? "featured-card-panel featured-card-upper border-solid" : "max-lg:border-black/20"
          }`}
          style={{
            ...(expandCardOnHover
              ? { background: "var(--White, #FFF)", borderRadius: 50 }
              : { height: SHOWCASE_TOP_H }),
          }}
          aria-hidden
        />

        {/* Lower photo panel — Figma 323×289.744 */}
        <div
          className={`absolute inset-x-0 z-2 overflow-hidden rounded-[50px] border border-black ${
            expandCardOnHover ? "featured-card-panel featured-card-photo border-solid" : "max-lg:border-black/20"
          } ${!expandCardOnHover && photoSrc ? "bg-white" : ""} ${!expandCardOnHover && !photoSrc ? "bg-[#E9E9E9]" : ""}`}
          style={{
            ...(expandCardOnHover
              ? {
                  bottom: 0,
                  borderRadius: 50,
                  backgroundColor: "lightgray",
                  backgroundImage: photoSrc ? `url(${JSON.stringify(photoSrc)})` : undefined,
                  backgroundPosition: "50%",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }
              : {
                  top: SHOWCASE_PHOTO_TOP,
                  height: SHOWCASE_PHOTO_H,
                }),
          }}
          aria-hidden
        >
          {photoSrc && !expandCardOnHover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoSrc} alt="" className="h-full w-full object-cover object-center" />
          ) : null}
        </div>

        <div className="pointer-events-none absolute inset-0 z-3">
          <div
            className={`absolute inset-x-0 top-0 pt-[28px] ${
              arabicFeatured ? "pr-[38px] pl-[30px]" : "pl-[38px] pr-[30px]"
            } ${expandCardOnHover ? "featured-rest-meta" : ""}`}
          >
            <div
              className={`pointer-events-auto flex items-center justify-between ${
                arabicFeatured ? "flex-row-reverse" : ""
              }`}
            >
              <span
                className={`inline-flex h-[36px] items-center justify-center border border-black px-4 ${
                  expandCardOnHover ? "rounded-[23px]" : "rounded-[8px]"
                } ${arabicFeatured ? "" : "text-[20px] leading-none text-black"}`}
                style={
                  arabicFeatured
                    ? {
                        backgroundColor: SHOWCASE_ACCENT,
                        color: "var(--Text-Primary, #141413)",
                        textAlign: "center",
                        fontFamily: pangeaFont,
                        fontSize: 16,
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontVariationSettings: '"wght" 400',
                        lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
                      }
                    : { backgroundColor: SHOWCASE_ACCENT }
                }
              >
                {arabicFeatured ? arabicLevelLabel(levelLabel) : levelLabel}
              </span>
              <span
                className={arabicFeatured ? undefined : "text-[18px] font-normal leading-normal text-black opacity-60"}
                style={
                  arabicFeatured
                    ? {
                        color: "var(--Black, #000)",
                        textAlign: "right",
                        fontFamily: pangeaFont,
                        fontSize: 16,
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontVariationSettings: '"wght" 400',
                        lineHeight: "normal",
                        opacity: 0.6,
                      }
                    : { fontFamily: pangeaFont }
                }
              >
                {arabicFeatured ? arabicDurationLabel(durationLabel) : durationLabel}
              </span>
            </div>

            {expandCardOnHover ? null : resolvedViewMoreHref ? (
              <Link
                href={resolvedViewMoreHref}
                className={titleClassName}
                style={{ fontFamily: pangeaFont }}
                aria-label={`Open ${titlePrimary}${titleSecondary ? ` ${titleSecondary}` : ""}`}
              >
                {titleInner}
              </Link>
            ) : (
              <div className={titleClassName} style={{ fontFamily: pangeaFont }}>
                {titleInner}
              </div>
            )}
          </div>

          {expandCardOnHover ? (
            resolvedViewMoreHref ? (
              <Link
                href={resolvedViewMoreHref}
                dir={arabicFeatured ? "rtl" : undefined}
                className={`${titleClassName} featured-card-title absolute ${arabicFeatured ? "normal-case" : ""}`}
                style={featuredTitleStyle}
                aria-label={`Open ${titlePrimary}${titleSecondary ? ` ${titleSecondary}` : ""}`}
              >
                {titleInner}
              </Link>
            ) : (
              <div
                dir={arabicFeatured ? "rtl" : undefined}
                className={`${titleClassName} featured-card-title absolute ${arabicFeatured ? "normal-case" : ""}`}
                style={featuredTitleStyle}
              >
                {titleInner}
              </div>
            )
          ) : null}

          {expandCardOnHover ? (
            <FeaturedHoverMeta levelLabel={levelLabel} durationLabel={durationLabel} />
          ) : null}

          {resolvedViewMoreHref ? (
            <Link
              href={resolvedViewMoreHref}
              className={ctaClassName}
              style={ctaStyle}
              aria-label={viewMoreLabel}
              onClick={(e) => {
                if (disableViewMoreHover) return;
                if (!viewMoreHovered && !isTrackLink) {
                  // Course cards: first tap opens expanded preview instead of navigating
                  e.preventDefault();
                  openHover();
                }
              }}
              {...ctaHoverHandlers}
            >
              {ctaInner}
            </Link>
          ) : (
            <button
              type="button"
              className={`${ctaClassName} cursor-pointer`}
              style={ctaStyle}
              onClick={onViewMore}
              suppressHydrationWarning
              {...ctaHoverHandlers}
            >
              {ctaInner}
            </button>
          )}
        </div>
      </div>

      {disableViewMoreHover ? null : (
      <CatalogShowcaseHoverCard
        visible={viewMoreHovered}
        position={hoverOverlayPosition}
        levelLabel={levelLabel}
        durationLabel={durationLabel}
        titlePrimary={titlePrimary}
        titleSecondary={titleSecondary}
        href={resolvedViewMoreHref}
        onHoverCardEnter={openHover}
        onHoverCardLeave={scheduleHideHover}
        onClose={scheduleHideHover}
      />
      )}
    </>
  );
}
