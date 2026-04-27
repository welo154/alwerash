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
      className="flex items-center justify-between gap-3 px-6 py-3.5 text-[15px] font-normal text-black hover:bg-neutral-50"
      style={{ fontFamily: pangeaFont }}
    >
      <span>{children}</span>
      {end}
    </Link>
  );
}

function MenuDivider() {
  return <div className="h-px w-full bg-black/10" aria-hidden />;
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
          className="absolute right-0 top-full z-2500 mt-2 w-[min(100vw-1.5rem,360px)] overflow-hidden rounded-2xl border border-black bg-white shadow-[4px_4px_10px_0_rgba(0,0,0,0.25)]"
          style={{ fontFamily: pangeaFont }}
          role="menu"
        >
          {/* Profile header */}
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-black bg-white">
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-bold text-black">
                  {avatarInitials(user.name, user.email)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold uppercase leading-tight text-black">{displayName}</p>
              {displayEmail ? (
                <p className="mt-1 truncate text-[13px] font-normal leading-tight text-[#73726C]">{displayEmail}</p>
              ) : null}
            </div>
          </div>

          <MenuDivider />

          <nav aria-label="Activity">
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

          <MenuDivider />

          <nav aria-label="Account">
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

          <MenuDivider />

          <div className="pb-3 pt-1">
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
              className="flex w-full items-center px-6 py-3.5 text-left text-[15px] font-normal text-black hover:bg-neutral-50"
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
