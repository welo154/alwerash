export type CatalogShowcaseCardProps = {
  levelLabel?: string;
  durationLabel?: string;
  titlePrimary: string;
  titleSecondary?: string;
  viewMoreLabel?: string;
  viewMoreHref?: string;
  onViewMore?: () => void;
  className?: string;
};

export type CatalogShowcaseCourseSource = {
  id: string;
  title: string;
  lessonCount?: number;
  totalDurationMinutes?: number | null;
  track?: { title: string; slug?: string } | null;
};

export type CatalogShowcaseFromCourseOptions = {
  levelLabel?: string;
  onOpenModal?: () => void;
};

function durationLabelFromCourse(totalMinutes: number | null | undefined, lessonCount: number): string {
  const mins = totalMinutes ?? lessonCount * 15;
  if (mins <= 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  return `${m}m`;
}

/** Maps API / modal course data into CatalogShowcaseCard props. */
export function catalogShowcasePropsFromCourse(
  course: CatalogShowcaseCourseSource,
  options?: CatalogShowcaseFromCourseOptions
): CatalogShowcaseCardProps {
  const words = course.title.trim().split(/\s+/).filter(Boolean);
  const titlePrimary = (words[0] ?? "Course").toUpperCase();
  const fromTitle = words.slice(1).join(" ").trim();
  const fromTrack = course.track?.title?.trim() ?? "";
  const secondaryRaw = (fromTitle || fromTrack).toUpperCase();
  const titleSecondary = secondaryRaw.length > 0 ? secondaryRaw : undefined;

  return {
    levelLabel: options?.levelLabel ?? "Beginner",
    durationLabel: durationLabelFromCourse(course.totalDurationMinutes, course.lessonCount ?? 0),
    titlePrimary,
    titleSecondary,
    viewMoreHref: options?.onOpenModal ? undefined : `/courses/${course.id}`,
    onViewMore: options?.onOpenModal,
  };
}
