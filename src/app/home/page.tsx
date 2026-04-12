import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoggedInHome } from "@/components/home/LoggedInHome";

export const metadata = {
  title: "Home",
};

export default async function LoggedInHomePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?next=/home");
  }
  const roles = (session.user.roles as string[]) ?? [];
  if (roles.includes("ADMIN")) {
    redirect("/admin");
  }

  return <LoggedInHome />;
}
