// Cloudflare R2 test: `npm run r2:check`.
// Uploads a tiny file, reads it back from the public URL, then deletes it.
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const names = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_URL"];
const missing = names.filter((n) => !process.env[n]);
if (missing.length) {
  console.error(`✗ Missing in .env.local: ${missing.join(", ")}`);
  process.exit(1);
}

const env = process.env as Record<string, string>;
const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
});
const key = `_check/${Date.now()}.txt`;
const body = `r2 check ${new Date().toISOString()}`;
let ok = true;

try {
  await client.send(new PutObjectCommand({ Bucket: env.R2_BUCKET, Key: key, Body: body, ContentType: "text/plain" }));
  console.log(`✓ upload: ${env.R2_BUCKET}/${key}`);

  const url = `${env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  const res = await fetch(url);
  const text = await res.text();
  if (res.ok && text === body) {
    console.log(`✓ public read: ${url}`);
  } else {
    ok = false;
    console.error(`✗ public read: ${url} → HTTP ${res.status}. Is public access (r2.dev) turned on, and R2_PUBLIC_URL right?`);
  }
} catch (error) {
  ok = false;
  console.error(`✗ ${(error as Error).message}`);
} finally {
  try {
    await client.send(new DeleteObjectCommand({ Bucket: env.R2_BUCKET, Key: key }));
    console.log("✓ cleanup: test file deleted");
  } catch (error) {
    console.error(`✗ cleanup: ${(error as Error).message}`);
  }
}

process.exit(ok ? 0 : 1);
