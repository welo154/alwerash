import type { LearnCourseTypeFilter } from "@/components/learn/learn-all-courses-types";

export type CourseFilterAction = {
  type?: LearnCourseTypeFilter;
  scrollTargetId?: string;
};

export const COURSE_FILTER_ACTIONS: Record<string, CourseFilterAction> = {
  "All Couses": { type: "all", scrollTargetId: "all-courses" },
  "Top Rated": { type: "topRated", scrollTargetId: "all-courses" },
  "Deep Dive": { type: "deepDive", scrollTargetId: "all-courses" },
  "Popular Courses": { scrollTargetId: "popular-classes" },
};
