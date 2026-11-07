import { revalidatePath, revalidateTag } from "next/cache";

export const PUBLIC_CATALOG_CACHE_TAG = "public-catalog";

/** Admin edits must show on public pages right away, not after a stale render. */
const IMMEDIATELY = { expire: 0 };

/** Call after track (or other catalog) mutations so `/`, courses, library, and events pick up changes. */
export function revalidatePublicCatalogPaths() {
  revalidateTag(PUBLIC_CATALOG_CACHE_TAG, IMMEDIATELY);
  revalidatePath("/");
  revalidatePath("/course");
  revalidatePath("/course-access");
  revalidatePath("/tracks");
  revalidatePath("/library");
  revalidatePath("/events");
}

/** Call after a student story changes so every “Why students love” section refreshes. */
export function revalidateStudentStoryPaths() {
  revalidateTag(PUBLIC_CATALOG_CACHE_TAG, IMMEDIATELY);
  revalidatePath("/");
  revalidatePath("/home");
  revalidatePath("/course/[courseId]", "page");
  revalidatePath("/library/books/[id]", "page");
}

/** Call after mentor create/update/delete so landing and directory pages refresh. */
export function revalidatePublicMentorPaths() {
  revalidateTag(PUBLIC_CATALOG_CACHE_TAG, IMMEDIATELY);
  revalidatePath("/");
  revalidatePath("/home");
  revalidatePath("/mentors");
}
