"use client";

import { useRouter } from "next/navigation";
import { AddCard } from "../components/AddCard";

export function MentorsAddCard() {
  const router = useRouter();
  return <AddCard label="Add Mentor" onClick={() => router.push("/admin/content/mentors/new")} />;
}
