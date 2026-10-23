import type { MetadataRoute } from "next";
import { prisma } from "@/server/db/prisma";
import { LIBRARY_BOOKS } from "@/components/library/library-books";
import { LIBRARY_CATEGORIES } from "@/components/library/library-categories";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const STATIC_PATHS: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/course", priority: 0.9, changeFrequency: "daily" },
  { path: "/tracks", priority: 0.8, changeFrequency: "weekly" },
  { path: "/mentors", priority: 0.7, changeFrequency: "weekly" },
  { path: "/library", priority: 0.7, changeFrequency: "weekly" },
  { path: "/library/categories", priority: 0.5, changeFrequency: "weekly" },
  { path: "/events", priority: 0.5, changeFrequency: "weekly" },
  { path: "/subscription", priority: 0.8, changeFrequency: "monthly" },
  { path: "/login", priority: 0.3, changeFrequency: "monthly" },
  { path: "/register", priority: 0.4, changeFrequency: "monthly" },
];

async function loadDynamicEntries(base: string): Promise<MetadataRoute.Sitemap> {
  try {
    const [tracks, courses, mentors] = await Promise.all([
      prisma.track.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.course.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }),
      prisma.mentor.findMany({ select: { id: true, updatedAt: true } }),
    ]);
    return [
      ...tracks.map((t) => ({
        url: `${base}/tracks/${encodeURIComponent(t.slug)}`,
        lastModified: t.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...courses.map((c) => ({
        url: `${base}/course/${c.id}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...mentors.map((m) => ({
        url: `${base}/mentors/${m.id}`,
        lastModified: m.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch (err) {
    console.error("[sitemap] database entries skipped", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${base}${p.path === "/" ? "" : p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const libraryEntries: MetadataRoute.Sitemap = [
    ...LIBRARY_CATEGORIES.map((c) => ({
      url: `${base}/library/categories/${encodeURIComponent(c.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...LIBRARY_BOOKS.map((b) => ({
      url: `${base}/library/books/${encodeURIComponent(b.id)}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  return [...staticEntries, ...(await loadDynamicEntries(base)), ...libraryEntries];
}
