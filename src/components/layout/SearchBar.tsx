"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

type SearchResult = {
  tracks: { id: string; title: string; slug: string }[];
  courses: { id: string; title: string; track: { slug: string; title: string } | null }[];
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`);
      if (res.ok) {
        const data: SearchResult = await res.json();
        setResults(data);
        setOpen(true);
      } else {
        setResults(null);
      }
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchResults(query), 200);
    return () => clearTimeout(t);
  }, [query, fetchResults]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = results && (results.tracks.length > 0 || results.courses.length > 0);
  const showDropdown = open && (query.trim() !== "");

  return (
    <div ref={containerRef} className="relative mx-4 flex flex-1 max-w-md">
      <input
        type="search"
        placeholder="Search courses or tracks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim() && setOpen(true)}
        className="w-full rounded-lg border border-slate-200 px-4 py-2 pr-10 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        aria-label="Search courses and tracks"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
        autoComplete="off"
      />
      {loading && (
        <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      )}

      {showDropdown && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[min(70vh,400px)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {!results ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              {loading ? "Searching..." : "Type to search"}
            </div>
          ) : !hasResults ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              No tracks or courses found.
            </div>
          ) : (
            <div className="py-2">
              {/* Accordion section: Tracks */}
              {results.tracks.length > 0 && (
                <div className="border-b border-slate-100">
                  <div className="sticky top-0 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tracks
                  </div>
                  <ul className="py-1">
                    {results.tracks.map((track) => (
                      <li key={track.id}>
                        <Link
                          href={`/tracks/${track.slug}`}
                          className="block px-4 py-2.5 text-sm text-slate-800 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => setOpen(false)}
                        >
                          {track.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Accordion section: Courses */}
              {results.courses.length > 0 && (
                <div>
                  <div className="sticky top-0 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Courses
                  </div>
                  <ul className="py-1">
                    {results.courses.map((course) => (
                      <li key={course.id}>
                        <Link
                          href={`/courses/${course.id}`}
                          className="block px-4 py-2.5 text-sm text-slate-800 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => setOpen(false)}
                        >
                          <span>{course.title}</span>
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
