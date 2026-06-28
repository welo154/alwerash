// file: src/app/tracks/page.tsx
import { publicListTracks } from "@/server/content/public.service";

export default async function TracksPage() {
  const tracks = await publicListTracks();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Tracks</h1>
      <ul className="space-y-2">
        {tracks.map((t) => (
          <li key={t.id} className="rounded border p-3">
            <a className="underline" href={`/tracks/${t.slug}`}>
              {t.title}
            </a>
            {t.description ? <p className="text-sm mt-1">{t.description}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}