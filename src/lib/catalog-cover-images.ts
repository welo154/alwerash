import { staticCourseCoverForTitle } from "@/lib/static-course-covers";

const DEFAULT_COURSE_IMAGE =
  "https://images.unsplash.com/photo-1561070791-2526d38794a5?w=700&h=760&fit=crop&q=80";

const DEFAULT_TRACK_IMAGE =
  "https://images.unsplash.com/photo-1561070791-2526d38794a5?w=800&h=500&fit=crop&q=80";

function unsplash(photoId: string, w: number, h: number): string {
  return `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&q=80`;
}

function pickBySeed(seed: string, urls: readonly string[]): string {
  if (urls.length === 0) return DEFAULT_COURSE_IMAGE;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return urls[Math.abs(hash) % urls.length]!;
}

/** Thematic hero image per track slug (tall track cards + track page banner). */
const TRACK_COVER_BY_SLUG: Record<string, string> = {
  "design-fundamentals": unsplash("photo-1558591710-4b4c1c0e5e0a", 800, 500),
  "design-softwares": unsplash("photo-1618005182384-a83a8bd57fbe", 800, 500),
  motion: unsplash("photo-1611162616475-46b635cb6868", 800, 500),
  "creative-coding": unsplash("photo-1555066931-4365d14bab8c", 800, 500),
  "poster-design": unsplash("photo-1582719478250-c89cae4dc85b", 800, 500),
  lettering: unsplash("photo-1583485088134-034bcb65a0b7", 800, 500),
  "logo-design": unsplash("photo-1626785774573-4b799315345d", 800, 500),
  "branding-and-visual-identities": unsplash("photo-1634942537034-2531766767d1", 800, 500),
  "type-design": unsplash("photo-1582719478250-c89cae4dc85b", 800, 500),
  calligraphy: unsplash("photo-1455390572244-0443dd647dd0", 800, 500),
  ornamentation: unsplash("photo-1579783902617-a3fb3927b6a5", 800, 500),
  "apparel-design": unsplash("photo-1521572163474-6864f9cf17ab", 800, 500),
  "illustration-and-drawing": unsplash("photo-1513364776144-ebeb3fe3d8fe", 800, 500),
  "3d-designs": unsplash("photo-1633356122544-f134324a6cee", 800, 500),
  animation: unsplash("photo-1578632767115-351597cf2477", 800, 500),
  "creatives-needs": unsplash("photo-1497215842964-222b430dc094", 800, 500),
  "ui-ux": unsplash("photo-1561070791-2526d38794a5", 800, 500),
  "ui-ux-design": unsplash("photo-1561070791-2526d38794a5", 800, 500),
  "graphic-design": unsplash("photo-1634942537034-2531766767d1", 800, 500),
  "motion-design": unsplash("photo-1611162616475-46b635cb6868", 800, 500),
};

/** Course card pools — pick by course title for variety within a track. */
const COURSE_POOL_BY_TRACK_SLUG: Record<string, readonly string[]> = {
  "design-fundamentals": [
    unsplash("photo-1558591710-4b4c1c0e5e0a", 700, 760),
    unsplash("photo-1541701494587-ab638cfee0b6", 700, 760),
    unsplash("photo-1513364776144-ebeb3fe3d8fe", 700, 760),
  ],
  "design-softwares": [
    unsplash("photo-1618005182384-a83a8bd57fbe", 700, 760),
    unsplash("photo-1542831371-d531d36971e6", 700, 760),
    unsplash("photo-1517694712202-14dd9538aa97", 700, 760),
    unsplash("photo-1581291518633-83b4ebd1d83e", 700, 760),
  ],
  motion: [
    unsplash("photo-1611162616475-46b635cb6868", 700, 760),
    unsplash("photo-1578632767115-351597cf2477", 700, 760),
    unsplash("photo-1550745165-9bc0b4ffc2ae", 700, 760),
  ],
  "creative-coding": [
    unsplash("photo-1555066931-4365d14bab8c", 700, 760),
    unsplash("photo-1555949963-aa79dcee981c", 700, 760),
    unsplash("photo-1516116216624-53e697fedbea", 700, 760),
  ],
  "poster-design": [
    unsplash("photo-1582719478250-c89cae4dc85b", 700, 760),
    unsplash("photo-1583485088134-034bcb65a0b7", 700, 760),
    unsplash("photo-1626785774573-4b799315345d", 700, 760),
  ],
  lettering: [
    unsplash("photo-1583485088134-034bcb65a0b7", 700, 760),
    unsplash("photo-1596464716127-f2a82984de30", 700, 760),
    unsplash("photo-1455390572244-0443dd647dd0", 700, 760),
  ],
  "logo-design": [
    unsplash("photo-1626785774573-4b799315345d", 700, 760),
    unsplash("photo-1634942537034-2531766767d1", 700, 760),
    unsplash("photo-1611532736597-de2d4265fba3", 700, 760),
  ],
  "branding-and-visual-identities": [
    unsplash("photo-1634942537034-2531766767d1", 700, 760),
    unsplash("photo-1558618666-fcd25c85cd64", 700, 760),
    unsplash("photo-1561070791-2526d38794a5", 700, 760),
  ],
  "type-design": [
    unsplash("photo-1582719478250-c89cae4dc85b", 700, 760),
    unsplash("photo-1455390572244-0443dd647dd0", 700, 760),
    unsplash("photo-1583485088134-034bcb65a0b7", 700, 760),
  ],
  calligraphy: [
    unsplash("photo-1455390572244-0443dd647dd0", 700, 760),
    unsplash("photo-1596464716127-f2a82984de30", 700, 760),
    unsplash("photo-1583485088134-034bcb65a0b7", 700, 760),
  ],
  ornamentation: [
    unsplash("photo-1579783902617-a3fb3927b6a5", 700, 760),
    unsplash("photo-1558618666-fcd25c85cd64", 700, 760),
    unsplash("photo-1618005182384-a83a8bd57fbe", 700, 760),
  ],
  "apparel-design": [
    unsplash("photo-1521572163474-6864f9cf17ab", 700, 760),
    unsplash("photo-1503342217505-b0a15ec3261c", 700, 760),
    unsplash("photo-1576566588028-4147f3842f27", 700, 760),
  ],
  "illustration-and-drawing": [
    unsplash("photo-1513364776144-ebeb3fe3d8fe", 700, 760),
    unsplash("photo-1547891654-e66ed7ebb968", 700, 760),
    unsplash("photo-1596464716127-f2a82984de30", 700, 760),
  ],
  "3d-designs": [
    unsplash("photo-1633356122544-f134324a6cee", 700, 760),
    unsplash("photo-1618005182384-a83a8bd57fbe", 700, 760),
    unsplash("photo-1550745165-9bc0b4ffc2ae", 700, 760),
  ],
  animation: [
    unsplash("photo-1578632767115-351597cf2477", 700, 760),
    unsplash("photo-1611162616475-46b635cb6868", 700, 760),
  ],
  "creatives-needs": [
    unsplash("photo-1497215842964-222b430dc094", 700, 760),
    unsplash("photo-1454165804606-c3d57bc86b40", 700, 760),
    unsplash("photo-1522202176988-66273c2fd55f", 700, 760),
  ],
  "ui-ux": [
    unsplash("photo-1561070791-2526d38794a5", 700, 760),
    unsplash("photo-1517694712202-14dd9538aa97", 700, 760),
    unsplash("photo-1581291518633-83b4ebd1d83e", 700, 760),
  ],
};

/** Title keyword → image (checked before track pool). */
const COURSE_KEYWORD_COVERS: { match: RegExp; url: string }[] = [
  { match: /photoshop/i, url: unsplash("photo-1618005182384-a83a8bd57fbe", 700, 760) },
  { match: /illustrator/i, url: unsplash("photo-1581291518633-83b4ebd1d83e", 700, 760) },
  { match: /indesign/i, url: unsplash("photo-1582719478250-c89cae4dc85b", 700, 760) },
  { match: /after effects|motion graphics/i, url: unsplash("photo-1611162616475-46b635cb6868", 700, 760) },
  { match: /figma/i, url: unsplash("photo-1561070791-2526d38794a5", 700, 760) },
  { match: /procreate|drawing/i, url: unsplash("photo-1547891654-e66ed7ebb968", 700, 760) },
  { match: /blender|3d|modeling|rendering|texturing/i, url: unsplash("photo-1633356122544-f134324a6cee", 700, 760) },
  { match: /calligraph|naskh|ruqaa|thuluth|diwani|kufi|script/i, url: unsplash("photo-1455390572244-0443dd647dd0", 700, 760) },
  { match: /lettering|typograph|type design|glyphs|font/i, url: unsplash("photo-1583485088134-034bcb65a0b7", 700, 760) },
  { match: /logo|icon design|monogram/i, url: unsplash("photo-1626785774573-4b799315345d", 700, 760) },
  { match: /brand/i, url: unsplash("photo-1634942537034-2531766767d1", 700, 760) },
  { match: /poster/i, url: unsplash("photo-1582719478250-c89cae4dc85b", 700, 760) },
  { match: /illustrat|character|storyboard|graffiti/i, url: unsplash("photo-1513364776144-ebeb3fe3d8fe", 700, 760) },
  { match: /ornament|pattern|geometric|batik|floral/i, url: unsplash("photo-1579783902617-a3fb3927b6a5", 700, 760) },
  { match: /t-?shirt|apparel/i, url: unsplash("photo-1521572163474-6864f9cf17ab", 700, 760) },
  { match: /notion|portfolio|cv|workflow|financial/i, url: unsplash("photo-1497215842964-222b430dc094", 700, 760) },
  { match: /mobile|website|editorial|book/i, url: unsplash("photo-1517694712202-14dd9538aa97", 700, 760) },
  { match: /coding|touchdesigner/i, url: unsplash("photo-1555066931-4365d14bab8c", 700, 760) },
  { match: /stop motion|animation/i, url: unsplash("photo-1578632767115-351597cf2477", 700, 760) },
];

function muxThumbnailUrl(playbackId: string): string {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?width=700&height=760&fit_mode=smartcrop`;
}

function catalogCourseFallback(title: string, trackSlug?: string | null): string {
  for (const { match, url } of COURSE_KEYWORD_COVERS) {
    if (match.test(title)) return url;
  }
  const slug = trackSlug?.trim().toLowerCase();
  if (slug && COURSE_POOL_BY_TRACK_SLUG[slug]) {
    return pickBySeed(title, COURSE_POOL_BY_TRACK_SLUG[slug]);
  }
  return DEFAULT_COURSE_IMAGE;
}

export function resolveTrackCoverImage(
  coverImage: string | null | undefined,
  trackSlug?: string | null
): string {
  if (coverImage?.trim()) return coverImage.trim();
  const slug = trackSlug?.trim().toLowerCase();
  if (slug && TRACK_COVER_BY_SLUG[slug]) return TRACK_COVER_BY_SLUG[slug]!;
  return DEFAULT_TRACK_IMAGE;
}

export function resolveCourseCoverImage(input: {
  coverImage?: string | null;
  introVideoMuxPlaybackId?: string | null;
  title: string;
  trackSlug?: string | null;
}): string {
  const staticCover = staticCourseCoverForTitle(input.title);
  if (staticCover) return staticCover;
  if (input.coverImage?.trim()) return input.coverImage.trim();
  if (input.introVideoMuxPlaybackId?.trim()) {
    return muxThumbnailUrl(input.introVideoMuxPlaybackId.trim());
  }
  return catalogCourseFallback(input.title, input.trackSlug);
}

/** URLs used when backfilling the database (same logic as runtime fallbacks). */
export function catalogCoverUrlForTrack(slug: string, title: string): string {
  return resolveTrackCoverImage(null, slug);
}

export function catalogCoverUrlForCourse(
  title: string,
  trackSlug: string | null | undefined
): string {
  return resolveCourseCoverImage({ title, trackSlug });
}
