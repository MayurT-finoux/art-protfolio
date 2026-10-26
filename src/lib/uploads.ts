// Upload rules shared by the admin (browser) and /api/uploads (server).

export type UploadKind = "image" | "video" | "audio";

export const UPLOAD_RULES: Record<UploadKind, { types: Record<string, string>; maxBytes: number; label: string }> = {
  image: {
    types: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" },
    maxBytes: 20 * 1024 * 1024,
    label: "JPG, PNG or WebP, up to 20 MB",
  },
  video: {
    // MOV carries HEVC with alpha for Safari; WebM (VP9) for other browsers.
    types: { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" },
    maxBytes: 200 * 1024 * 1024,
    label: "MP4, WebM or MOV, up to 200 MB",
  },
  audio: {
    types: { "audio/mpeg": "mp3", "audio/mp4": "m4a", "audio/x-m4a": "m4a" },
    maxBytes: 30 * 1024 * 1024,
    label: "MP3 or M4A, up to 30 MB",
  },
};

/** Value for an <input type="file" accept>. */
export const acceptFor = (kind: UploadKind) => Object.keys(UPLOAD_RULES[kind].types).join(",");

/** Where a file goes in the bucket: "artworks/clay-ghost", "home", "music"… */
export const FOLDER_PATTERN = /^(artworks|projects|home|about|music)(\/[a-z0-9-]{1,80})?$/;

/** Returns an error message, or null when the file is allowed. */
export function checkUpload(kind: UploadKind, contentType: string, size: number): string | null {
  const rule = UPLOAD_RULES[kind];
  if (!rule) return "Unknown upload kind.";
  if (!(contentType in rule.types)) return `Wrong file type. Use ${rule.label}.`;
  if (!Number.isFinite(size) || size <= 0) return "The file is empty.";
  if (size > rule.maxBytes) return `File too big. Use ${rule.label}.`;
  return null;
}
