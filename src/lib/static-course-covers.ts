/** Static cover images keyed by normalized course title (lowercase, trimmed). */
const STATIC_COURSE_COVERS: Record<string, string> = {
  "ai automation": "/learn/ai-automation-course-cover.png",
  "figma fundamentals": "/learn/figma-course-cover.png",
  "prototyping in figma": "/learn/figma-course-cover.png",
};

export function staticCourseCoverForTitle(title: string): string | null {
  const key = title.trim().toLowerCase();
  return STATIC_COURSE_COVERS[key] ?? null;
}
