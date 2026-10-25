import { formatCatalogDurationLabel } from "@/components/cards/catalog-showcase-map";

export type CourseLevelValue = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export function courseLevelLabel(level: string | null | undefined): string {
  if (level === "INTERMEDIATE") return "Intermediate";
  if (level === "ADVANCED") return "Advanced";
  return "Beginner";
}

export function courseCardStats(course: {
  totalDurationMinutes?: number | null;
  lessonCount?: number;
  modules?: { _count: { lessons: number } }[];
  level?: string | null;
}): { durationLabel: string; levelLabel: string } {
  const lessonCount =
    course.lessonCount ??
    course.modules?.reduce((total, module) => total + module._count.lessons, 0) ??
    0;
  const durationLabel = formatCatalogDurationLabel(course.totalDurationMinutes, lessonCount);
  return {
    durationLabel: durationLabel === "0m" ? null : durationLabel,
    levelLabel: courseLevelLabel(course.level),
  };
}
