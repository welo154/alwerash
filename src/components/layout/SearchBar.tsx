"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

type SearchResult = {
  tracks: { id: string; title: string; slug: string }[];
  courses: { id: string; title: string; track: { slug: string; title: string } | null }[];
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M5 12h12" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type SearchBarVariant = "default" | "toolbar" | "mobileHeader";

type SearchBarProps = {
  /** Green logged-in header: white field + circular arrow, no magnifier */
  variant?: SearchBarVariant;
  autoFocus?: boolean;
  expanded?: boolean;
  outlined?: boolean;
};

export function SearchBar({
  variant = "default",
  autoFocus = false,
  expanded = false,
  outlined = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);

  const fetchResults = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults(null);
      setOpen(false);
      setLoading(false);
      return;
    }
    const id = ++requestIdRef.current;
    setLoading(true);
    setOpen(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=8`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (id !== requestIdRef.current) return;
      if (res.ok) {
        const data: SearchResult = await res.json();
        setResults(data);
      } else {
        setResults({ tracks: [], courses: [] });
      }
    } catch {
      if (id !== requestIdRef.current) return;
      setResults({ tracks: [], courses: [] });
    } finally {
      if (id === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchResults(query), 250);
    return () => clearTimeout(t);
  }, [query, fetchResults]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const hasResults = results && (results.tracks.length > 0 || results.courses.length > 0);
  const showDropdown = open && query.trim() !== "";

  const inputId =
    variant === "toolbar"
      ? "header-search-toolbar"
      : variant === "mobileHeader"
        ? "header-search-mobile"
        : "header-search";

  if (variant === "mobileHeader") {
    const mobileBarWidth = outlined ? 192 : 206;
    return (
      <div
        ref={containerRef}
        className="relative h-[38px]"
        style={{ width: mobileBarWidth, pointerEvents: expanded ? "auto" : "none" }}
      >
        <label htmlFor={inputId} className="sr-only">
          Search for courses
        </label>
        <div
          className="flex h-[38px] shrink-0 items-center"
          style={{
            width: mobileBarWidth,
            borderRadius: "8px 8px 8px 18px",
            border: outlined ? "0.3px solid #000" : "0 solid #000",
            background: "#FFF",
            padding: "12px",
          }}
        >
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            placeholder="Search for courses"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setOpen(true)}
            autoFocus={autoFocus}
            tabIndex={expanded ? 0 : -1}
            className="min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-black/60"
            style={{
              flex: "1 0 0",
              color: "#000",
              fontFamily: pangeaFontFamily,
              fontSize: 14,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "19.6px",
            }}
            aria-label="Search for courses"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="search-results-listbox-mobile"
            aria-haspopup="listbox"
            autoComplete="off"
          />
        </div>
        {showDropdown && expanded ? (
          <div
            id="search-results-listbox-mobile"
            role="listbox"
            className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          >
            {!results ? (
              <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-slate-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                Searching...
              </div>
            ) : !hasResults ? (
              <div className="px-3 py-6 text-center text-sm text-slate-500">
                No tracks or courses found for &quot;{query.trim()}&quot;
              </div>
            ) : (
              <div className="max-h-[min(50vh,280px)] overflow-y-auto py-1">
                {results.tracks.map((track) => (
                  <Link
                    key={track.id}
                    href={`/tracks/${track.slug}`}
                    className="block px-3 py-2 text-sm text-slate-800 hover:bg-blue-50"
                    onClick={() => setOpen(false)}
                  >
                    {track.title}
                  </Link>
                ))}
                {results.courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/course/${course.id}`}
                    className="block px-3 py-2 text-sm text-slate-800 hover:bg-blue-50"
                    onClick={() => setOpen(false)}
                  >
                    {course.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  if (variant === "toolbar") {
    return (
      <div
        ref={containerRef}
        className="relative flex h-10 w-full min-w-0 items-center justify-center"
      >
        <label htmlFor={inputId} className="sr-only">
          Search for courses
        </label>
        <div className="relative min-w-0 flex-1">
          <input
            id={inputId}
            type="search"
            placeholder="Search for courses"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setOpen(true)}
            className="h-10 w-full bg-white px-3 py-2 text-sm font-medium text-black outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-black/20"
            style={{ borderRadius: "8px", border: "1px solid #000", background: "#FFF" }}
            aria-label="Search for courses"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="search-results-listbox"
            aria-haspopup="listbox"
            autoComplete="off"
          />
          {loading && (
            <span
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-200 border-t-white"
              aria-hidden
            />
          )}
        </div>
        {showDropdown && (
          <div
            id="search-results-listbox"
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          >
            {!results ? (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                Searching...
              </div>
            ) : !hasResults ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No tracks or courses found for &quot;{query.trim()}&quot;
              </div>
            ) : (
              <div className="max-h-[min(70vh,380px)] overflow-y-auto py-1">
                {results.tracks.length > 0 && (
                  <div className="border-b border-slate-100">
                    <div className="sticky top-0 z-10 bg-slate-50/95 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Projects
                    </div>
                    <ul className="py-1">
                      {results.tracks.map((track) => (
                        <li key={track.id}>
                          <Link
                            href={`/tracks/${track.slug}`}
                            className="block px-4 py-2.5 text-sm text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none"
                            onClick={() => setOpen(false)}
                          >
                            {track.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.courses.length > 0 && (
                  <div>
                    <div className="sticky top-0 z-10 bg-slate-50/95 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Courses
                    </div>
                    <ul className="py-1">
                      {results.courses.map((course) => (
                        <li key={course.id}>
                          <Link
                            href={`/course/${course.id}`}
                            className="block px-4 py-2.5 text-sm text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <span className="font-medium">{course.title}</span>
                            {course.track && (
                              <span className="ml-2 text-slate-400">· {course.track.title}</span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex w-full flex-1">
      <label htmlFor={inputId} className="sr-only">
        Search for courses
      </label>
      <div className="relative w-full">
        <span className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500">
          <SearchIcon className="h-full w-full" />
        </span>
        <input
          id={inputId}
          type="search"
          placeholder="Search for courses"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          className="w-full rounded-full border-0 bg-white py-2 pl-11 pr-10 text-sm font-medium text-black outline-none transition-all placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400"
          aria-label="Search for courses"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-results-listbox"
          aria-haspopup="listbox"
          autoComplete="off"
        />
        {loading && (
          <span
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-200 border-t-[var(--color-primary)]"
            aria-hidden
          />
        )}
      </div>

      {showDropdown && (
        <div
          id="search-results-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
          {!results ? (
            <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
              Searching...
            </div>
          ) : !hasResults ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No tracks or courses found for &quot;{query.trim()}&quot;
            </div>
          ) : (
            <div className="max-h-[min(70vh,380px)] overflow-y-auto py-1">
              {results.tracks.length > 0 && (
                <div className="border-b border-slate-100">
                  <div className="sticky top-0 z-10 bg-slate-50/95 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Projects
                  </div>
                  <ul className="py-1">
                    {results.tracks.map((track) => (
                      <li key={track.id}>
                        <Link
                          href={`/tracks/${track.slug}`}
                          className="block px-4 py-2.5 text-sm text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none"
                          onClick={() => setOpen(false)}
                        >
                          {track.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.courses.length > 0 && (
                <div>
                  <div className="sticky top-0 z-10 bg-slate-50/95 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Courses
                  </div>
                  <ul className="py-1">
                    {results.courses.map((course) => (
                      <li key={course.id}>
                        <Link
                          href={`/course/${course.id}`}
                          className="block px-4 py-2.5 text-sm text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none"
                          onClick={() => setOpen(false)}
                        >
                          <span className="font-medium">{course.title}</span>
                          {course.track && (
                            <span className="ml-2 text-slate-400">· {course.track.title}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

