"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOutToHome } from "@/lib/auth/signOutToHome";
import { useToast } from "@/components/Toast";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

type DrawerUser = {
  name?: string | null;
  email?: string | null;
} | null;

const linkClass =
  "block py-[10px] text-[18px] font-normal leading-normal text-black";

function DrawerLink({
  href,
  children,
  onClose,
}: {
  href: string;
  children: string;
  onClose: () => void;
}) {
  return (
    <Link href={href} onClick={onClose} className={linkClass} style={{ fontFamily: pangeaFont }}>
      {children}
    </Link>
  );
}

function ComingSoonLink({ label, onClose }: { label: string; onClose: () => void }) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() => {
        toast(`${label} — coming soon`);
        onClose();
      }}
      className={`${linkClass} w-full text-left opacity-40`}
      style={{ fontFamily: pangeaFont }}
    >
      {label}
    </button>
  );
}

export function MobileNavDrawer({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user?: DrawerUser;
}) {
  const { data: session } = useSession();
  const sessionUser = user ?? session?.user ?? null;
  const isGuest = !sessionUser;

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

  return (
    <div className="lg:hidden" aria-hidden={!open}>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`fixed inset-0 z-[80] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        id="mobile-nav-drawer"
        className={`fixed top-0 right-0 z-[90] flex h-dvh w-[min(320px,86vw)] flex-col overflow-y-auto bg-white px-[28px] pt-[28px] pb-[40px] shadow-[-8px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ fontFamily: pangeaFont }}
      >
        <div className="mb-[24px] flex items-center justify-between">
          <p className="m-0 text-[20px] font-normal text-black">Menu</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-[32px] w-[32px] items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M1 1L17 17M17 1L1 17" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {!isGuest ? (
          <div className="mb-[20px]">
            <p className="m-0 truncate text-[18px] text-black">{sessionUser.name?.trim() || "User"}</p>
            {sessionUser.email ? (
              <p className="m-0 mt-[2px] truncate text-[14px] text-black opacity-60">{sessionUser.email}</p>
            ) : null}
          </div>
        ) : null}

        <nav aria-label="Site" className="flex flex-col">
          <DrawerLink href="/course" onClose={onClose}>
            Courses
          </DrawerLink>
          <DrawerLink href="/library" onClose={onClose}>
            Library
          </DrawerLink>
          <DrawerLink href="/events" onClose={onClose}>
            Events
          </DrawerLink>
          <DrawerLink href="/course" onClose={onClose}>
            Course page
          </DrawerLink>
          {!isGuest ? (
            <DrawerLink href="/course" onClose={onClose}>
              My Learning
            </DrawerLink>
          ) : null}
        </nav>

        <div className="my-[16px] h-px w-full bg-black" aria-hidden />

        {isGuest ? (
          <nav aria-label="Account" className="flex flex-col">
            <DrawerLink href="/login" onClose={onClose}>
              Log in
            </DrawerLink>
            <DrawerLink href="/register" onClose={onClose}>
              Sign up
            </DrawerLink>
          </nav>
        ) : (
          <>
            <nav aria-label="Activity" className="flex flex-col">
              <DrawerLink href="/profile" onClose={onClose}>
                Profile
              </DrawerLink>
              <DrawerLink href="/profile?tab=Learning#profile-sections" onClose={onClose}>
                My Learning
              </DrawerLink>
              <DrawerLink href="/profile?tab=Activity#profile-sections" onClose={onClose}>
                My Activity
              </DrawerLink>
              <ComingSoonLink label="Notifications" onClose={onClose} />
              <ComingSoonLink label="Messages" onClose={onClose} />
            </nav>

            <div className="my-[16px] h-px w-full bg-black" aria-hidden />

            <nav aria-label="Account" className="flex flex-col">
              <DrawerLink href="/profile?edit=1" onClose={onClose}>
                Account Settings
              </DrawerLink>
              <DrawerLink href="/subscription" onClose={onClose}>
                Subscription
              </DrawerLink>
              <ComingSoonLink label="Payment Methods" onClose={onClose} />
              <ComingSoonLink label="Language" onClose={onClose} />
            </nav>

            <div className="my-[16px] h-px w-full bg-black" aria-hidden />

            <ComingSoonLink label="Help and Support" onClose={onClose} />
            <button
              type="button"
              onClick={() => {
                onClose();
                void signOutToHome();
              }}
              className={`${linkClass} w-full text-left`}
              style={{ fontFamily: pangeaFont }}
            >
              Log Out
            </button>
          </>
        )}
      </aside>
    </div>
  );
}
