import { notFound } from "next/navigation";
import { LearnCoursesSidebar } from "@/components/learn/LearnCoursesSidebar";
import { LibraryCategoryMaterialsSection } from "@/components/library/LibraryCategoryMaterialsSection";
import {
  buildLibrarySidebarCategories,
  getLibraryCategoryBySlug,
} from "@/components/library/library-categories";
import { getLibraryBooksByCategory } from "@/components/library/library-books";

export default async function LibraryCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getLibraryCategoryBySlug(slug);
  if (!category) notFound();

  const books = getLibraryBooksByCategory(slug);
  if (books.length === 0) notFound();
  const sidebarCategories = buildLibrarySidebarCategories();

  return (
    <div className="min-w-0 max-w-full overflow-x-clip bg-white pb-16 pt-[50px] font-sans">
      <div className="mx-auto w-full min-w-0 max-w-[1400px] pl-6 sm:pl-8 lg:pl-10">
        <div className="flex min-w-0 max-w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-[55px]">
          <LearnCoursesSidebar
            categories={sidebarCategories}
            activeCategoryKey={category.key}
            showCoursesSection={false}
          />

          <main className="min-w-0 flex-1">
            <LibraryCategoryMaterialsSection
              categoryTitle={category.label}
              books={books}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
