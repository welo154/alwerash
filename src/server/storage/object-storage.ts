/**
 * Object storage for user uploads.
 *
 * Production uses Supabase Storage over its REST API with the service-role key,
 * which never reaches the browser. Vercel's filesystem is read-only outside /tmp,
 * so writing into public/ (the previous approach) cannot work there, and anything
 * in public/ is served to anyone with the URL.
 *
 * Two buckets:
 * - private: student submissions. Read back only through an authorized route.
 * - public: profile, mentor, and instructor photos, which are shown to everyone.
 *
 * Without Supabase configuration, development falls back to local disk: private
 * files under .data/ (outside public/, so never served statically) and public
 * files under public/uploads/.
 */
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type Visibility = "private" | "public";

type SupabaseConfig = { url: string; serviceKey: string };

function supabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && serviceKey ? { url, serviceKey } : null;
}

function bucketFor(visibility: Visibility): string {
  return visibility === "private"
    ? process.env.STORAGE_PRIVATE_BUCKET?.trim() || "private-uploads"
    : process.env.STORAGE_PUBLIC_BUCKET?.trim() || "public-images";
}

/** Keys are generated server-side; reject anything that could traverse or escape. */
export function assertSafeObjectKey(key: string): void {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*(\/[A-Za-z0-9][A-Za-z0-9._-]*)*$/.test(key) || key.includes("..")) {
    throw new Error(`Unsafe storage key: ${key}`);
  }
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("File storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
}

function localRoot(visibility: Visibility): string {
  return visibility === "private"
    ? path.join(process.cwd(), ".data", "uploads")
    : path.join(process.cwd(), "public", "uploads");
}

function canUseLocalDisk(): boolean {
  return process.env.NODE_ENV !== "production";
}

/** Store `bytes` and return the URL for public objects, or null for private ones. */
export async function putObject(
  visibility: Visibility,
  key: string,
  bytes: Uint8Array,
  contentType: string
): Promise<{ publicUrl: string | null }> {
  assertSafeObjectKey(key);
  const config = supabaseConfig();

  if (config) {
    const bucket = bucketFor(visibility);
    const res = await fetch(`${config.url}/storage/v1/object/${bucket}/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.serviceKey}`,
        apikey: config.serviceKey,
        "Content-Type": contentType,
        "x-upsert": "true",
        "Cache-Control": visibility === "public" ? "max-age=31536000" : "no-store",
      },
      body: Buffer.from(bytes),
    });
    if (!res.ok) {
      throw new Error(`Storage upload failed (${res.status}): ${await res.text().catch(() => "")}`);
    }
    return {
      publicUrl: visibility === "public" ? `${config.url}/storage/v1/object/public/${bucket}/${key}` : null,
    };
  }

  if (!canUseLocalDisk()) throw new StorageNotConfiguredError();
  const filepath = path.join(localRoot(visibility), key);
  await mkdir(path.dirname(filepath), { recursive: true });
  await writeFile(filepath, bytes);
  return { publicUrl: visibility === "public" ? `/uploads/${key}` : null };
}

/** A profile image URL this app could have produced for `userId`. */
export function isAllowedProfileImage(url: string, userId: string): boolean {
  const config = supabaseConfig();
  const prefixes = [
    `/uploads/avatars/${userId}-`,
    "https://lh3.googleusercontent.com/",
    ...(config ? [`${config.url}/storage/v1/object/public/${bucketFor("public")}/avatars/${userId}-`] : []),
  ];
  return prefixes.some((p) => url.startsWith(p)) && !url.includes("..");
}

/** Read a private object. Returns null when it does not exist. */
export async function getPrivateObject(key: string): Promise<Uint8Array | null> {
  assertSafeObjectKey(key);
  const config = supabaseConfig();

  if (config) {
    const res = await fetch(`${config.url}/storage/v1/object/${bucketFor("private")}/${key}`, {
      headers: { Authorization: `Bearer ${config.serviceKey}`, apikey: config.serviceKey },
      cache: "no-store",
    });
    if (res.status === 400 || res.status === 404) return null;
    if (!res.ok) throw new Error(`Storage download failed (${res.status})`);
    return new Uint8Array(await res.arrayBuffer());
  }

  if (!canUseLocalDisk()) throw new StorageNotConfiguredError();
  try {
    return await readFile(path.join(localRoot("private"), key));
  } catch {
    return null;
  }
}
