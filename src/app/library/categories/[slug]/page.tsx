import { notFound } from "next/navigation";
import { LearnCoursesSidebar } from "@/components/learn/LearnCoursesSidebar";
import { LibraryArticlesSection } from "@/components/library/LibraryArticlesSection";
import { LibraryCategoryMaterialsSection } from "@/components/library/LibraryCategoryMaterialsSection";
import { LibraryPodcastsSection } from "@/components/library/LibraryPodcastsSection";
import {
  buildLibrarySidebarCategories,
  getLibraryCategoryBySlug,
} from "@/components/library/library-categories";
import { getLibraryBooksByCategory } from "@/components/library/library-books";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const READY_CATEGORY_SLUGS = new Set([
  "book-section",
  "podcasts-section",
  "articles-section",
]);

function LibraryCategoryPlaceholder({ title }: { title: string }) {
  return (
    <div className="min-w-0 px-[27px]">
      <h1
        className="m-0 text-black"
        style={{
          fontFamily: pangeaFont,
          fontSize: "36px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
        }}
      >
        {title}
      </h1>
      <p
        className="mt-8 max-w-xl text-[20px] leading-relaxed text-black/60"
        style={{ fontFamily: pangeaFont }}
      >
        This section is coming soon.
      </p>
    </div>
  );
}

export default async function LibraryCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getLibraryCategoryBySlug(slug);
  if (!category) notFound();

  const sidebarCategories = buildLibrarySidebarCategories();
  const isReady = READY_CATEGORY_SLUGS.has(slug);
  const isBleedSection =
    slug === "podcasts-section" || slug === "articles-section";

  return (
    <div className="min-w-0 max-w-full overflow-x-clip bg-white pb-16 pt-[50px] font-sans">
      <div
        className={`w-full min-w-0 pl-6 sm:pl-8 lg:pl-10 ${
          isBleedSection ? "pr-0" : "mx-auto max-w-[1400px]"
        }`}
      >
        <div className="flex min-w-0 max-w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-[55px]">
          <LearnCoursesSidebar
            categories={sidebarCategories}
            activeCategoryKey={category.key}
            showCoursesSection={false}
          />

          <main className="min-w-0 flex-1 overflow-x-clip">
            {slug === "podcasts-section" ? (
              <LibraryPodcastsSection />
            ) : slug === "articles-section" ? (
              <LibraryArticlesSection />
            ) : isReady ? (
              <LibraryCategoryMaterialsSection
                categoryTitle={slug === "book-section" ? "BOOKS" : category.label}
                books={getLibraryBooksByCategory(slug)}
              />
            ) : (
              <LibraryCategoryPlaceholder title={category.label} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
