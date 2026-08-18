import { StudentsRatingWorkSection } from "@/components/students/StudentsRatingWorkSection";
import { LibraryBookDetailLayout } from "./LibraryBookDetailLayout";
import { LibraryBookDetailsSection } from "./LibraryBookDetailsSection";
import type { LibraryBook } from "./library-books";

export function LibraryBookDetailView({ book }: { book: LibraryBook }) {
  return (
    <LibraryBookDetailLayout bookTitle={book.title}>
      <LibraryBookDetailsSection book={book} />
      <div className="mt-[100px] mb-0 w-full px-10">
        <StudentsRatingWorkSection sectionClassName="py-0" />
      </div>
    </LibraryBookDetailLayout>
  );
}
