/**
 * Creates the mentors table (if missing) and seeds the 4 male mentors.
 * Use when migrate deploy fails but the app/seed can connect (e.g. Supabase pooler vs direct).
 *
 * Run: npm run scripts:setup-mentors
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CREATE_MENTORS_TABLE = `
CREATE TABLE IF NOT EXISTS "mentors" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "photo" TEXT,
  "certificate_name" TEXT,
  "about_me" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "mentors_pkey" PRIMARY KEY ("id")
);
`;

const mentorData = [
  {
    name: "Omar Hassan",
    certificateName: "Certified UI/UX Mentor",
    aboutMe:
      "Senior product designer with 10+ years guiding teams. Passionate about design systems and accessibility.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Karim Al-Rashid",
    certificateName: "Graphic Design Mentor",
    aboutMe:
      "Brand and identity designer. I help creatives build strong visual narratives and portfolio pieces.",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Youssef Mahmoud",
    certificateName: "Motion Design Mentor",
    aboutMe:
      "Motion designer and animator. Focus on After Effects, Lottie, and bringing interfaces to life.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    name: "Tariq Nasser",
    certificateName: "Design Leadership Mentor",
    aboutMe:
      "Design lead and mentor. I support designers in career growth, critique, and shipping at scale.",
    photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80",
  },
];

async function main() {
  console.log("Creating mentors table if not exists...");
  await prisma.$executeRawUnsafe(CREATE_MENTORS_TABLE);
  console.log("Mentors table ready.");

  for (const m of mentorData) {
    const existing = await prisma.mentor.findFirst({ where: { name: m.name } });
    if (existing) {
      await prisma.mentor.update({
        where: { id: existing.id },
        data: {
          certificateName: m.certificateName,
          aboutMe: m.aboutMe,
          photo: m.photo,
        },
      });
      console.log("Updated mentor:", m.name);
    } else {
      await prisma.mentor.create({ data: m });
      console.log("Seeded mentor:", m.name);
    }
  }
  console.log("Done. Refresh the Mentors page in admin.");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
