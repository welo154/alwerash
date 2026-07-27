import { formatCatalogDurationLabel } from "@/components/cards/catalog-showcase-map";

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
  }
  return (parts[0]?.slice(0, 2) ?? "??").toUpperCase();
}

export function formatCourseRatingLabel(rating: number | null | undefined): string {
  if (rating == null) return "98%";
  if (rating <= 1) return `${Math.round(rating * 100)}%`;
  return `${Math.round((rating / 5) * 100)}%`;
}

export function formatCourseDurationLabel(
  totalDurationMinutes: number | null | undefined,
  lessonCount: number
): string {
  return formatCatalogDurationLabel(totalDurationMinutes, lessonCount);
}

export function formatUpdatedMonthYear(date: Date): string {
  return `Last Updated ${date.getMonth() + 1}/${date.getFullYear()}`;
}
