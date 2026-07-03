import Link from "next/link";
import { LibraryBookGridBox } from "./LibraryBookGridBox";
import { LIBRARY_BOOKS } from "./library-books";

export function LibraryBookGridSection() {
  return (
    <section
      className="mt-[122px] ml-[137px] w-fit"
      aria-label="Library books grid"
    >
      <div className="grid grid-cols-5 gap-[60px]">
        {LIBRARY_BOOKS.map((book) => (
          <Link
            key={book.id}
            href={`/library/books/${book.id}`}
            className="block hover:opacity-90"
          >
            <LibraryBookGridBox
              imageSrc={book.imageSrc}
              imageAlt={book.imageAlt}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
