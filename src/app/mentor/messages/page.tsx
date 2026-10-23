import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/server/auth/require";
import { mentorListSubmissionMessages } from "@/server/content/mentor.service";

function reviewHref(body: string): string | null {
  const line = body
    .split("\n")
    .map((part) => part.trim())
    .find((part) => part.startsWith("/mentor/submissions/"));
  return line ?? null;
}

export default async function MentorMessagesPage() {
  const session = await requireRole(["MENTOR", "ADMIN"]);
  if (!session.user.id) redirect("/login");

  const messages = await mentorListSubmissionMessages(session.user.id);

  return (
    <div className="p-8">
      <Link href="/mentor" className="text-sm text-slate-600 hover:text-slate-900">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-black">Messages</h1>
      <p className="mt-2 text-sm text-slate-600">
        Assignment submissions from learners on your courses, ready for review and corrections.
      </p>

      <div className="mt-6 space-y-3">
        {messages.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No submission messages yet.
          </p>
        ) : (
          messages.map((message) => {
            const href = reviewHref(message.body);
            const preview = message.body
              .split("\n")
              .filter((line) => !line.trim().startsWith("/mentor/submissions/"))
              .join(" ");
            return (
              <article
                key={message.id}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {message.thread.course?.title ?? "Course"} ·{" "}
                  {message.createdAt.toLocaleString()}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {message.sender.name?.trim() || message.sender.email}
                </p>
                <p className="mt-1 text-sm text-slate-700">{preview}</p>
                {href ? (
                  <Link
                    href={href}
                    className="mt-3 inline-flex text-sm font-medium text-indigo-700 hover:underline"
                  >
                    Open submission to review
                  </Link>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
