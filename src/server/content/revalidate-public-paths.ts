import { revalidatePath } from "next/cache";

/** Call after track (or other catalog) mutations so `/`, courses, library, and events pick up changes. */
export function revalidatePublicCatalogPaths() {
  revalidatePath("/");
  revalidatePath("/learn");
  revalidatePath("/course");
  revalidatePath("/tracks");
  revalidatePath("/library");
  revalidatePath("/events");
}

/** Call after mentor create/update/delete so landing and directory pages refresh. */
export function revalidatePublicMentorPaths() {
  revalidatePath("/");
  revalidatePath("/home");
  revalidatePath("/mentors");
}
