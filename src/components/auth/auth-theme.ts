/** Shared auth page tokens (Figma AlWerash). */
export { pangeaFontFamily as pangeaFont, pangeaVar } from "@/lib/fonts/pangea";

export const AUTH_PANEL_GREEN = "#89F496";
export const AUTH_PAGE_PADDING = "50px 80px 48px 84px";
export const AUTH_MAX_WIDTH = 1600;
export const AUTH_GREEN_PANEL = {
  width: 790,
  height: 966,
  borderRadius: 50,
  padding: "136px 94px 71px 92px",
} as const;

export const AUTH_SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", image: "/auth/social/instagram.png" },
  { href: "https://linkedin.com", label: "LinkedIn", image: "/auth/social/linkedin.png" },
  { href: "https://x.com", label: "X", image: "/auth/social/x.png" },
] as const;
