import { redirect } from "next/navigation";

/** Legacy route — open the check-email modal on the register page instead. */
export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; checkEmail?: string }>;
}) {
  const params = await searchParams;
  const email = (params.email ?? params.checkEmail ?? "").trim();
  const url = email
    ? `/register?checkEmail=${encodeURIComponent(email)}`
    : "/register?checkEmail=";
  redirect(url);
}
