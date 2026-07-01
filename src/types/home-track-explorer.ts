import type { LandingShowcaseSlide } from "@/components/cards/catalog-showcase-map";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";

export type HomeTrackMetaFilter = "featured" | "topRated" | "activity";

export type HomeTrackPill = {
  slug: string;
  title: string;
  label: string;
};

export type HomeTrackExplorerBundle = {
  heroTracks: { id: string; title: string; slug: string }[];
  trackPills: HomeTrackPill[];
  trackPillRow1: HomeTrackPill[];
  trackPillRow2: HomeTrackPill[];
  /** Track cards per meta filter (legacy carousel). */
  slidesByFilter: Record<HomeTrackMetaFilter, LandingShowcaseSlide[]>;
  /** Course tiles keyed by track slug (guest landing track-pill selection). */
  courseTilesByTrackSlug: Record<string, LearnPopularTile[]>;
};
