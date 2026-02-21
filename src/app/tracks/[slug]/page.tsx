// file: src/app/tracks/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicGetTrackBySlug } from "@/server/content/public.service";
import { AppError } from "@/server/lib/errors";

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let track;
  try {
    track = await publicGetTrackBySlug(slug);
  } catch (e) {
    if (e instanceof AppError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{track.title}</h1>
      {track.description ? <p>{track.description}</p> : null}

      <h2 className="text-xl font-semibold mt-6">Courses</h2>
      <ul className="space-y-2">
        {track.courses.map((c) => (
          <li key={c.id} className="rounded border p-3">
            <Link className="underline" href={`/courses/${c.id}`}>
              {c.title}
            </Link>
            {c.summary ? <p className="text-sm mt-1">{c.summary}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
