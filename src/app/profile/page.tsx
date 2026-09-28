import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSectionTabs } from "@/components/profile/ProfileSectionTabs";
import { emptyWeeklyActivitySummary } from "@/lib/learning-activity";
import { getContinueLearningCardsForUser } from "@/server/home/continue-learning.service";
import { getUserAggregateLearningProgressPercent } from "@/server/home/user-learning-progress.service";
import { getWeeklyActivitySummary } from "@/server/home/learning-activity.service";
import { readUserProfileFromDb } from "@/server/user/readProfile";
import { markPage } from "@/server/observability/query-timing";

const FALLBACK_BIO =
  "I'm a working professional creative in the graphic design industry. I work as a concept artist and freelance illustrator. I've worked in-house at an animation studio but currently, work from home.";

const FALLBACK_SKILLS = [
  "DIGITAL ILLUSTRATION",
  "GRAPHIC DESIGN",
  "CONCEPT ART",
];

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; edit?: string }>;
}) {
  markPage("/profile");
  const session = await auth();
  if (!session?.user) redirect("/login?next=/profile");

  const userId = session.user.id as string;
  const sessionUser = session.user as {
    name?: string | null;
    email?: string | null;
    profession?: string | null;
  };

  const dbUser = await readUserProfileFromDb(userId);

  const dbName = dbUser?.name?.trim() || sessionUser.name?.trim() || "User";
  const dbProfession =
    dbUser?.profession?.trim() ||
    sessionUser.profession?.trim() ||
    "Graphic Designer";
  const dbBio = dbUser?.bio?.trim() || FALLBACK_BIO;
  const dbSkills =
    dbUser?.skills && dbUser.skills.length > 0
      ? dbUser.skills
      : FALLBACK_SKILLS;

  const email = sessionUser.email?.trim() || "";

  const params = await searchParams;
  const initialTab =
    params.tab === "Learning" ||
    params.tab === "Activity" ||
    params.tab === "Projects"
      ? params.tab
      : "Learning";

  const now = new Date();
  const [continueLearningCourses, weeklyActivity, learningProgressPercent] = await Promise.all([
    getContinueLearningCardsForUser(userId, 3).catch(() => []),
    getWeeklyActivitySummary(userId, now).catch(() =>
      emptyWeeklyActivitySummary(now)
    ),
    getUserAggregateLearningProgressPercent(userId).catch(() => 0),
  ]);

  return (
    <div className="profile-page relative w-full max-lg:pt-0 lg:pt-[51px]">
      <ProfileHeader
        photoSrc="/profile/profile-photo.png"
        initialName={dbName}
        email={email}
        initialProfession={dbProfession}
        initialBio={dbBio}
        initialSkills={dbSkills}
      />

      <Suspense fallback={null}>
        <ProfileSectionTabs
          initialTab={initialTab}
          continueLearningCourses={continueLearningCourses}
          weeklyActivity={weeklyActivity}
          activityHighlightDayIndex={now.getUTCDay()}
          learningProgressPercent={learningProgressPercent}
        />
      </Suspense>
    </div>
  );
}
