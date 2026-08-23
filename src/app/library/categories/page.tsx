import { redirect } from "next/navigation";
import { LIBRARY_CATEGORIES } from "@/components/library/library-categories";

export default function LibraryCategoriesIndexPage() {
  if (LIBRARY_CATEGORIES.length === 0) {
    redirect("/library");
  }
  redirect(`/library/categories/${LIBRARY_CATEGORIES[0].slug}`);
}
