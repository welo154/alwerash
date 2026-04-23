/** Drives “THE CURRENT MOSTS” mentor cards (shared by RSC + client components). */

export type LandingMostsMentorCardDto = {
  id: string;
  variant: "popular" | "watched";
  /** Display name (uppercased for the card). */
  name: string;
  /** Shown under the name — from `certificateName` or a short default. */
  profession: string;
};
