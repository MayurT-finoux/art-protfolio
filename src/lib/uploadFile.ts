"use client";

import { checkUpload, type UploadKind } from "./uploads";

/**
 * Uploads one file to R2 from the browser:
 * asks /api/uploads for a signed URL, then PUTs the file straight to R2.
 * Resolves with the file's public URL.
 */
export async function uploadFile(
  file: File,
  { kind, folder, onProgress }: { kind: UploadKind; folder: string; onProgress?: (fraction: number) => void },
): Promise<string> {
  const problem = checkUpload(kind, file.type, file.size);
  if (problem) throw new Error(problem);

  const res = await fetch("/api/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, folder, contentType: file.type, size: file.size }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload failed.");

  // XHR (not fetch) so we get upload progress.
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", data.uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status}).`)));
    xhr.onerror = () =>
      reject(new Error(`Upload blocked by the bucket's CORS rule for ${window.location.origin}. Add this address to the rule's AllowedOrigins.`));
    xhr.send(file);
  });

  return data.publicUrl as string;
}
