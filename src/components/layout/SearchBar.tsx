"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

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

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
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

  return (
    <div ref={containerRef} className="relative mx-2 flex flex-1 max-w-md sm:mx-4">
      <label htmlFor="header-search" className="sr-only">
        Search courses and tracks
      </label>
      <div className="relative w-full">
        <span className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400">
          <SearchIcon className="h-full w-full" />
        </span>
        <input
          id="header-search"
          type="search"
          placeholder="Search courses or tracks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20 sm:py-2"
          aria-label="Search courses and tracks"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-results-listbox"
          aria-haspopup="listbox"
          autoComplete="off"
        />
        {loading && (
          <span
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500"
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
                    Tracks
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
                          href={`/courses/${course.id}`}
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
