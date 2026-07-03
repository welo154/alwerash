import Link from "next/link";
import { LibraryBookGridBox } from "./LibraryBookGridBox";
import type { LibraryBook } from "./library-books";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const META_TEXT_STYLE = {
  fontFamily: pangeaFont,
  fontSize: "18px",
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "120%",
  width: "138px",
};

function LibraryMaterialFavoriteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="21"
      viewBox="0 0 23 21"
      fill="none"
      className="h-[19px] w-[21px] shrink-0"
      aria-hidden
    >
      <path
        d="M20.1815 2.47973C19.6684 1.9472 19.0591 1.52476 18.3886 1.23655C17.718 0.948333 16.9993 0.799988 16.2735 0.799988C15.5476 0.799988 14.8289 0.948333 14.1583 1.23655C13.4878 1.52476 12.8785 1.9472 12.3654 2.47973L11.3005 3.58439L10.2356 2.47973C9.19913 1.40456 7.79337 0.800545 6.32757 0.800545C4.86177 0.800545 3.45601 1.40456 2.41954 2.47973C1.38307 3.55489 0.800781 5.01312 0.800781 6.53363C0.800781 8.05413 1.38307 9.51237 2.41954 10.5875L11.3005 19.8L20.1815 10.5875C20.6949 10.0553 21.1021 9.42327 21.3799 8.72769C21.6578 8.03211 21.8008 7.28655 21.8008 6.53363C21.8008 5.7807 21.6578 5.03515 21.3799 4.33956C21.1021 3.64398 20.6949 3.012 20.1815 2.47973Z"
        fill="white"
        stroke="#1E1E1E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LibraryMaterialCard({ book }: { book: LibraryBook }) {
  return (
    <article className="w-[194px] shrink-0">
      <Link href={`/library/books/${book.id}`} className="block hover:opacity-90">
        <LibraryBookGridBox imageSrc={book.imageSrc} imageAlt={book.imageAlt} />
      </Link>
      <div className="mt-4 flex items-start gap-[30px]">
        <div className="min-w-0">
          <Link
            href={`/library/books/${book.id}`}
            className="m-0 block text-black hover:opacity-80"
            style={META_TEXT_STYLE}
          >
            {book.title}
          </Link>
          <p
            className="m-0 mt-0.5"
            style={{ ...META_TEXT_STYLE, color: "rgba(0, 0, 0, 0.60)" }}
          >
            {book.priceLabel}
          </p>
        </div>
        <button
          type="button"
          className="mt-0.5 shrink-0 rounded-sm hover:opacity-80"
          aria-label={`Save ${book.title}`}
        >
          <LibraryMaterialFavoriteIcon />
        </button>
      </div>
    </article>
  );
}
