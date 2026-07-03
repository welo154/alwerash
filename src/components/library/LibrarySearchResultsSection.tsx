import { LibraryMaterialCard } from "./LibraryMaterialCard";
import type { LibraryBook } from "./library-books";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

export function LibrarySearchResultsSection({
  query,
  books,
}: {
  query: string;
  books: LibraryBook[];
}) {
  const heading = query ? `Results for "${query}"` : "Search books";

  return (
    <div className="min-w-0">
      <h1
        className="m-0 min-w-0 text-black"
        style={{
          fontFamily: pangeaFont,
          fontSize: "48px",
          fontWeight: 400,
          lineHeight: "120%",
        }}
      >
        {heading}
      </h1>

      <div className="mt-[50px] min-w-0">
        {!query ? (
          <p
            className="text-[20px] text-black/60"
            style={{ fontFamily: pangeaFont }}
          >
            Enter a title, author, or keyword to find books in the library.
          </p>
        ) : books.length === 0 ? (
          <p
            className="text-[20px] text-black/60"
            style={{ fontFamily: pangeaFont }}
          >
            No books found for &ldquo;{query}&rdquo;. Try a different search.
          </p>
        ) : (
          <div className="ml-[30px] flex flex-wrap gap-[50px]">
            {books.map((book) => (
              <LibraryMaterialCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
