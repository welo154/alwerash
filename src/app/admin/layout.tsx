import { requirePageRole } from "@/server/auth/require";

/** Middleware reads roles from the cookie, which can be stale. This reads the database. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requirePageRole(["ADMIN"], "/admin");
  return children;
}
