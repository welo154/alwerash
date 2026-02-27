"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRef, useEffect, useState } from "react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "Profile"}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
            {user.name?.charAt(0) ?? user.email?.charAt(0) ?? "?"}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[100] mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <div className="border-b border-slate-100 px-4 py-2">
            <p className="truncate text-sm font-medium text-slate-900">
              {user.name ?? "User"}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Settings
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/?toast=Signed+out" });
            }}
            className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
