import { r2PublicUrl, signUpload } from "@/lib/r2";
import { checkUpload, FOLDER_PATTERN, UPLOAD_RULES, type UploadKind } from "@/lib/uploads";

type Body = { kind: UploadKind; folder: string; contentType: string; size: number };

/**
 * Signs one upload: the browser then PUTs the file straight to R2.
 * Returns { uploadUrl, publicUrl, key }.
 *
 * TODO (before launch): require the admin login. Open on every deployment for
 * now at Yurix's request (2026-10-11); type, size and folder are still checked.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { kind, folder, contentType, size } = body;
  if (typeof folder !== "string" || !FOLDER_PATTERN.test(folder)) {
    return Response.json({ error: "Invalid folder." }, { status: 400 });
  }
  const problem = checkUpload(kind, contentType, size);
  if (problem) return Response.json({ error: problem }, { status: 400 });

  const ext = UPLOAD_RULES[kind].types[contentType];
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;
  try {
    const uploadUrl = await signUpload(key, contentType);
    return Response.json({ uploadUrl, publicUrl: r2PublicUrl(key), key });
  } catch (error) {
    console.error("R2 sign failed:", error);
    return Response.json({ error: "Storage isn't configured. Check the R2_* values in .env.local." }, { status: 500 });
  }
}
