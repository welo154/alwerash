import { getLibraryBooksByCategory } from "./library-books";

export type LibraryCategory = {
  key: string;
  slug: string;
  /** Page heading (uppercase in UI). */
  title: string;
  /** Sidebar label. */
  label: string;
};

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  {
    key: "library-book-section",
    slug: "book-section",
    title: "BOOK SECTION",
    label: "Book Section",
  },
  {
    key: "library-articles-section",
    slug: "articles-section",
    title: "ARTICLES SECTION",
    label: "Articles Section",
  },
  {
    key: "library-podcasts-section",
    slug: "podcasts-section",
    title: "PODCASTS SECTION",
    label: "Podcasts Section",
  },
  {
    key: "library-references-materials",
    slug: "references-materials",
    title: "REFERENCES & MATERIALS",
    label: "References & Materials",
  },
];

export function getLibraryCategoriesWithBooks(): LibraryCategory[] {
  return LIBRARY_CATEGORIES.filter(
    (category) => getLibraryBooksByCategory(category.slug).length > 0
  );
}

export function getLibraryCategoryBySlug(slug: string): LibraryCategory | undefined {
  return LIBRARY_CATEGORIES.find((category) => category.slug === slug);
}

export function buildLibrarySidebarCategories() {
  return getLibraryCategoriesWithBooks().map((category) => ({
    key: category.key,
    label: category.label,
    href: `/library/categories/${category.slug}`,
  }));
}
