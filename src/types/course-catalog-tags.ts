/** Learn catalog filter tags — toggled per course in admin. */
export const COURSE_CATALOG_TAGS = [
  { key: "tagGuided", label: "Guided courses" },
  { key: "tagDeepDive", label: "Deep dive" },
  { key: "tagBasics", label: "Basics" },
  { key: "tagNew", label: "New courses" },
  { key: "tagTopRated", label: "Top rated" },
] as const;

export type CourseCatalogTagKey = (typeof COURSE_CATALOG_TAGS)[number]["key"];

export type CourseCatalogTagState = Record<CourseCatalogTagKey, boolean>;

export const DEFAULT_COURSE_CATALOG_TAG_STATE: CourseCatalogTagState = {
  tagGuided: false,
  tagDeepDive: false,
  tagBasics: false,
  tagNew: false,
  tagTopRated: false,
};
