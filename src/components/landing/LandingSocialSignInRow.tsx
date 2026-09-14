"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { buildOAuthCallbackUrl } from "@/components/auth/auth-oauth-icons";

const LANDING_SOCIAL_ICONS = [
  { label: "Google", providerId: "google", image: "/social/google.png", enabled: true },
  { label: "Apple", providerId: "apple", image: "/social/apple.png", enabled: false },
] as const;

const SIZE_PRESETS = {
  hero: { width: 46, height: 46, gap: 13 },
  mobileHero: { width: 26, height: 26, gap: 8 },
  tabletHero: { width: 44, height: 43, gap: 12 },
  cta: { width: 64, height: 64, gap: 18.5 },
  mobileCta: { width: 32, height: 32, gap: 10 },
  tabletCta: { width: 44, height: 43, gap: 12 },
} as const;

export function LandingSocialSignInRow({
  variant = "hero",
  className = "",
}: {
  variant?: keyof typeof SIZE_PRESETS;
  className?: string;
}) {
  const { width, height, gap } = SIZE_PRESETS[variant];
  const oauthCallbackUrl = buildOAuthCallbackUrl();

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {LANDING_SOCIAL_ICONS.map((item) => {
        const disabled = !item.enabled;
        return (
          <button
            key={item.label}
            type="button"
            aria-label={disabled ? `${item.label} (coming soon)` : item.label}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={
              disabled
                ? undefined
                : () => signIn(item.providerId, { callbackUrl: oauthCallbackUrl })
            }
            className={`shrink-0 border-none bg-transparent p-0 ${
              disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer transition-opacity hover:opacity-80"
            }`}
          >
            <Image
              src={item.image}
              alt=""
              width={width}
              height={height}
              className="block"
              style={{ width, height }}
              unoptimized
            />
          </button>
        );
      })}
    </div>
  );
}
