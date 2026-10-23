import { StudentsRatingWorkSection } from "@/components/students/StudentsRatingWorkSection";
import { publicListStudentStories } from "@/server/content/student-stories.service";
import { LibraryBookDetailLayout } from "./LibraryBookDetailLayout";
import { LibraryBookDetailsSection } from "./LibraryBookDetailsSection";
import type { LibraryBook } from "./library-books";

export async function LibraryBookDetailView({ book }: { book: LibraryBook }) {
  const studentStories = await publicListStudentStories();
  return (
    <LibraryBookDetailLayout bookTitle={book.title}>
      <LibraryBookDetailsSection book={book} />
      <div className="mt-[100px] mb-0 w-full px-10">
        <StudentsRatingWorkSection cards={studentStories ?? undefined} sectionClassName="py-0" />
      </div>
    </LibraryBookDetailLayout>
  );
}
