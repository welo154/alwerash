export type LearnAllCourseItem = {
  id: string;
  href: string;
  title: string;
  titleAr?: string | null;
  authorLabel: string;
  authorLabelAr?: string | null;
  tagPrimary: string;
  typeLabel?: string | null;
  coverImageSrc: string | null;
  trackSlug: string | null;
  rating: number | null;
  lessonCount: number;
  totalDurationMinutes: number | null;
};

export type LearnCourseTrackOption = {
  slug: string;
  title: string;
};

export type LearnCourseTypeFilter = "all" | "topRated" | "deepDive";
