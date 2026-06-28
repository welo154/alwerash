import type { LandingShowcaseSlide } from "@/components/cards/catalog-showcase-map";

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
  slidesByFilter: Record<HomeTrackMetaFilter, LandingShowcaseSlide[]>;
};
