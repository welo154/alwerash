import { LibraryMaterialCard } from "./LibraryMaterialCard";
import type { LibraryBook } from "./library-books";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

export function LibraryCategoryMaterialsSection({
  categoryTitle,
  books,
}: {
  categoryTitle: string;
  books: LibraryBook[];
}) {
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
        {categoryTitle}
      </h1>

      <div className="mt-[50px] min-w-0">
        {books.length === 0 ? (
          <p
            className="text-center text-[20px] text-black/60"
            style={{ fontFamily: pangeaFont }}
          >
            No materials in this category yet.
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
