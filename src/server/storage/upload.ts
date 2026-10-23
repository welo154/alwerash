import { randomBytes } from "crypto";
import { detectFileType, type DetectedFileType } from "./file-signature";

export type ValidatedUpload = { bytes: Uint8Array; type: DetectedFileType; size: number };

export type UploadValidation =
  | { ok: true; upload: ValidatedUpload }
  | { ok: false; status: number; error: string };

/**
 * Pull a file out of multipart form data and confirm its real type from its bytes.
 * The client-declared Content-Type is ignored: a renamed HTML or SVG file would
 * otherwise be served back under an image or PDF type.
 */
export async function readValidatedUpload(
  formData: FormData,
  fieldNames: string[],
  options: { allowed: DetectedFileType["mime"][]; maxBytes: number; allowedLabel: string }
): Promise<UploadValidation> {
  const file = fieldNames.map((n) => formData.get(n)).find((v) => v && typeof v !== "string");
  if (!file || typeof file === "string") return { ok: false, status: 400, error: "No file provided" };

  if (file.size > options.maxBytes) {
    const mb = Math.round(options.maxBytes / (1024 * 1024));
    return { ok: false, status: 400, error: `File must be ${mb}MB or smaller` };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectFileType(bytes);
  if (!type || !options.allowed.includes(type.mime)) {
    return { ok: false, status: 400, error: `Only ${options.allowedLabel} are allowed` };
  }
  return { ok: true, upload: { bytes, type, size: bytes.byteLength } };
}

/** Random suffix so a replaced photo gets a new URL and CDN caches never serve the old one. */
export function uniqueObjectName(prefix: string, ext: string): string {
  return `${prefix}-${randomBytes(8).toString("hex")}.${ext}`;
}
