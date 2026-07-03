import {
  LibraryCategoryCard,
  type LibraryCategoryCardProps,
} from "./LibraryCategoryCard";

const CATEGORY_CARDS: LibraryCategoryCardProps[] = [
  {
    titleLines: [
      [{ text: "BOOK", arrowAfter: true }],
      [{ text: "SECTION" }],
    ],
    imageSrc: "/library/category-cards/book-section.png",
    imageAlt: "The Secret Lives of Color book cover",
  },
  {
    titleLines: [
      [{ text: "ARTICLES" }],
      [{ text: "SECTION", arrowAfter: true }],
    ],
    imageSrc: "/library/category-cards/articles-section.png",
    imageAlt: "Illustrated articles preview",
  },
  {
    titleLines: [
      [{ text: "PODCASTS" }],
      [{ text: "SECTION", arrowAfter: true }],
    ],
    imageSrc: "/library/category-cards/podcasts-section.png",
    imageAlt: "Louis Vuitton book cover",
  },
  {
    titleLines: [
      [{ text: "REFERENCES &" }],
      [{ text: "MATERIALS", arrowAfter: true }],
    ],
    imageSrc: "/library/category-cards/references-section.png",
    imageAlt: "The Interior Design Handbook book cover",
  },
];

export function LibraryCategoryGrid() {
  return (
    <section className="mt-[128px] ml-[137px]" aria-label="Library categories">
      <div className="grid w-fit grid-cols-2 gap-[40px]">
        {CATEGORY_CARDS.map((card, index) => (
          <LibraryCategoryCard
            key={index}
            titleLines={card.titleLines}
            imageSrc={card.imageSrc}
            imageAlt={card.imageAlt}
          />
        ))}
      </div>
    </section>
  );
}
