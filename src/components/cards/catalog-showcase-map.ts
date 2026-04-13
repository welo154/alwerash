export type CatalogShowcaseCardProps = {
  /** URL-safe id for this tile (`data-showcase-slug`, optional `showcase=` on links). */
  showcaseSlug?: string;
  levelLabel?: string;
  durationLabel?: string;
  titlePrimary: string;
  titleSecondary?: string;
  viewMoreLabel?: string;
  viewMoreHref?: string;
  onViewMore?: () => void;
  className?: string;
};

/** Appends or sets `showcase=<slug>` on a relative href (preserves hash). */
export function appendShowcaseToHref(href: string, showcaseSlug: string): string {
  const hashIdx = href.indexOf("#");
  const pathPart = hashIdx === -1 ? href : href.slice(0, hashIdx);
  const hashPart = hashIdx === -1 ? "" : href.slice(hashIdx);

  const qIdx = pathPart.indexOf("?");
  const base = qIdx === -1 ? pathPart : pathPart.slice(0, qIdx);
  const existing = qIdx === -1 ? "" : pathPart.slice(qIdx + 1);
  const params = new URLSearchParams(existing);
  params.set("showcase", showcaseSlug);
  const q = params.toString();
  return `${base}?${q}${hashPart}`;
}

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
