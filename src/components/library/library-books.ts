export type LibraryBook = {
  id: string;
  title: string;
  priceLabel: string;
  imageSrc: string;
  imageAlt: string;
  /** Optional larger cover used on the book detail page only. */
  detailImageSrc?: string;
  categorySlug: string;
  author: string;
  /** Full title shown on the book detail page. */
  detailTitle?: string;
  /** Comma-separated author names for the detail page. */
  authors?: string;
  description: string;
  /** Detail page “About this book” blurb. */
  aboutExcerpt?: string;
  pages?: number;
  language?: string;
  publishedYear?: number;
};

export const LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: "mid-century-modern",
    title: "Mid-Century Modern Designers",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-mid-century-modern.png",
    imageAlt: "Mid-Century Modern Designers",
    categorySlug: "book-section",
    author: "Various Authors",
    description:
      "A visual survey of mid-century modern design pioneers, covering furniture, graphics, and industrial design from the post-war era through the 1960s.",
    pages: 256,
    language: "English",
    publishedYear: 2018,
  },
  {
    id: "secret-lives-of-color",
    title: "The Secret Lives of Color",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-secret-lives-of-color.png",
    imageAlt: "The Secret Lives of Color by Kassia St Clair",
    categorySlug: "book-section",
    author: "Kassia St Clair",
    description:
      "A vivid history of seventy-five shades, dyes, and hues — from art and fashion to politics and science — that reveals how color shapes the world around us.",
    pages: 320,
    language: "English",
    publishedYear: 2016,
  },
  {
    id: "design-dk",
    title: "Design",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-design-dk.png",
    imageAlt: "Design by DK",
    categorySlug: "book-section",
    author: "DK",
    description:
      "An accessible introduction to design thinking, visual language, and creative problem-solving across product, graphic, and spatial disciplines.",
    pages: 352,
    language: "English",
    publishedYear: 2019,
  },
  {
    id: "editing-by-design",
    title: "Editing by Design",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-editing-by-design.png",
    detailImageSrc: "/library/books/book-editing-by-design-detail.png",
    imageAlt: "Editing by Design by Jan V. White",
    categorySlug: "articles-section",
    author: "Jan V. White",
    detailTitle:
      "Editing by Design: The Classic Guide to Word-And-Picture Communication for Art Directors, Editors, Designers, and Students",
    authors: "Jan V. White, Alex W. White",
    description:
      "A classic guide to editorial design and visual storytelling for magazines, books, and publications — focused on clarity, rhythm, and reader experience.",
    aboutExcerpt:
      "Revised with the careful attention of widely respected author and professor of graphic design Alex W. White, Editing by Design, Fourth Edition, describes how both word people and design people have the same task: to reveal the true core of each mess",
    pages: 232,
    language: "English",
    publishedYear: 1990,
  },
  {
    id: "interior-design-handbook",
    title: "The Interior Design Handbook",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-interior-design-handbook.png",
    imageAlt: "The Interior Design Handbook by Frida Ramstedt",
    categorySlug: "book-section",
    author: "Frida Ramstedt",
    description:
      "Practical advice on furnishing, styling, and planning interior spaces — from layout and lighting to materials and finishing touches.",
    pages: 240,
    language: "English",
    publishedYear: 2020,
  },
  {
    id: "green-portrait",
    title: "Portrait Study",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-green-portrait.png",
    imageAlt: "Green portrait book cover",
    categorySlug: "articles-section",
    author: "Studio Archive",
    description:
      "A curated collection of portrait studies exploring composition, color, and character in contemporary illustration and photography.",
    pages: 128,
    language: "English",
    publishedYear: 2021,
  },
  {
    id: "blue-day-film",
    title: "blue day. film book",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-blue-day-film.png",
    imageAlt: "blue day film book",
    categorySlug: "book-section",
    author: "Independent Press",
    description:
      "A film-inspired visual book blending stills, typography, and narrative fragments — a mood piece for designers and image-makers.",
    pages: 96,
    language: "English",
    publishedYear: 2022,
  },
  {
    id: "work",
    title: "WORK",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-work.png",
    imageAlt: "WORK book cover",
    categorySlug: "book-section",
    author: "Creative Collective",
    description:
      "Essays and case studies on creative practice, studio culture, and the craft of making meaningful work in design and the arts.",
    pages: 200,
    language: "English",
    publishedYear: 2020,
  },
  {
    id: "kafka-dream",
    title: "Franz Kafka — Dream",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-kafka-dream.png",
    imageAlt: "Franz Kafka Dream book cover",
    categorySlug: "book-section",
    author: "Franz Kafka",
    description:
      "A special edition exploring Kafka's dreamlike prose with accompanying visual interpretations for readers of literature and design alike.",
    pages: 176,
    language: "English",
    publishedYear: 2017,
  },
  {
    id: "louis-vuitton",
    title: "Louis Vuitton",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-louis-vuitton.png",
    imageAlt: "Louis Vuitton creative edition book",
    categorySlug: "references-materials",
    author: "Louis Vuitton",
    description:
      "A reference volume on the house's creative heritage — fashion, travel, craftsmanship, and collaborations across decades of brand storytelling.",
    pages: 400,
    language: "English",
    publishedYear: 2019,
  },
  {
    id: "doodle-school",
    title: "Doodle School",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-doodle-school.png",
    imageAlt: "Doodle School by Jon Burgerman",
    categorySlug: "book-section",
    author: "Jon Burgerman",
    description:
      "A playful guide to doodling, character design, and loose drawing — ideal for warming up creativity and building a daily sketch habit.",
    pages: 160,
    language: "English",
    publishedYear: 2018,
  },
  {
    id: "pink-ovals",
    title: "Pink Ovals",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-pink-ovals.png",
    imageAlt: "Pink abstract book cover",
    categorySlug: "podcasts-section",
    author: "Audio & Visual Lab",
    description:
      "Companion material to a podcast series on abstract form and color — transcripts, notes, and visual references for each episode.",
    pages: 112,
    language: "English",
    publishedYear: 2023,
  },
  {
    id: "futurism",
    title: "Futurism",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-futurism.png",
    imageAlt: "Futurism book cover",
    categorySlug: "articles-section",
    author: "Art History Press",
    description:
      "Articles and essays on the Futurist movement in art, typography, and technology — with archival imagery and critical commentary.",
    pages: 192,
    language: "English",
    publishedYear: 2015,
  },
  {
    id: "selfhood",
    title: "Selfhood Artisthood Fatherhood",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-selfhood.png",
    imageAlt: "Selfhood Artisthood Fatherhood book cover",
    categorySlug: "articles-section",
    author: "Contemporary Voices",
    description:
      "Personal essays on identity, creative life, and parenthood — written by artists navigating studio practice and family.",
    pages: 224,
    language: "English",
    publishedYear: 2021,
  },
  {
    id: "korean-toc",
    title: "Korean Design Index",
    priceLabel: "Free",
    imageSrc: "/library/grid-books/book-korean-toc.png",
    imageAlt: "Korean design book table of contents",
    categorySlug: "references-materials",
    author: "Design Index Editors",
    description:
      "A reference index of contemporary Korean design studios, products, and visual culture — organized for research and inspiration.",
    pages: 320,
    language: "English",
    publishedYear: 2022,
  },
];

export function getLibraryBookById(id: string): LibraryBook | undefined {
  return LIBRARY_BOOKS.find((book) => book.id === id);
}

export function getLibraryBooksByCategory(categorySlug: string): LibraryBook[] {
  return LIBRARY_BOOKS.filter((book) => book.categorySlug === categorySlug);
}

export function getRelatedLibraryBooks(book: LibraryBook, limit = 4): LibraryBook[] {
  return LIBRARY_BOOKS.filter(
    (item) => item.categorySlug === book.categorySlug && item.id !== book.id
  ).slice(0, limit);
}

export function searchLibraryBooks(query: string): LibraryBook[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return LIBRARY_BOOKS.filter((book) => {
    const haystack = `${book.title} ${book.detailTitle ?? ""} ${book.author} ${book.authors ?? ""} ${book.description} ${book.imageAlt}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function getBookDetailTitle(book: LibraryBook): string {
  return book.detailTitle ?? book.title;
}

export function getBookAuthorsLabel(book: LibraryBook): string {
  return `Author/s: ${book.authors ?? book.author}`;
}

export function getBookDetailImageSrc(book: LibraryBook): string {
  return book.detailImageSrc ?? book.imageSrc;
}

export function getBookAboutExcerpt(book: LibraryBook): string {
  return book.aboutExcerpt ?? book.description;
}
