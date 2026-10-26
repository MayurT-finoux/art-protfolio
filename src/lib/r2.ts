// Cloudflare R2 client (S3-compatible API). Server only: uses the secret key.
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set. Add it to .env.local.`);
  return value;
}

let client: S3Client | undefined;

export function r2() {
  client ??= new S3Client({
    region: "auto",
    // R2 recommendation: don't add CRC32 checksums to presigned uploads
    // (the SDK would sign the checksum of an empty body).
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env("R2_ACCESS_KEY_ID"),
      secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
    },
  });
  return client;
}

export const r2Bucket = () => env("R2_BUCKET");

/** Public URL of an object, e.g. https://pub-….r2.dev/artworks/clay-ghost/abc.jpg */
export const r2PublicUrl = (key: string) => `${env("R2_PUBLIC_URL").replace(/\/$/, "")}/${key}`;

/** Signed URL the browser can PUT one file to, valid for 5 minutes. */
export function signUpload(key: string, contentType: string) {
  return getSignedUrl(r2(), new PutObjectCommand({ Bucket: r2Bucket(), Key: key, ContentType: contentType }), {
    expiresIn: 300,
  });
}
