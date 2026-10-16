/** One course-type chip per card. Catalog tags win, then featured placement. */
export function courseTypeBadgeLabel(course: {
  tagNew?: boolean | null;
  tagTopRated?: boolean | null;
  tagDeepDive?: boolean | null;
  tagBasics?: boolean | null;
  tagGuided?: boolean | null;
  featuredMostPlayedOrder?: number | null;
  featuredTrendingOrder?: number | null;
}): string | null {
  if (course.tagNew) return "New";
  if (course.tagTopRated) return "Best seller";
  if (course.featuredMostPlayedOrder != null) return "Most viewed";
  if (course.tagDeepDive) return "Deep dive";
  if (course.tagBasics) return "Basics";
  if (course.tagGuided) return "Guided";
  if (course.featuredTrendingOrder != null) return "Trending";
  return null;
}

export const courseTypeBadgeSelect = {
  tagGuided: true,
  tagDeepDive: true,
  tagBasics: true,
  tagNew: true,
  tagTopRated: true,
  featuredMostPlayedOrder: true,
  featuredTrendingOrder: true,
} as const;
