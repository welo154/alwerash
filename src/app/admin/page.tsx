// file: src/app/admin/page.tsx
import { redirect } from "next/navigation";
import { requireRole } from "@/server/auth/require";

export default async function AdminPage() {
  await requireRole(["ADMIN"]); // defense-in-depth (middleware also blocks)
  redirect("/admin/content/tracks");
}
