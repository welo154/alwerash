"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileNavDrawer } from "./MobileNavDrawer";

const MOBILE_LOGO = { width: 160, height: 47 } as const;
const MOBILE_SHELL_WIDTH = 382;

export function MobileSiteNavLogo({ homeHref = "/" }: { homeHref?: string }) {
  return (
    <Link
      href={homeHref}
      className="absolute left-[-16px] top-0 z-40 block"
      style={{
        width: MOBILE_LOGO.width,
        height: MOBILE_LOGO.height,
        aspectRatio: "99 / 29",
      }}
      aria-label="Go to home"
    >
      <Image
        src="/brand/alwerash-logo-hero.png"
        alt="Alwerash"
        width={MOBILE_LOGO.width}
        height={MOBILE_LOGO.height}
        className="block h-[47px] w-[160px] max-w-none object-contain"
        style={{ aspectRatio: "99 / 29" }}
        unoptimized
        priority
      />
    </Link>
  );
}

export function MobileSiteNavActions({
  onOpenMenu,
  menuOpen,
}: {
  onOpenMenu: () => void;
  menuOpen: boolean;
}) {
  return (
    <div className="absolute right-[22px] top-[14px] z-40 flex items-center">
      <button type="button" aria-label="Search" className="flex h-[19px] w-[19px] items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          viewBox="0 0 21 21"
          fill="none"
          aria-hidden
        >
          <path
            d="M19.75 19.75L15.1583 15.1583M17.6389 9.19444C17.6389 13.8582 13.8582 17.6389 9.19444 17.6389C4.53071 17.6389 0.75 13.8582 0.75 9.19444C0.75 4.53071 4.53071 0.75 9.19444 0.75C13.8582 0.75 17.6389 4.53071 17.6389 9.19444Z"
            stroke="#1E1E1E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-drawer"
        onClick={onOpenMenu}
        className="ml-[8px] flex h-[15px] w-[23px] items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="15"
          viewBox="0 0 25 17"
          fill="none"
          aria-hidden
        >
          <path
            d="M23.75 5.75H0.75M23.75 0.75H0.75M23.75 10.75H0.75M23.75 15.75H0.75"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

/** Guest landing hero + inner pages — logo left, search + menu right (no green shell). */
export function MobileSiteNavBar({
  homeHref = "/",
  className,
  user,
}: {
  homeHref?: string;
  className?: string;
  user?: { name?: string | null; email?: string | null } | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`relative mx-auto w-full max-w-[393px] ${className ?? ""}`}>
      <div className="relative mx-auto" style={{ width: MOBILE_SHELL_WIDTH, height: MOBILE_LOGO.height }}>
        <MobileSiteNavLogo homeHref={homeHref} />
      </div>
      <MobileSiteNavActions onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} user={user ?? null} />
    </div>
  );
}
