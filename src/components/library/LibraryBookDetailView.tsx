import { LibraryBookDetailLayout } from "./LibraryBookDetailLayout";
import { LibraryBookDetailsSection } from "./LibraryBookDetailsSection";
import { LibraryBookStudentsRatingSection } from "./LibraryBookStudentsRatingSection";
import type { LibraryBook } from "./library-books";

export function LibraryBookDetailView({ book }: { book: LibraryBook }) {
  return (
    <LibraryBookDetailLayout bookTitle={book.title}>
      <LibraryBookDetailsSection book={book} />
      <div className="mt-[100px] flex w-full justify-center">
        <LibraryBookStudentsRatingSection />
      </div>
    </LibraryBookDetailLayout>
  );
}
