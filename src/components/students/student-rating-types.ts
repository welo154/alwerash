export type StudentRatingCard = {
  quote: string;
  initials: string;
  name: string;
  role: string;
  /** Submitted project. Empty until an admin uploads one. */
  projectImage?: string | null;
};
