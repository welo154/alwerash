import { revalidatePath } from "next/cache";

/** Call after track (or other catalog) mutations so `/`, `/learn`, and library pick up changes. */
export function revalidatePublicCatalogPaths() {
  revalidatePath("/");
  revalidatePath("/learn");
  revalidatePath("/tracks");
}

/** Call after mentor create/update/delete so landing and directory pages refresh. */
export function revalidatePublicMentorPaths() {
  revalidatePath("/");
  revalidatePath("/home");
  revalidatePath("/mentors");
}
