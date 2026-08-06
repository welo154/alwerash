import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSectionTabs } from "@/components/profile/ProfileSectionTabs";
import { emptyWeeklyActivitySummary } from "@/lib/learning-activity";
import { getContinueLearningCardsForUser } from "@/server/home/continue-learning.service";
import { getWeeklyActivitySummary } from "@/server/home/learning-activity.service";
import { readUserProfileFromDb } from "@/server/user/readProfile";

const FALLBACK_BIO =
  "I'm a working professional creative in the graphic design industry. I work as a concept artist and freelance illustrator. I've worked in-house at an animation studio but currently, work from home.";

const FALLBACK_SKILLS = [
  "DIGITAL ILLUSTRATION",
  "GRAPHIC DESIGN",
  "CONCEPT ART",
];

export default async function ProfilePage() {
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

  const now = new Date();
  const [continueLearningCourses, weeklyActivity] = await Promise.all([
    getContinueLearningCardsForUser(userId, 3).catch(() => []),
    getWeeklyActivitySummary(userId, now).catch(() =>
      emptyWeeklyActivitySummary(now)
    ),
  ]);

  return (
    <div className="relative w-full" style={{ paddingTop: 51 }}>
      <ProfileHeader
        photoSrc="/profile/profile-photo.png"
        initialName={dbName}
        email={email}
        initialProfession={dbProfession}
        initialBio={dbBio}
        initialSkills={dbSkills}
      />

      <ProfileSectionTabs
        continueLearningCourses={continueLearningCourses}
        weeklyActivity={weeklyActivity}
        activityHighlightDayIndex={now.getUTCDay()}
      />
    </div>
  );
}
