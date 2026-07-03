import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LibraryBookDetailView } from "@/components/library/LibraryBookDetailView";
import { getLibraryBookById } from "@/components/library/library-books";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = getLibraryBookById(id);
  if (!book) return { title: "Book not found" };
  return { title: `${book.title} | Library` };
}

export default async function LibraryBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = getLibraryBookById(id);
  if (!book) notFound();

  return <LibraryBookDetailView book={book} />;
}
