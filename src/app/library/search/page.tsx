import type { Metadata } from "next";
import { LibrarySearchResultsSection } from "@/components/library/LibrarySearchResultsSection";
import { searchLibraryBooks } from "@/components/library/library-books";

export const metadata: Metadata = {
  title: "Search | Library",
};

export default async function LibrarySearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const books = query ? searchLibraryBooks(query) : [];

  return (
    <div className="min-w-0 max-w-full overflow-x-clip bg-white pb-16 pt-[50px] font-sans">
      <div className="mx-auto w-full min-w-0 max-w-[1400px] pl-6 sm:pl-8 lg:pl-10">
        <main className="min-w-0">
          <LibrarySearchResultsSection query={query} books={books} />
        </main>
      </div>
    </div>
  );
}
