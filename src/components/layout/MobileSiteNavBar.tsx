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
const TABLET_LOGO = { width: 135 * 1.6, height: 41 * 1.6 } as const;
const TABLET_NAV_WIDTH = 732;
const TABLET_LOGO_TOP = 3;
const MOBILE_SHELL_WIDTH = 382;
const TABLET_SEARCH_ICON = 26;
/** 31px from the page top; header itself is 7px from the page. */
const TABLET_SEARCH_TOP = 31 - 7;
const TABLET_SEARCH_RIGHT = 74;
const TABLET_SEARCH_OPEN_RIGHT = 28;
const TABLET_SEARCH_BAR = { width: 491, height: 66 } as const;
const TABLET_SEARCH_BAR_GAP = 10;
const TABLET_MENU_GAP = 21;
const TABLET_MENU = { width: 31, height: 21 } as const;
const TABLET_MENU_RIGHT = TABLET_SEARCH_RIGHT - TABLET_MENU_GAP - TABLET_MENU.width;

export function MobileSiteNavLogo({
  homeHref = "/",
  variant = "mobile",
}: {
  homeHref?: string;
  variant?: "mobile" | "tablet";
}) {
  const isTablet = variant === "tablet";
  const size = isTablet ? TABLET_LOGO : MOBILE_LOGO;

  return (
    <Link
      href={homeHref}
      className={
        isTablet
          ? "absolute left-[7px] top-[3px] z-40 block"
          : "absolute left-[-16px] top-[-2px] z-40 block"
      }
      style={{
        width: size.width,
        height: size.height,
        aspectRatio: "99 / 29",
      }}
      aria-label="Go to home"
    >
      <Image
        src="/brand/alwerash-logo-hero.png"
        alt="Alwerash"
        width={size.width}
        height={size.height}
        className={`block h-full w-full max-w-none object-contain ${
          isTablet ? "object-left" : ""
        }`}
        style={{ aspectRatio: "99 / 29" }}
        unoptimized
        priority
      />
    </Link>
  );
}

export function MobileSiteNavActions({
  outlinedSearch = false,
  variant = "mobile",
}: {
  outlinedSearch?: boolean;
  variant?: "mobile" | "tablet";
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

  const isTablet = variant === "tablet";
  const searchIconSize = isTablet ? TABLET_SEARCH_ICON : SEARCH_ICON_SIZE;
  const searchIconClosedRight = isTablet ? TABLET_SEARCH_RIGHT : 58;
  const searchIconOpenRight = isTablet
    ? TABLET_SEARCH_OPEN_RIGHT
    : outlinedSearch
      ? "calc(22px - (100vw - 382px) / 2)"
      : 17;
  const searchIconRight = searchOpen ? searchIconOpenRight : searchIconClosedRight;
  const tabletBarRight = TABLET_SEARCH_OPEN_RIGHT + searchIconSize + TABLET_SEARCH_BAR_GAP;
  const searchBarRight = searchOpen
    ? isTablet
      ? tabletBarRight
      : outlinedSearch
        ? "calc(22px - (100vw - 382px) / 2 + 41px)"
        : 17 + searchIconSize + 4
    : searchIconClosedRight + searchIconSize + 4;
  const searchBarWidth = isTablet
    ? TABLET_SEARCH_BAR.width
    : outlinedSearch
      ? 192
      : 206;
  const searchBarHeight = isTablet ? TABLET_SEARCH_BAR.height : SEARCH_BAR_HEIGHT;
  const searchBarTop = isTablet
    ? TABLET_SEARCH_TOP + (TABLET_SEARCH_ICON - TABLET_SEARCH_BAR.height) / 2 - 1
    : SEARCH_BAR_TOP;
  const searchIconTop = isTablet
    ? TABLET_SEARCH_TOP
    : SEARCH_BAR_TOP + (SEARCH_BAR_HEIGHT - SEARCH_ICON_SIZE) / 2;
  const menuIconTop = isTablet
    ? TABLET_SEARCH_TOP + (TABLET_SEARCH_ICON - TABLET_MENU.height) / 2
    : SEARCH_BAR_TOP + (SEARCH_BAR_HEIGHT - MENU_ICON_HEIGHT) / 2;

  return (
    <div ref={actionsRef} className="pointer-events-none absolute inset-0 z-[80] overflow-visible">
      <div
        className="absolute z-[90] overflow-hidden"
        style={{
          top: searchBarTop,
          right: searchBarRight,
          width: searchOpen ? searchBarWidth : 0,
          height: searchBarHeight,
          minWidth: 0,
          pointerEvents: searchOpen ? "auto" : "none",
          transition: "width 300ms ease-out, right 300ms ease-out",
        }}
      >
        <div
          className="absolute top-0 right-0"
          style={{ width: searchBarWidth, height: searchBarHeight }}
        >
          <SearchBar
            variant="mobileHeader"
            layout={isTablet ? "tablet" : "mobile"}
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
        className={`pointer-events-auto absolute z-[100] flex items-center justify-center ${
          isTablet ? "h-[26px] w-[26px]" : "h-[23px] w-[23px]"
        }`}
        style={{
          top: searchIconTop,
          right: searchIconRight,
          transition: "right 300ms ease-out",
        }}
      >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={isTablet ? 26 : 23}
              height={isTablet ? 26 : 23}
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
        className={`pointer-events-auto absolute z-[100] flex items-center justify-center ${
          isTablet ? "h-[21px] w-[31px]" : "h-[19px] w-[28px]"
        }`}
        style={{
          top: menuIconTop,
          right: isTablet ? TABLET_MENU_RIGHT : 11,
          visibility: searchOpen ? "hidden" : "visible",
          pointerEvents: searchOpen ? "none" : "auto",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={isTablet ? 31 : 28}
          height={isTablet ? 21 : 19}
          viewBox="0 0 25 17"
          fill="none"
          aria-hidden
        >
          <path
            d="M23.75 5.75H0.75M23.75 0.75H0.75M23.75 10.75H0.75M23.75 15.75H0.75"
            stroke="var(--Black, #000)"
            strokeWidth={isTablet ? 2 : 1.5}
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
      <div
        className="relative mx-auto min-[744px]:hidden"
        style={{ width: MOBILE_SHELL_WIDTH, height: MOBILE_LOGO.height }}
      >
        <MobileSiteNavLogo homeHref={homeHref} />
        <MobileSiteNavActions outlinedSearch />
      </div>
      <div
        className="relative mx-auto hidden min-[744px]:block"
        style={{
          width: TABLET_NAV_WIDTH,
          height: TABLET_LOGO_TOP + TABLET_LOGO.height,
        }}
      >
        <MobileSiteNavLogo homeHref={homeHref} variant="tablet" />
        <MobileSiteNavActions variant="tablet" />
      </div>
    </div>
  );
}
