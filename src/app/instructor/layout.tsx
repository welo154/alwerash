import { requirePageRole } from "@/server/auth/require";

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  await requirePageRole(["INSTRUCTOR", "ADMIN"], "/instructor");
  return children;
}
