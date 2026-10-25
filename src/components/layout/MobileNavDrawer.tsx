"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOutToHome } from "@/lib/auth/signOutToHome";
import { useToast } from "@/components/Toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { pangeaFontFamily } from "@/lib/fonts/pangea";
import { SUBSCRIPTION_PRICING_PATH } from "@/lib/subscription-routes";

const pangeaFont = pangeaFontFamily;
const MOBILE_LOGO = { width: 160, height: 47 } as const;
const TABLET_LOGO = { width: 135 * 1.6, height: 41 * 1.6 } as const;
const TABLET_NAV_WIDTH = 732;
const TABLET_LOGO_TOP = 3;
const TABLET_SEARCH_ICON = 26;
const TABLET_SEARCH_TOP = 31 - 7;
const TABLET_SEARCH_RIGHT = 74;
const MOBILE_SEARCH_ICON = 23;

const PRIMARY_LINK = {
  color: "var(--Black, #000)",
  fontFamily: pangeaFont,
  fontSize: 32,
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "150%",
  fontVariationSettings: '"wght" 400',
};

const TABLET_PRIMARY_LINK = {
  ...PRIMARY_LINK,
  fontSize: 40,
};

const GUEST_AUTH_LINK = {
  color: "var(--Black, #000)",
  fontFamily: pangeaFont,
  fontSize: 32,
  fontStyle: "normal" as const,
  fontWeight: 700,
  lineHeight: "150%",
  fontVariationSettings: '"wght" 700',
};

const TABLET_GUEST_AUTH_LINK = {
  ...GUEST_AUTH_LINK,
  fontSize: 40,
};

const SECONDARY_LINK = {
  color: "var(--Black, #000)",
  fontFamily: pangeaFont,
  fontSize: 24,
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "150%",
  fontVariationSettings: '"wght" 400',
};

const TABLET_SECONDARY_LINK = {
  ...SECONDARY_LINK,
  fontSize: 32,
};

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
    <Link href={href} onClick={onClose} className={`block whitespace-nowrap text-black ${className ?? ""}`} style={style}>
      {children}
    </Link>
  );
}

function MenuAction({
  children,
  onClick,
  style,
  ariaLabel,
}: {
  children: string;
  onClick: () => void;
  style: CSSProperties;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="block w-full text-black"
      style={style}
    >
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
  const toast = useToast();
  const { locale, toggleLocale } = useLocale();
  const arabic = locale === "ar";
  const isGuest = !session?.user;
  const [mounted, setMounted] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 744px)");
    const apply = () => setIsTablet(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!open) return;
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

  if (!mounted) return null;

  const primaryLink = {
    ...(isTablet ? TABLET_PRIMARY_LINK : PRIMARY_LINK),
    textAlign: arabic ? ("right" as const) : ("left" as const),
  };
  const guestAuthLink = {
    ...(isTablet ? TABLET_GUEST_AUTH_LINK : GUEST_AUTH_LINK),
    textAlign: arabic ? ("right" as const) : ("left" as const),
  };
  const secondaryLink = {
    ...(isTablet ? TABLET_SECONDARY_LINK : SECONDARY_LINK),
    textAlign: arabic ? ("right" as const) : ("left" as const),
  };
  const homeHref = isGuest ? "/" : "/home";
  const primaryGroupClass = arabic
    ? "ml-auto mr-[30px] w-[164px] text-right min-[744px]:ml-0 min-[744px]:mr-0 min-[744px]:w-full min-[744px]:pr-[30px]"
    : "ml-[30px] w-[164px] text-left min-[744px]:ml-0 min-[744px]:w-auto min-[744px]:pl-[30px]";
  const guestGroupClass = arabic
    ? "mt-[20px] ml-auto mr-[30px] w-[217px] pb-[40px] text-right min-[744px]:ml-0 min-[744px]:mr-0 min-[744px]:w-full min-[744px]:pr-[30px]"
    : "mt-[20px] ml-[30px] w-[217px] pb-[40px] text-left min-[744px]:ml-0 min-[744px]:w-auto min-[744px]:pl-[30px]";
  const accountGroupClass = arabic
    ? "mt-[20px] w-full pr-[30px] text-right"
    : "mt-[20px] pl-[30px]";

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
        <nav aria-label="Site" className={primaryGroupClass} style={primaryLink}>
          <MenuLink href="/course" onClose={onClose} style={primaryLink}>
            {arabic ? "الدورات" : "COURSES"}
          </MenuLink>
          <MenuLink href="/library" onClose={onClose} style={primaryLink}>
            {arabic ? "المكتبة" : "LIBRARY"}
          </MenuLink>
          <MenuLink href="/events" onClose={onClose} style={primaryLink}>
            {arabic ? "الفعاليات" : "EVENTS"}
          </MenuLink>
        </nav>

        <div
          className="mt-[20px] w-full bg-[#8AF396]"
          style={{ height: 2 }}
          aria-hidden
        />

        {isGuest ? (
          <nav aria-label="Account" className={guestGroupClass} style={guestAuthLink}>
            <MenuLink href="/login" onClose={onClose} style={guestAuthLink}>
              {arabic ? "تسجيل الدخول" : "LOG IN"}
            </MenuLink>
            <MenuLink href={SUBSCRIPTION_PRICING_PATH} onClose={onClose} style={guestAuthLink}>
              {arabic ? "إنشاء حساب" : "SIGN UP"}
            </MenuLink>
          </nav>
        ) : (
          <>
            <nav aria-label="Account" className={accountGroupClass} style={secondaryLink}>
              <MenuLink href="/profile" onClose={onClose} style={secondaryLink}>
                {arabic ? "ملفي الشخصي" : "My Profile"}
              </MenuLink>
              <MenuAction
                style={secondaryLink}
                ariaLabel={arabic ? "Switch to English" : "Switch to Arabic"}
                onClick={toggleLocale}
              >
                {arabic ? "English" : "Arabic"}
              </MenuAction>
              <MenuLink href="/subscription" onClose={onClose} style={secondaryLink}>
                {arabic ? "الاشتراك" : "Subscription"}
              </MenuLink>
              <MenuAction
                style={secondaryLink}
                onClick={() => {
                  toast("Payment Method — coming soon");
                  onClose();
                }}
              >
                {arabic ? "طريقة الدفع" : "Payment Method"}
              </MenuAction>
            </nav>

            <div
              className="mt-[20px] w-full bg-[#8AF396]"
              style={{ height: 2 }}
              aria-hidden
            />

            <nav
              aria-label="Support"
              className={`${accountGroupClass} pb-[40px]`}
              style={secondaryLink}
            >
              <MenuAction
                style={secondaryLink}
                onClick={() => {
                  toast("Help & Support — coming soon");
                  onClose();
                }}
              >
                {arabic ? "المساعدة والدعم" : "Help & Support"}
              </MenuAction>
              <MenuAction
                style={secondaryLink}
                onClick={() => {
                  onClose();
                  void signOutToHome();
                }}
              >
                {arabic ? "تسجيل الخروج" : "Log out"}
              </MenuAction>
            </nav>
          </>
        )}
      </div>
    </aside>,
    document.body,
  );
}
