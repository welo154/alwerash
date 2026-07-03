import { redirect } from "next/navigation";
import { getLibraryCategoriesWithBooks } from "@/components/library/library-categories";

export default function LibraryCategoriesIndexPage() {
  const categories = getLibraryCategoriesWithBooks();
  if (categories.length === 0) {
    redirect("/library");
  }
  redirect(`/library/categories/${categories[0].slug}`);
}
