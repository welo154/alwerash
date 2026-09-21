"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOutToHome } from "@/lib/auth/signOutToHome";
import { useToast } from "@/components/Toast";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;
const MOBILE_LOGO = { width: 160, height: 47 } as const;
const TABLET_LOGO = { width: 135 * 1.6, height: 41 * 1.6 } as const;
const TABLET_NAV_WIDTH = 732;
const TABLET_LOGO_TOP = 3;
const TABLET_SEARCH_ICON = 26;
const TABLET_SEARCH_TOP = 31 - 7;
const TABLET_SEARCH_RIGHT = 74;
const MOBILE_SEARCH_ICON = 23;

const MAX_COLUMN_ITEMS = 8;
const HIDDEN_TRACK_HREFS = new Set([
  "/tracks/graphic-design",
  "/tracks/motion-design",
  "/tracks/design-softwares",
]);

type CoursesMenuLink = { label: string; href: string };
type CoursesMenuPayload = {
  allCourses: CoursesMenuLink[];
  software: CoursesMenuLink[];
};

const PRIMARY_LINK = {
  color: "#000",
  fontFamily: pangeaFont,
  fontSize: 32,
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "150%",
};

const TABLET_PRIMARY_LINK = {
  ...PRIMARY_LINK,
  fontSize: 40,
};

const GUEST_AUTH_LINK = {
  color: "#000",
  fontFamily: pangeaFont,
  fontSize: 32,
  fontStyle: "normal" as const,
  fontWeight: 700,
  lineHeight: "150%",
};

const TABLET_GUEST_AUTH_LINK = {
  ...GUEST_AUTH_LINK,
  fontSize: 40,
};

const SECONDARY_LINK = {
  color: "#000",
  fontFamily: pangeaFont,
  fontSize: 24,
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "150%",
};

const TABLET_SECONDARY_LINK = {
  ...SECONDARY_LINK,
  fontSize: 32,
};

const NESTED_LINK = {
  color: "#000",
  fontFamily: pangeaFont,
  fontSize: 20,
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "140%",
};

const TABLET_NESTED_LINK = {
  ...NESTED_LINK,
  fontSize: 28,
};

function visibleLinks(items: CoursesMenuLink[]) {
  return items
    .filter((item) => !HIDDEN_TRACK_HREFS.has(item.href))
    .slice(0, MAX_COLUMN_ITEMS);
}

function MenuLink({
  href,
  children,
  onClose,
  style,
  className,
}: {
  href: string;
  children: string;
  onClose: () => void;
  style: CSSProperties;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`block whitespace-nowrap text-black ${className ?? ""}`}
      style={style}
    >
      {children}
    </Link>
  );
}

function MenuAction({
  children,
  onClick,
  style,
}: {
  children: string;
  onClick: () => void;
  style: CSSProperties;
}) {
  return (
    <button type="button" onClick={onClick} className="block w-full text-left text-black" style={style}>
      {children}
    </button>
  );
}

export function MobileNavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const toast = useToast();
  const isGuest = !session?.user;
  const onLibrary = pathname === "/library" || pathname.startsWith("/library/");
  const [mounted, setMounted] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [menu, setMenu] = useState<CoursesMenuPayload | null>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 744px)");
    const apply = () => setIsTablet(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!open) {
      setCoursesOpen(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !coursesOpen || menu) return;
    let cancelled = false;
    void fetch("/api/catalog/courses-menu", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as CoursesMenuPayload;
        if (!Array.isArray(data.allCourses) || !Array.isArray(data.software)) {
          return null;
        }
        return data;
      })
      .then((next) => {
        if (!cancelled && next) setMenu(next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, coursesOpen, menu]);

  if (!mounted) return null;

  const primaryLink = isTablet ? TABLET_PRIMARY_LINK : PRIMARY_LINK;
  const guestAuthLink = isTablet ? TABLET_GUEST_AUTH_LINK : GUEST_AUTH_LINK;
  const secondaryLink = isTablet ? TABLET_SECONDARY_LINK : SECONDARY_LINK;
  const nestedLink = isTablet ? TABLET_NESTED_LINK : NESTED_LINK;
  const homeHref = isGuest ? "/" : "/home";
  const allCourses = visibleLinks(menu?.allCourses ?? []);
  const software = visibleLinks(menu?.software ?? []);

  return createPortal(
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      id="mobile-nav-drawer"
      aria-hidden={!open}
      inert={!open ? true : undefined}
      className={`fixed inset-0 z-[110] overflow-y-auto bg-white lg:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        fontFamily: pangeaFont,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 320ms ease-out",
      }}
    >
      <div className="relative w-full pt-[37px] min-[744px]:pt-[7px]">
        <div className="relative mx-auto h-[47px] w-[382px] max-w-full min-[744px]:hidden">
          <Link
            href={homeHref}
            onClick={onClose}
            className="absolute left-[-16px] top-[-2px] z-40 block"
            style={{ width: MOBILE_LOGO.width, height: MOBILE_LOGO.height, aspectRatio: "99 / 29" }}
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
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="absolute right-[24px] top-0 flex h-[47px] w-[23px] items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={MOBILE_SEARCH_ICON}
              height={MOBILE_SEARCH_ICON}
              viewBox="0 0 21 21"
              fill="none"
              aria-hidden
            >
              <path
                d="M20 1L1 20M1 1L20 20"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div
          className="relative mx-auto hidden min-[744px]:block"
          style={{
            width: TABLET_NAV_WIDTH,
            height: TABLET_LOGO_TOP + TABLET_LOGO.height,
          }}
        >
          <Link
            href={homeHref}
            onClick={onClose}
            className="absolute left-[7px] top-[3px] z-40 block"
            style={{ width: TABLET_LOGO.width, height: TABLET_LOGO.height, aspectRatio: "99 / 29" }}
            aria-label="Go to home"
          >
            <Image
              src="/brand/alwerash-logo-hero.png"
              alt="Alwerash"
              width={TABLET_LOGO.width}
              height={TABLET_LOGO.height}
              className="block h-full w-full max-w-none object-contain object-left"
              style={{ aspectRatio: "99 / 29" }}
              unoptimized
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="absolute z-[100] flex h-[26px] w-[26px] items-center justify-center"
            style={{ top: TABLET_SEARCH_TOP, right: TABLET_SEARCH_RIGHT }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={TABLET_SEARCH_ICON}
              height={TABLET_SEARCH_ICON}
              viewBox="0 0 21 21"
              fill="none"
              aria-hidden
            >
              <path
                d="M20 1L1 20M1 1L20 20"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="pt-[30px]">
        <nav aria-label="Site" className="w-full max-w-[320px] pl-[30px] min-[744px]:max-w-none" style={primaryLink}>
          <div>
            <button
              type="button"
              aria-expanded={coursesOpen}
              onClick={() => setCoursesOpen((v) => !v)}
              className="flex w-full items-center gap-2 text-left text-black"
              style={primaryLink}
            >
              COURSES
              <span aria-hidden className="text-[0.7em] leading-none">
                {coursesOpen ? "−" : "+"}
              </span>
            </button>
            {coursesOpen ? (
              <div className="mt-[8px] flex flex-col gap-[6px] pb-[8px] pl-[8px]">
                <MenuLink href="/course" onClose={onClose} style={nestedLink}>
                  All courses
                </MenuLink>
                <MenuLink href="/tracks/design-softwares" onClose={onClose} style={nestedLink}>
                  Software
                </MenuLink>
                {allCourses.map((item) => (
                  <MenuLink key={`all-${item.href}`} href={item.href} onClose={onClose} style={nestedLink}>
                    {item.label}
                  </MenuLink>
                ))}
                {software.map((item) => (
                  <MenuLink key={`sw-${item.href}`} href={item.href} onClose={onClose} style={nestedLink}>
                    {item.label}
                  </MenuLink>
                ))}
                <MenuLink href="/course" onClose={onClose} style={nestedLink}>
                  View more
                </MenuLink>
              </div>
            ) : null}
          </div>
          <MenuLink href="/library" onClose={onClose} style={primaryLink}>
            LIBRARY
          </MenuLink>
          {onLibrary ? (
            <MenuLink href="/library/categories" onClose={onClose} style={nestedLink} className="pl-[8px]">
              Categories
            </MenuLink>
          ) : null}
          <MenuLink href="/events" onClose={onClose} style={primaryLink}>
            EVENTS
          </MenuLink>
        </nav>

        <div className="mt-[20px] h-[2px] w-full bg-[#8AF396]" aria-hidden />

        {isGuest ? (
          <nav
            aria-label="Account"
            className="mt-[20px] w-[217px] pl-[30px] pb-[40px] min-[744px]:w-auto"
            style={guestAuthLink}
          >
            <MenuLink href="/login" onClose={onClose} style={guestAuthLink}>
              LOG IN
            </MenuLink>
            <MenuLink href="/register" onClose={onClose} style={guestAuthLink}>
              SIGN UP
            </MenuLink>
          </nav>
        ) : (
          <>
            <nav
              aria-label="Account"
              className="mt-[20px] w-[280px] pl-[30px] min-[744px]:w-auto"
              style={secondaryLink}
            >
              <MenuLink href="/profile" onClose={onClose} style={secondaryLink}>
                My Profile
              </MenuLink>
              <MenuLink href="/profile?tab=Learning#profile-sections" onClose={onClose} style={secondaryLink}>
                My Learning
              </MenuLink>
              <MenuLink href="/profile?tab=Activity#profile-sections" onClose={onClose} style={secondaryLink}>
                My Activity
              </MenuLink>
              <MenuLink href="/profile?edit=1" onClose={onClose} style={secondaryLink}>
                Account Settings
              </MenuLink>
              <MenuLink href="/subscription" onClose={onClose} style={secondaryLink}>
                Subscription
              </MenuLink>
              <MenuAction
                style={secondaryLink}
                onClick={() => {
                  toast("Language — coming soon");
                  onClose();
                }}
              >
                Language
              </MenuAction>
              <MenuAction
                style={secondaryLink}
                onClick={() => {
                  toast("Payment Method — coming soon");
                  onClose();
                }}
              >
                Payment Method
              </MenuAction>
            </nav>

            <div className="mt-[20px] h-[2px] w-full bg-[#8AF396]" aria-hidden />

            <nav
              aria-label="Support"
              className="mt-[20px] w-[234px] pl-[30px] pb-[40px] min-[744px]:w-auto"
              style={secondaryLink}
            >
              <MenuAction
                style={secondaryLink}
                onClick={() => {
                  toast("Help & Support — coming soon");
                  onClose();
                }}
              >
                Help & Support
              </MenuAction>
              <MenuAction
                style={secondaryLink}
                onClick={() => {
                  onClose();
                  void signOutToHome();
                }}
              >
                Log out
              </MenuAction>
            </nav>
          </>
        )}
      </div>
    </aside>,
    document.body,
  );
}
