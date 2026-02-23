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
import { PrismaClient, Role } from "@prisma/client";
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
    },
    create: {
      email,
      name,
      passwordHash,
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
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
