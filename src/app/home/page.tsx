import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoggedInHome } from "@/components/home/LoggedInHome";
import { getContinueLearningCardsForUser } from "@/server/home/continue-learning.service";
import { getWeeklyActivitySummary } from "@/server/home/learning-activity.service";
import { publicGetHomeTrackExplorerBundle, publicListLandingMostsMentors } from "@/server/content/public.service";
import { readUserProfessionFromDb } from "@/server/user/readProfession";
import type { HomeTrackExplorerBundle } from "@/types/home-track-explorer";

export const metadata = {
  title: "Home – Alwerash",
};

const EMPTY_TRACK_EXPLORER: HomeTrackExplorerBundle = {
  heroTracks: [],
  trackPills: [],
  trackPillRow1: [],
  trackPillRow2: [],
  slidesByFilter: {
    featured: [],
    topRated: [],
    activity: [],
  },
  courseTilesByTrackSlug: {},
};

export default async function LoggedInHomePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?next=/home");
  }

  const roles = (session.user.roles as string[]) ?? [];
  if (roles.includes("ADMIN")) redirect("/admin");

  const userId = session.user.id as string;
  const userName = session.user.name ?? "Learner";
  const userImage = (session.user as { image?: string | null }).image ?? null;

  const professionRaw = await readUserProfessionFromDb(userId);
  const profession = professionRaw?.trim() || null;
  /** Track / focus only — country is not shown here (avoids “EG” etc. on the welcome line). */
  const subtitleLeftOfEdit = profession || "Frontend Developer";

  const now = new Date();

  const [continueLearningCourses, landingMostsMentors, trackBundle, weeklyActivity] =
    await Promise.all([
      getContinueLearningCardsForUser(userId, 3).catch((err) => {
        console.warn("[home] continue learning unavailable", err instanceof Error ? err.message : err);
        return [];
      }),
      publicListLandingMostsMentors().catch((err) => {
        console.warn("[home] mosts mentors unavailable", err instanceof Error ? err.message : err);
        return [];
      }),
      publicGetHomeTrackExplorerBundle().catch((err) => {
        console.warn("[home] track explorer unavailable", err instanceof Error ? err.message : err);
        return EMPTY_TRACK_EXPLORER;
      }),
      getWeeklyActivitySummary(userId, now),
    ]);

  return (
    <LoggedInHome
      userName={userName}
      userImage={userImage}
      subtitleLeftOfEdit={subtitleLeftOfEdit}
      continueLearningCourses={continueLearningCourses}
      landingMostsMentors={landingMostsMentors}
      trackExplorer={trackBundle}
      weeklyActivity={weeklyActivity}
      activityHighlightDayIndex={now.getUTCDay()}
    />
  );
}
