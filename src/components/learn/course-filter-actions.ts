import type { LearnCourseTypeFilter } from "@/components/learn/learn-all-courses-types";

export type CourseFilterAction = {
  type?: LearnCourseTypeFilter;
  scrollTargetId?: string;
};

export const COURSE_FILTER_ACTIONS: Record<string, CourseFilterAction> = {
  "All Courses": { type: "all", scrollTargetId: "all-courses" },
  "Deep Dive": { type: "deepDive", scrollTargetId: "all-courses" },
  Basics: { scrollTargetId: "all-courses" },
  "Popular Classes": { scrollTargetId: "popular-classes" },
};
