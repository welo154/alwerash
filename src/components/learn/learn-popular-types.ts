/** Serializable props for popular Figma tiles (`167:1726`–`167:1738`) — RSC → client. */

export type LearnPopularTile = {
  id: string;
  href: string;
  title: string;
  titleAr?: string | null;
  authorLabel: string;
  authorLabelAr?: string | null;
  /** Figma `167:1738` — primary tag (e.g. track name), uppercase in UI. */
  tagPrimary: string;
  /** Course-type chip: New, Best seller, Most viewed, and so on. */
  typeLabel?: string | null;
  coverImageSrc: string | null;
  /** Learner completion % (0–100); when set, shown instead of placeholder rating. */
  progressPercent?: number | null;
};
