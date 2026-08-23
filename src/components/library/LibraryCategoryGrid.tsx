import {
  LibraryCategoryCard,
  type LibraryCategoryCardProps,
} from "./LibraryCategoryCard";
import { LibraryArticleCardVisual } from "./LibraryArticleCardVisual";
import { LibraryPodcastHomePanelVisual } from "./LibraryPodcastCardVisual";

const CATEGORY_CARDS: LibraryCategoryCardProps[] = [
  {
    titleLines: [
      [{ text: "BOOK", arrowAfter: true }],
      [{ text: "SECTION" }],
    ],
    imageSrc: "/library/category-cards/book-section.png",
    imageAlt: "The Secret Lives of Color book cover",
    href: "/library/categories/book-section",
  },
  {
    titleLines: [
      [{ text: "ARTICLES" }],
      [{ text: "SECTION", arrowAfter: true }],
    ],
    href: "/library/categories/articles-section",
    rightVisual: (
      <div className="flex h-full w-full items-center justify-center">
        <div className="origin-center" style={{ transform: "scale(0.82)" }}>
          <LibraryArticleCardVisual clipId="home-articles" />
        </div>
      </div>
    ),
  },
  {
    titleLines: [
      [{ text: "PODCASTS" }],
      [{ text: "SECTION", arrowAfter: true }],
    ],
    href: "/library/categories/podcasts-section",
    rightVisual: <LibraryPodcastHomePanelVisual />,
  },
  {
    titleLines: [
      [{ text: "REFERENCES &" }],
      [{ text: "MATERIALS", arrowAfter: true }],
    ],
    imageSrc: "/library/category-cards/references-section.png",
    imageAlt: "The Interior Design Handbook book cover",
    href: "/library/categories/references-materials",
  },
];

export function LibraryCategoryGrid() {
  return (
    <section className="mt-[128px] ml-[137px]" aria-label="Library categories">
      <div className="grid w-fit grid-cols-2 gap-[40px]">
        {CATEGORY_CARDS.map((card) => (
          <LibraryCategoryCard
            key={card.href}
            titleLines={card.titleLines}
            imageSrc={card.imageSrc}
            imageAlt={card.imageAlt}
            href={card.href}
            rightVisual={card.rightVisual}
          />
        ))}
      </div>
    </section>
  );
}
