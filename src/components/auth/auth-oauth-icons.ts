export const AUTH_OAUTH_ICONS = [
  { label: "Google", providerId: "google", image: "/auth/social/google.png", enabled: true },
  { label: "Apple", providerId: "apple", image: "/auth/social/apple.png", enabled: false },
] as const;

export function buildOAuthCallbackUrl(nextPath?: string | null): string {
  if (nextPath?.startsWith("/")) {
    return `/auth/continue?next=${encodeURIComponent(nextPath)}`;
  }
  return "/auth/continue";
}
