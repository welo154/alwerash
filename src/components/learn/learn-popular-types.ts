/** Serializable props for popular Figma tiles (`167:1726`–`167:1738`) — RSC → client. */

export type LearnPopularTile = {
  id: string;
  href: string;
  title: string;
  authorLabel: string;
  /** Figma `167:1738` — primary tag (e.g. track name), uppercase in UI. */
  tagPrimary: string;
  coverImageSrc: string | null;
};
