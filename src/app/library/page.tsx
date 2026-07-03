import { LibraryFeaturedBook } from "@/components/library/LibraryFeaturedBook";
import { LibraryWelcomeSection } from "@/components/library/LibraryWelcomeSection";
import { LibraryCategoryGrid } from "@/components/library/LibraryCategoryGrid";
import { LibraryTracksSwiperSection } from "@/components/library/LibraryTracksSwiperSection";
import { LibraryBookGridSection } from "@/components/library/LibraryBookGridSection";

export default function LibraryPage() {
  return (
    <div className="w-full">
      <LibraryFeaturedBook />
      <LibraryWelcomeSection />
      <LibraryCategoryGrid />
      <LibraryTracksSwiperSection />
      <LibraryBookGridSection />
    </div>
  );
}
