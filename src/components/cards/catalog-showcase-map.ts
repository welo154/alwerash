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

/** One carousel tile on the landing catalog section (built on the server, rendered in a client section). */
export type LandingShowcaseSlide = { slug: string; cardProps: CatalogShowcaseCardProps };

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

/** Human-readable duration for catalog tiles (courses or aggregated track totals). */
export function formatCatalogDurationLabel(totalMinutes: number | null | undefined, lessonCount: number): string {
  const mins = totalMinutes ?? lessonCount * 15;
  if (mins <= 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  return `${m}m`;
}

/** Uppercase two-line title split from a track name (same visual rhythm as course-based tiles). */
export function catalogShowcaseTitlesFromTrackTitle(trackTitle: string): {
  titlePrimary: string;
  titleSecondary?: string;
} {
  const words = trackTitle.trim().split(/\s+/).filter(Boolean);
  const titlePrimary = (words[0] ?? "TRACK").toUpperCase();
  const rest = words.slice(1).join(" ").trim();
  const titleSecondary = rest.length > 0 ? rest.toUpperCase() : undefined;
  return { titlePrimary, titleSecondary };
}

export type CatalogShowcaseTrackCourseSlice = {
  totalDurationMinutes?: number | null;
  lessonCount: number;
};

/** Card props for a published track (aggregated course duration / lesson counts). */
export function catalogShowcasePropsFromTrackAggregate(input: {
  title: string;
  slug: string;
  schoolTitle?: string | null;
  courses: CatalogShowcaseTrackCourseSlice[];
}): CatalogShowcaseCardProps {
  let totalMins = 0;
  let lessonCount = 0;
  for (const c of input.courses) {
    lessonCount += c.lessonCount;
    totalMins += c.totalDurationMinutes ?? 0;
  }

  const { titlePrimary, titleSecondary } = catalogShowcaseTitlesFromTrackTitle(input.title);
  const schoolTitle = input.schoolTitle?.trim();
  const levelLabel = schoolTitle && schoolTitle.length > 0 ? schoolTitle : "Beginner";
  const durationLabel =
    totalMins > 0 || lessonCount > 0
      ? formatCatalogDurationLabel(totalMins > 0 ? totalMins : null, lessonCount)
      : "—";

  return {
    titlePrimary,
    titleSecondary,
    levelLabel,
    durationLabel,
    viewMoreHref: `/tracks/${encodeURIComponent(input.slug)}`,
  };
}

/** Split track titles into two pill rows (order matches `publicListTracks` / admin order). */
export function splitTitlesIntoTwoTagRows(titles: string[]): [string[], string[]] {
  if (titles.length === 0) return [[], []];
  const labels = titles.map((t) => {
    const u = t.trim().toUpperCase();
    return u.length > 0 ? u : "TRACK";
  });
  const mid = Math.ceil(labels.length / 2);
  return [labels.slice(0, mid), labels.slice(mid)];
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
    durationLabel: formatCatalogDurationLabel(course.totalDurationMinutes, course.lessonCount ?? 0),
    titlePrimary,
    titleSecondary,
    viewMoreHref: options?.onOpenModal ? undefined : `/courses/${course.id}`,
    onViewMore: options?.onOpenModal,
  };
}
