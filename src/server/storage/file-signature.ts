/**
 * Identify an upload from its leading bytes rather than the client-supplied
 * Content-Type, which the uploader controls. Only formats the app accepts are
 * recognised; anything else is null.
 */
export type DetectedFileType = {
  mime: "image/jpeg" | "image/png" | "image/webp" | "application/pdf";
  ext: "jpg" | "png" | "webp" | "pdf";
};

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false;
  return signature.every((b, i) => bytes[offset + i] === b);
}

const ascii = (s: string) => Array.from(s, (c) => c.charCodeAt(0));

export function detectFileType(bytes: Uint8Array): DetectedFileType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { mime: "image/jpeg", ext: "jpg" };
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { mime: "image/png", ext: "png" };
  }
  if (startsWith(bytes, ascii("RIFF")) && startsWith(bytes, ascii("WEBP"), 8)) {
    return { mime: "image/webp", ext: "webp" };
  }
  if (startsWith(bytes, ascii("%PDF-"))) return { mime: "application/pdf", ext: "pdf" };
  return null;
}

export const IMAGE_MIME_TYPES: DetectedFileType["mime"][] = ["image/jpeg", "image/png", "image/webp"];
