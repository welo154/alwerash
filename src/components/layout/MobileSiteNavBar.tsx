"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { SearchBar } from "./SearchBar";

const SEARCH_BAR_TOP = 3.8;
const SEARCH_BAR_HEIGHT = 38;
const SEARCH_ICON_SIZE = 23;
const MENU_ICON_HEIGHT = 19;
const MOBILE_LOGO = { width: 160, height: 47 } as const;
const MOBILE_SHELL_WIDTH = 382;

export function MobileSiteNavLogo({ homeHref = "/" }: { homeHref?: string }) {
  return (
    <Link
      href={homeHref}
      className="absolute left-[-16px] top-[-2px] z-40 block"
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
  outlinedSearch = false,
}: {
  outlinedSearch?: boolean;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSearchOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [searchOpen]);

  const searchIconSize = SEARCH_ICON_SIZE;
  // Inner pages (`outlinedSearch`): open state is from the screen edge, not the 382px shell.
  const searchIconRight = searchOpen
    ? outlinedSearch
      ? "calc(22px - (100vw - 382px) / 2)"
      : 17
    : 58;
  const searchBarRight = searchOpen
    ? outlinedSearch
      ? "calc(22px - (100vw - 382px) / 2 + 41px)"
      : 17 + searchIconSize + 4
    : 58 + searchIconSize + 4;
  const searchBarWidth = outlinedSearch ? 192 : 206;
  const searchIconTop = SEARCH_BAR_TOP + (SEARCH_BAR_HEIGHT - SEARCH_ICON_SIZE) / 2;
  const menuIconTop = SEARCH_BAR_TOP + (SEARCH_BAR_HEIGHT - MENU_ICON_HEIGHT) / 2;

  return (
    <div ref={actionsRef} className="pointer-events-none absolute inset-0 z-[80] overflow-visible">
      <div
        className="absolute z-[90] overflow-hidden"
        style={{
          top: SEARCH_BAR_TOP,
          right: searchBarRight,
          width: searchOpen ? searchBarWidth : 0,
          height: SEARCH_BAR_HEIGHT,
          minWidth: 0,
          pointerEvents: searchOpen ? "auto" : "none",
          transition: "width 300ms ease-out, right 300ms ease-out",
        }}
      >
        <div
          className="absolute top-0 right-0 h-[38px]"
          style={{ width: searchBarWidth }}
        >
          <SearchBar
            variant="mobileHeader"
            autoFocus={searchOpen}
            expanded={searchOpen}
            outlined={outlinedSearch}
          />
        </div>
      </div>
      <button
        type="button"
        aria-label={searchOpen ? "Close search" : "Search"}
        aria-expanded={searchOpen}
        onClick={() => setSearchOpen((open) => !open)}
        className="pointer-events-auto absolute z-[100] flex h-[23px] w-[23px] items-center justify-center"
        style={{
          top: searchIconTop,
          right: searchIconRight,
          transition: "right 300ms ease-out",
        }}
      >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
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
        aria-hidden={searchOpen}
        tabIndex={searchOpen ? -1 : undefined}
        onClick={() => {
          setSearchOpen(false);
          setMenuOpen(true);
        }}
        className="pointer-events-auto absolute z-[100] flex h-[19px] w-[28px] items-center justify-center"
        style={{
          top: menuIconTop,
          right: 11,
          visibility: searchOpen ? "hidden" : "visible",
          pointerEvents: searchOpen ? "none" : "auto",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="19"
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
      <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

/** Guest landing hero + inner pages — logo left, search + menu right (no green shell). */
export function MobileSiteNavBar({
  homeHref = "/",
  className,
}: {
  homeHref?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <div className="relative mx-auto" style={{ width: MOBILE_SHELL_WIDTH, height: MOBILE_LOGO.height }}>
        <MobileSiteNavLogo homeHref={homeHref} />
        <MobileSiteNavActions outlinedSearch />
      </div>
    </div>
  );
}
