/**
 * Prisma seed script: creates (or updates) the first admin user.
 *
 * Run with: npx prisma db seed
 *
 * Required env: ADMIN_EMAIL, ADMIN_PASSWORD
 * Optional env: ADMIN_NAME (default: "Admin")
 *
 * - If no user exists with that email, creates the user with ADMIN role.
 * - If the user exists, updates name and password hash, and ensures ADMIN role exists.
 */
import {
  PrismaClient,
  Role,
  LessonType,
  EntitlementProduct,
  EntitlementStatus,
} from "@prisma/client";
import { hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient();

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

async function main() {
  const email = mustGetEnv("ADMIN_EMAIL").toLowerCase().trim();
  const password = mustGetEnv("ADMIN_PASSWORD");
  const name = (process.env.ADMIN_NAME ?? "Admin").trim() || "Admin";

  const passwordHash = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      emailVerified: new Date(),
    },
    create: {
      email,
      name,
      passwordHash,
      emailVerified: new Date(),
      roles: {
        create: { role: Role.ADMIN },
      },
    },
    select: { id: true, email: true, name: true },
  });

  // Ensure ADMIN role exists even if user was created without it (e.g. via OAuth)
  await prisma.userRole.upsert({
    where: {
      userId_role: { userId: admin.id, role: Role.ADMIN },
    },
    update: {},
    create: { userId: admin.id, role: Role.ADMIN },
  });

  console.log("Seeded admin:", admin.email);

  // Test learner with active entitlement (optional - use ADMIN_EMAIL + ADMIN_PASSWORD to test)
  // Admin bypasses subscription check; to test learner flow, add a learner user and entitlement

  // Dummy School
  const school = await prisma.school.upsert({
    where: { slug: "design-creative" },
    update: {},
    create: {
      title: "Design & Creative",
      slug: "design-creative",
      description: "Learn design and creative skills for modern workflows.",
      order: 0,
      published: true,
    },
  });
  console.log("Seeded school:", school.title);

  // Add cover_image to tracks if missing (for environments where migration didn't run)
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "cover_image" TEXT'
    );
  } catch (e) {
    // Ignore - column may already exist or pooled connection may not support DDL
  }

  // Dummy Tracks with cover images (Unsplash)
  const trackData = [
    { title: "UI/UX Design", slug: "ui-ux-design", description: "User interface and experience design.", order: 0, coverImage: "https://images.unsplash.com/photo-1561070791-2526d38794a5?w=800&q=80" },
    { title: "Graphic Design", slug: "graphic-design", description: "Visual design and branding.", order: 1, coverImage: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=80" },
    { title: "Motion Design", slug: "motion-design", description: "Animation and motion graphics.", order: 2, coverImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80" },
  ];

  const tracks = [];
  for (const t of trackData) {
    const track = await prisma.track.upsert({
      where: { slug: t.slug },
      update: { coverImage: t.coverImage },
      create: {
        schoolId: school.id,
        title: t.title,
        slug: t.slug,
        description: t.description,
        coverImage: t.coverImage,
        order: t.order,
        published: true,
      },
    });
    tracks.push(track);
    console.log("Seeded track:", track.title);
  }

  // Dummy Courses with cover images (Unsplash)
  const courseData = [
    { trackIdx: 0, title: "Figma Fundamentals", summary: "Master the basics of Figma for UI design.", order: 0, coverImage: "https://images.unsplash.com/photo-1561070791-2526d38794a5?w=800&q=80" },
    { trackIdx: 0, title: "Prototyping in Figma", summary: "Create interactive prototypes.", order: 1, coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" },
    { trackIdx: 1, title: "Logo Design Masterclass", summary: "Design memorable logos and brand identities.", order: 0, coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80" },
    { trackIdx: 1, title: "Typography Fundamentals", summary: "Typography principles and best practices.", order: 1, coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
    { trackIdx: 2, title: "After Effects Basics", summary: "Get started with motion design.", order: 0, coverImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80" },
    { trackIdx: 2, title: "Lottie Animations", summary: "Create lightweight JSON animations.", order: 1, coverImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80" },
  ];

  for (const c of courseData) {
    const existing = await prisma.course.findFirst({
      where: { trackId: tracks[c.trackIdx].id, title: c.title },
    });
    if (existing) {
      await prisma.course.update({
        where: { id: existing.id },
        data: { coverImage: c.coverImage },
      });
      console.log("Updated course:", c.title);
      continue;
    }
    const course = await prisma.course.create({
      data: {
        trackId: tracks[c.trackIdx].id,
        title: c.title,
        summary: c.summary,
        coverImage: c.coverImage,
        order: c.order,
        published: true,
      },
    });
    console.log("Seeded course:", course.title);
  }

  // Add some courses to "New" and "Most played" (requires featured_* columns from migration)
  const published = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, title: true },
    take: 6,
  });
  const featuredNew = published.slice(0, 3);
  const featuredMostPlayed = published.slice(0, 4);
  for (let i = 0; i < featuredNew.length; i++) {
    try {
      await prisma.course.update({
        where: { id: featuredNew[i].id },
        data: { featuredNewOrder: i + 1 },
      });
      console.log("Added to New:", featuredNew[i].title, "(order", i + 1 + ")");
    } catch {
      // Columns may not exist yet (run db:deploy)
    }
  }
  for (let i = 0; i < featuredMostPlayed.length; i++) {
    try {
      await prisma.course.update({
        where: { id: featuredMostPlayed[i].id },
        data: { featuredMostPlayedOrder: i + 1 },
      });
      console.log("Added to Most played:", featuredMostPlayed[i].title, "(order", i + 1 + ")");
    } catch {
      // Columns may not exist yet
    }
  }

  // Mentors (male mentors for the platform)
  const mentorData = [
    {
      name: "Omar Hassan",
      certificateName: "Certified UI/UX Mentor",
      aboutMe: "Senior product designer with 10+ years guiding teams. Passionate about design systems and accessibility.",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    },
    {
      name: "Karim Al-Rashid",
      certificateName: "Graphic Design Mentor",
      aboutMe: "Brand and identity designer. I help creatives build strong visual narratives and portfolio pieces.",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    },
    {
      name: "Youssef Mahmoud",
      certificateName: "Motion Design Mentor",
      aboutMe: "Motion designer and animator. Focus on After Effects, Lottie, and bringing interfaces to life.",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    },
    {
      name: "Tariq Nasser",
      certificateName: "Design Leadership Mentor",
      aboutMe: "Design lead and mentor. I support designers in career growth, critique, and shipping at scale.",
      photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80",
    },
  ];

  try {
    for (const m of mentorData) {
      const existing = await prisma.mentor.findFirst({ where: { name: m.name } });
      if (existing) {
        await prisma.mentor.update({
          where: { id: existing.id },
          data: { certificateName: m.certificateName, aboutMe: m.aboutMe, photo: m.photo },
        });
        console.log("Updated mentor:", m.name);
      } else {
        await prisma.mentor.create({ data: m });
        console.log("Seeded mentor:", m.name);
      }
    }
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2021") {
      console.log("Mentors table not found — run 'npx prisma migrate deploy' then 'npx prisma db seed' again to add mentors.");
    } else {
      throw e;
    }
  }

  /**
   * Optional dev learner (e.g. Mazen): set MAZEN_SEED_PASSWORD to upsert the account,
   * grant ALL_ACCESS, add two lessons per course on the first 3 published courses (if missing),
   * and seed lesson progress so /home shows three "Continue learning" cards.
   * Example: MAZEN_SEED_PASSWORD=your-secret npx prisma db seed
   */
  const mazenEmail = (process.env.MAZEN_SEED_EMAIL ?? "mazenhesham172@gmail.com")
    .toLowerCase()
    .trim();
  const mazenPassword = process.env.MAZEN_SEED_PASSWORD?.trim();
  if (mazenPassword) {
    const mazenHash = await hashPassword(mazenPassword);
    const mazen = await prisma.user.upsert({
      where: { email: mazenEmail },
      update: {
        name: "Mazen Hesham",
        passwordHash: mazenHash,
        emailVerified: new Date(),
      },
      create: {
        email: mazenEmail,
        name: "Mazen Hesham",
        passwordHash: mazenHash,
        emailVerified: new Date(),
        roles: { create: { role: Role.LEARNER } },
      },
      select: { id: true },
    });
    await prisma.userRole.upsert({
      where: { userId_role: { userId: mazen.id, role: Role.LEARNER } },
      update: {},
      create: { userId: mazen.id, role: Role.LEARNER },
    });
    await prisma.entitlement.upsert({
      where: {
        userId_product: {
          userId: mazen.id,
          product: EntitlementProduct.ALL_ACCESS,
        },
      },
      update: { status: EntitlementStatus.ACTIVE, expiresAt: null },
      create: {
        userId: mazen.id,
        product: EntitlementProduct.ALL_ACCESS,
        status: EntitlementStatus.ACTIVE,
        expiresAt: null,
      },
    });

    const instructorNames = [
      "Ahmad Khaled Hussein",
      "Sara El-Masry",
      "Omar Fathy",
    ];
    const seedCourses = await prisma.course.findMany({
      where: { published: true },
      orderBy: [{ track: { order: "asc" } }, { order: "asc" }, { createdAt: "asc" }],
      take: 3,
      select: { id: true, title: true },
    });

    for (let i = 0; i < seedCourses.length; i++) {
      const c = seedCourses[i]!;
      await prisma.course.update({
        where: { id: c.id },
        data: { instructorName: instructorNames[i % instructorNames.length] },
      });

      let mod = await prisma.module.findFirst({
        where: { courseId: c.id },
        orderBy: { order: "asc" },
      });
      if (!mod) {
        mod = await prisma.module.create({
          data: { courseId: c.id, title: "Foundation", order: 0 },
        });
      }
      const publishedCount = await prisma.lesson.count({
        where: { moduleId: mod.id, published: true },
      });
      if (publishedCount < 2) {
        const maxOrder = await prisma.lesson.aggregate({
          where: { moduleId: mod.id },
          _max: { order: true },
        });
        let nextOrder = (maxOrder._max.order ?? -1) + 1;
        if (publishedCount === 0) {
          await prisma.lesson.create({
            data: {
              moduleId: mod.id,
              title: "Orientation",
              type: LessonType.ARTICLE,
              order: nextOrder++,
              published: true,
            },
          });
        }
        if (publishedCount <= 1) {
          await prisma.lesson.create({
            data: {
              moduleId: mod.id,
              title: "Core practice",
              type: LessonType.ARTICLE,
              order: nextOrder,
              published: true,
            },
          });
        }
      }

      const lessons = await prisma.lesson.findMany({
        where: { module: { courseId: c.id }, published: true },
        orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
        take: 2,
        select: { id: true },
      });
      const [firstLesson, secondLesson] = lessons;
      if (firstLesson && secondLesson) {
        const now = new Date();
        await prisma.lessonProgress.upsert({
          where: {
            userId_lessonId: { userId: mazen.id, lessonId: firstLesson.id },
          },
          create: {
            userId: mazen.id,
            lessonId: firstLesson.id,
            completedAt: now,
            lastPositionSeconds: 0,
          },
          update: { completedAt: now },
        });
        await prisma.lessonProgress.upsert({
          where: {
            userId_lessonId: { userId: mazen.id, lessonId: secondLesson.id },
          },
          create: {
            userId: mazen.id,
            lessonId: secondLesson.id,
            lastPositionSeconds: 120,
          },
          update: { lastPositionSeconds: 120, completedAt: null },
        });
      }
    }
    console.log("Seeded Mazen learner + continue-learning fixtures:", mazenEmail);
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
