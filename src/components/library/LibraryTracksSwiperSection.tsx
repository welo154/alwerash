import { LibraryTrackTagsSwiper } from "@/components/library/LibraryTrackTagsSwiper";
import { publicListTracks } from "@/server/content/public.service";

export async function LibraryTracksSwiperSection() {
  const tracks = await publicListTracks();

  if (tracks.length === 0) {
    return null;
  }

  const tags = tracks.map((track) => ({
    slug: track.slug,
    label: track.title.trim().toUpperCase() || "TRACK",
  }));

  const mid = Math.ceil(tags.length / 2);

  return (
    <section className="mt-[136px] w-full min-w-0" aria-label="Library tracks">
      <LibraryTrackTagsSwiper
        row1={tags.slice(0, mid)}
        row2={tags.slice(mid)}
      />
    </section>
  );
}
