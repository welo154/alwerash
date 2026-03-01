import {
  HeroSection,
  FeaturedCoursesSection,
} from "@/components/landing";
import { GsapAnimationLayer } from "@/components/gsap/GsapAnimationLayer";
import { publicListTracks } from "@/server/content/public.service";

/**
 * Landing page - home.
 * Hero (with tracks + stats bar), courses section (NEW + MOST PLAYED + modal).
 */
export default async function LandingPage() {
  const tracks = await publicListTracks();
  const heroTracks: { id: string; title: string; slug: string }[] = Array.isArray(tracks)
    ? tracks.map((t) => ({ id: t.id, title: t.title, slug: t.slug }))
    : [];

  return (
    <div className="font-sans">
      <HeroSection tracks={heroTracks} />
      <FeaturedCoursesSection />
      <GsapAnimationLayer />
    </div>
  );
}
