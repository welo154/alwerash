"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { buildOAuthCallbackUrl } from "@/components/auth/auth-oauth-icons";

const LANDING_SOCIAL_ICONS = [
  { label: "Google", providerId: "google", image: "/social/google.png", enabled: true },
  { label: "Apple", providerId: "apple", image: "/social/apple.png", enabled: false },
] as const;

const SIZE_PRESETS = {
  hero: { icon: 46, gap: 13 },
  cta: { icon: 64, gap: 18.5 },
} as const;

export function LandingSocialSignInRow({
  variant = "hero",
  className = "",
}: {
  variant?: keyof typeof SIZE_PRESETS;
  className?: string;
}) {
  const { icon, gap } = SIZE_PRESETS[variant];
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
              width={icon}
              height={icon}
              className="block"
              style={{ width: icon, height: icon }}
              unoptimized
            />
          </button>
        );
      })}
    </div>
  );
}
