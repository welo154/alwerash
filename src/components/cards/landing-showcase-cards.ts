/**
 * Stable slugs for each landing catalog carousel card — import on `/learn` or
 * elsewhere to sync filters, deep links, or analytics to a specific tile.
 */
export const LANDING_SHOWCASE_CAROUSEL_SLUGS = [
  "digital-illustration",
  "drawing-painting",
  "animation",
  "ui-ux-design",
  "creative-writing",
  "film-video",
  "crafts",
  "graphic-design",
] as const;

export type LandingShowcaseCarouselSlug = (typeof LANDING_SHOWCASE_CAROUSEL_SLUGS)[number];

export type LandingShowcaseCarouselCard = {
  slug: LandingShowcaseCarouselSlug;
  titlePrimary: string;
  titleSecondary?: string;
};

export const LANDING_SHOWCASE_CAROUSEL_CARDS: readonly LandingShowcaseCarouselCard[] = [
  { slug: "digital-illustration", titlePrimary: "DIGITAL", titleSecondary: "ILLUSTRATION" },
  { slug: "drawing-painting", titlePrimary: "DRAWING", titleSecondary: "& PAINTING" },
  { slug: "animation", titlePrimary: "ANIMATION" },
  { slug: "ui-ux-design", titlePrimary: "UI/UX", titleSecondary: "DESIGN" },
  { slug: "creative-writing", titlePrimary: "CREATIVE", titleSecondary: "WRITING" },
  { slug: "film-video", titlePrimary: "FILM", titleSecondary: "& VIDEO" },
  { slug: "crafts", titlePrimary: "CRAFTS" },
  { slug: "graphic-design", titlePrimary: "GRAPHIC", titleSecondary: "DESIGN" },
];
