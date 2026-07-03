import Image from "next/image";

const PRIMARY_BOOK_WIDTH = 451;
const PRIMARY_BOOK_HEIGHT = 580;

const OVERLAP_BOOK_WIDTH = 420;
const OVERLAP_BOOK_HEIGHT = 540;
const OVERLAP_BOOK_LEFT_OFFSET = 160;
const OVERLAP_BOOK_TOP_OFFSET = -15;

const LAST_BOOK_WIDTH = 445;
const LAST_BOOK_HEIGHT = 572;
const LAST_BOOK_TOP_OFFSET = 10;

const BOOKS = [
  {
    src: "/library/books/book-work.png",
    alt: "Work book cover",
    width: PRIMARY_BOOK_WIDTH,
    height: PRIMARY_BOOK_HEIGHT,
    marginLeft: 0,
    top: 0,
  },
  {
    src: "/library/books/book-kafka.png",
    alt: "Franz Kafka Dream book cover",
    width: OVERLAP_BOOK_WIDTH,
    height: OVERLAP_BOOK_HEIGHT,
    marginLeft: -OVERLAP_BOOK_LEFT_OFFSET,
    top: OVERLAP_BOOK_TOP_OFFSET,
  },
  {
    src: "/library/books/book-blue-day.png",
    alt: "Blue day film book cover",
    width: OVERLAP_BOOK_WIDTH,
    height: OVERLAP_BOOK_HEIGHT,
    marginLeft: -OVERLAP_BOOK_LEFT_OFFSET,
    top: OVERLAP_BOOK_TOP_OFFSET,
  },
  {
    src: "/library/books/book-portrait.png",
    alt: "Portrait book cover",
    width: LAST_BOOK_WIDTH,
    height: LAST_BOOK_HEIGHT,
    marginLeft: -OVERLAP_BOOK_LEFT_OFFSET,
    top: LAST_BOOK_TOP_OFFSET,
  },
] as const;

export function LibraryFeaturedBook() {
  return (
    <section
      className="mt-[75px] ml-[99px] flex items-start"
      aria-label="Featured books"
    >
      {BOOKS.map((book, index) => (
        <div
          key={book.src}
          className="relative shrink-0"
          style={{
            width: book.width,
            height: book.height,
            marginLeft: book.marginLeft,
            top: book.top,
            zIndex: BOOKS.length - index,
          }}
        >
          <Image
            src={book.src}
            alt={book.alt}
            width={book.width}
            height={book.height}
            className="h-full w-full object-contain"
            unoptimized
            priority={index === 0}
          />
        </div>
      ))}
    </section>
  );
}
