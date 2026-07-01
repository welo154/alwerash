import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import {
  catalogCoverUrlForCourse,
  catalogCoverUrlForTrack,
} from "../src/lib/catalog-cover-images";

const prisma = new PrismaClient();

const PHOTO_IDS = [
  "photo-1618005182384-a83a8bd57fbe",
  "photo-1555066931-4365d14bab8c",
  "photo-1582719478250-c89cae4dc85b",
  "photo-1626785774573-4b799315345d",
  "photo-1517694712202-14dd9538aa97",
  "photo-1633356122544-f134324a6cee",
  "photo-1578632767115-351597cf2477",
  "photo-1497215842964-222b430dc094",
  "photo-1521572163474-6864f9cf17ab",
  "photo-1542831371-d531d36971e6",
  "photo-1581291518633-83b4ebd1d83e",
  "photo-1550745165-9bc0b4ffc2ae",
  "photo-1555949963-aa79dcee981c",
  "photo-1516116216624-53e697fedbea",
  "photo-1596464716127-f2a82984de30",
  "photo-1611532736597-de2d4265fba3",
  "photo-1558618666-fcd25c85cd64",
  "photo-1503342217505-b0a15ec3261c",
  "photo-1576566588028-4147f3842f27",
  "photo-1547891654-e66ed7ebb968",
  "photo-1454165804606-c3d57bc86b40",
  "photo-1522202176988-66273c2fd55f",
  "photo-1634942537034-2531766767d1",
  "photo-1611162616475-46b635cb6868",
] as const;

async function checkUrl(url: string): Promise<number> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.status;
  } catch {
    return 0;
  }
}

async function verifyPhotoIds() {
  console.log("Photo ID verification:");
  for (const id of PHOTO_IDS) {
    const url = `https://images.unsplash.com/${id}?w=400&h=400&fit=crop&q=80`;
    const status = await checkUrl(url);
    console.log(`  ${status} ${id}`);
  }
}

async function main() {
  await verifyPhotoIds();
  console.log("");

  const tracks = await prisma.track.findMany({ select: { slug: true, coverImage: true } });
  const courses = await prisma.course.findMany({
    select: { title: true, coverImage: true },
  });

  const urls = new Map<string, string[]>();
  for (const t of tracks) {
    const u = t.coverImage?.trim();
    if (!u) continue;
    const list = urls.get(u) ?? [];
    list.push(`track:${t.slug}`);
    urls.set(u, list);
  }
  for (const c of courses) {
    const u = c.coverImage?.trim();
    if (!u) continue;
    const list = urls.get(u) ?? [];
    list.push(`course:${c.title}`);
    urls.set(u, list);
  }

  const broken: { url: string; status: number; refs: string[] }[] = [];
  for (const [url, refs] of urls) {
    const status = await checkUrl(url);
    if (status < 200 || status >= 400) {
      broken.push({ url, status, refs: refs.slice(0, 3) });
    }
  }

  console.log(`Checked ${urls.size} unique URLs`);
  console.log(`Broken: ${broken.length}`);
  for (const b of broken) {
    console.log(`\n[${b.status}] ${b.url}`);
    console.log(`  refs: ${b.refs.join(", ")}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
