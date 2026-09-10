import { revalidatePath, revalidateTag } from "next/cache";

export const PUBLIC_CATALOG_CACHE_TAG = "public-catalog";

/** Call after track (or other catalog) mutations so `/`, courses, library, and events pick up changes. */
export function revalidatePublicCatalogPaths() {
  revalidateTag(PUBLIC_CATALOG_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/course");
  revalidatePath("/course-access");
  revalidatePath("/tracks");
  revalidatePath("/library");
  revalidatePath("/events");
}

/** Call after mentor create/update/delete so landing and directory pages refresh. */
export function revalidatePublicMentorPaths() {
  revalidateTag(PUBLIC_CATALOG_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/home");
  revalidatePath("/mentors");
}
