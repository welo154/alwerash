"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRef, useEffect, useState, type ReactNode } from "react";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  /** Logged-in green header: white ring, white avatar tile, black initials */
  theme?: "black" | "green";
}

function avatarInitials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  }
  const e = email?.trim();
  if (e) return e.slice(0, 2).toUpperCase();
  return "?";
}

function MenuRow({
  href,
  children,
  onClose,
  end,
}: {
  href: string;
  children: ReactNode;
  onClose: () => void;
  end?: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center justify-between gap-3 px-[30px] py-0 text-[18px] font-normal leading-normal text-black hover:bg-transparent"
      style={{ fontFamily: pangeaFont }}
    >
      <span>{children}</span>
      {end}
    </Link>
  );
}

function MenuDivider({ className = "" }: { className?: string }) {
  return <div className={`h-[2px] w-[277px] bg-black ${className}`.trim()} aria-hidden />;
}

export function UserMenu({ user, theme = "black" }: UserMenuProps) {
  const isGreen = theme === "green";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = (user.name ?? "User").trim() || "User";
  const displayEmail = user.email?.trim() ?? "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={
          isGreen
            ? "relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#004B3C]"
            : "relative h-10 w-10 overflow-hidden rounded-full border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
        }
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "Profile"}
            width={40}
            height={40}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <span
            className={
              isGreen
                ? "flex h-full w-full items-center justify-center bg-white text-sm font-bold text-black"
                : "flex h-full w-full items-center justify-center bg-yellow-400/20 text-sm font-medium text-slate-900"
            }
          >
            {isGreen
              ? avatarInitials(user.name, user.email)
              : (user.name?.charAt(0) ?? user.email?.charAt(0) ?? "?").toUpperCase()}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-2500 mt-2 h-[638px] w-[277px] overflow-hidden rounded-[50px] border-2 border-black bg-white shadow-[4px_4px_10px_0_rgba(0,0,0,0.25)]"
          style={{ fontFamily: pangeaFont }}
          role="menu"
        >
          {/* Profile header */}
          <div className="px-[30px] pt-[25px]">
            <div className="flex items-center gap-[11px]">
              <div className="relative h-[49px] w-[49px] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 50 50" fill="none" className="h-[49px] w-[49px]" aria-hidden>
                  <path
                    d="M25 49.5C38.531 49.5 49.5 38.531 49.5 25C49.5 11.469 38.531 0.5 25 0.5C11.469 0.5 0.5 11.469 0.5 25C0.5 38.531 11.469 49.5 25 49.5Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-black">
                  {avatarInitials(user.name, user.email)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="m-0 truncate"
                  style={{ color: "var(--Black, #000)", fontFamily: pangeaFont, fontSize: "18px", fontStyle: "normal", fontWeight: 400, lineHeight: "normal" }}
                >
                  {displayName}
                </p>
                {displayEmail ? (
                  <p
                    className="m-0 mt-[2px] truncate"
                    style={{ color: "var(--Black, #000)", fontFamily: pangeaFont, fontSize: "16px", fontStyle: "normal", fontWeight: 400, lineHeight: "120%" }}
                  >
                    {displayEmail}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-[19px] -mx-[30px] h-px w-[277px] bg-black" aria-hidden />
          </div>

          <nav aria-label="Activity" className="mt-[28px] flex flex-col gap-[20px]">
            <MenuRow href="/course" onClose={() => setOpen(false)}>
              My Learning
            </MenuRow>
            <MenuRow href="/dashboard" onClose={() => setOpen(false)}>
              My Activity
            </MenuRow>
            <MenuRow
              href="/settings"
              onClose={() => setOpen(false)}
              end={
                <span className="shrink-0 rounded-full bg-[#D8B4FE] px-2 py-0.5 text-xs font-bold text-black">3+</span>
              }
            >
              Notifications
            </MenuRow>
            <MenuRow href="/profile" onClose={() => setOpen(false)}>
              Messages
            </MenuRow>
          </nav>

          <MenuDivider className="mt-[31px] h-px" />

          <nav aria-label="Account" className="mt-[8px] flex flex-col gap-[20px]">
            <MenuRow href="/settings" onClose={() => setOpen(false)}>
              Account Settings
            </MenuRow>
            <MenuRow href="/subscription" onClose={() => setOpen(false)}>
              Subscription
            </MenuRow>
            <MenuRow href="/settings" onClose={() => setOpen(false)}>
              Payment Methods
            </MenuRow>
            <MenuRow href="/settings" onClose={() => setOpen(false)}>
              Language
            </MenuRow>
          </nav>

          <MenuDivider className="mt-[24px]" />

          <div className="pb-[30px] pt-[26px]">
            <MenuRow href="/settings" onClose={() => setOpen(false)}>
              Help and Support
            </MenuRow>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/?toast=Signed+out" });
              }}
              className="mt-[20px] flex w-full items-center px-[30px] py-0 text-left text-[18px] font-normal leading-normal text-black hover:bg-transparent"
              style={{ fontFamily: pangeaFont }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
