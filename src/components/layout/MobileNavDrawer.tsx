"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOutToHome } from "@/lib/auth/signOutToHome";
import { useToast } from "@/components/Toast";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;
const LOGO = { width: 160, height: 47 } as const;

const PRIMARY_LINK = {
  color: "#000",
  fontFamily: pangeaFont,
  fontSize: 32,
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "150%",
};

const GUEST_AUTH_LINK = {
  color: "#000",
  fontFamily: pangeaFont,
  fontSize: 32,
  fontStyle: "normal" as const,
  fontWeight: 700,
  lineHeight: "150%",
};

const SECONDARY_LINK = {
  color: "#000",
  fontFamily: pangeaFont,
  fontSize: 24,
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "150%",
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
    <Link href={href} onClick={onClose} className={`block text-black ${className ?? ""}`} style={style}>
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
  const toast = useToast();
  const isGuest = !session?.user;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      <div className="relative w-full pt-[37px]">
        <div className="relative mx-auto h-[47px] w-[382px] max-w-full">
          <Link
            href={isGuest ? "/" : "/home"}
            onClick={onClose}
            className="absolute left-[-16px] top-[-2px] z-40 block"
            style={{ width: LOGO.width, height: LOGO.height, aspectRatio: "99 / 29" }}
            aria-label="Go to home"
          >
            <Image
              src="/brand/alwerash-logo-hero.png"
              alt="Alwerash"
              width={LOGO.width}
              height={LOGO.height}
              className="block h-[47px] w-[160px] max-w-none object-contain"
              style={{ aspectRatio: "99 / 29" }}
              unoptimized
            />
          </Link>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-[24px] top-[37px] flex h-[47px] w-[19px] items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 21 21" fill="none" aria-hidden>
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

      <div className="pt-[30px]">
        <nav aria-label="Site" className="w-[164px] pl-[30px]" style={PRIMARY_LINK}>
          <MenuLink href="/course" onClose={onClose} style={PRIMARY_LINK}>
            COURSES
          </MenuLink>
          <MenuLink href="/library" onClose={onClose} style={PRIMARY_LINK}>
            LIBRARY
          </MenuLink>
          <MenuLink href="/events" onClose={onClose} style={PRIMARY_LINK}>
            EVENTS
          </MenuLink>
        </nav>

        <div className="mt-[20px] h-[2px] w-full bg-[#8AF396]" aria-hidden />

        {isGuest ? (
          <nav aria-label="Account" className="mt-[20px] w-[217px] pl-[30px] pb-[40px]" style={GUEST_AUTH_LINK}>
            <MenuLink href="/login" onClose={onClose} style={GUEST_AUTH_LINK}>
              LOG IN
            </MenuLink>
            <MenuLink href="/register" onClose={onClose} style={GUEST_AUTH_LINK}>
              SIGN UP
            </MenuLink>
          </nav>
        ) : (
          <>
            <nav aria-label="Account" className="mt-[20px] w-[234px] pl-[30px]" style={SECONDARY_LINK}>
              <MenuLink href="/profile" onClose={onClose} style={SECONDARY_LINK}>
                My Profile
              </MenuLink>
              <MenuAction
                style={SECONDARY_LINK}
                onClick={() => {
                  toast("Language — coming soon");
                  onClose();
                }}
              >
                Language
              </MenuAction>
              <MenuLink href="/subscription" onClose={onClose} style={SECONDARY_LINK}>
                Subscription
              </MenuLink>
              <MenuAction
                style={SECONDARY_LINK}
                onClick={() => {
                  toast("Payment Method — coming soon");
                  onClose();
                }}
              >
                Payment Method
              </MenuAction>
            </nav>

            <div className="mt-[20px] h-[2px] w-full bg-[#8AF396]" aria-hidden />

            <nav aria-label="Support" className="mt-[20px] w-[234px] pl-[30px] pb-[40px]" style={SECONDARY_LINK}>
              <MenuAction
                style={SECONDARY_LINK}
                onClick={() => {
                  toast("Help & Support — coming soon");
                  onClose();
                }}
              >
                Help & Support
              </MenuAction>
              <MenuAction
                style={SECONDARY_LINK}
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
