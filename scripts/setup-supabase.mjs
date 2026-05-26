/**
 * One-time Supabase setup for course-funnel.
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run: node scripts/setup-supabase.mjs
 */

import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Missing .env.local");
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first."
  );
  process.exit(1);
}

const BUCKETS = [
  { id: "course-videos", public: false },
  { id: "course-data", public: false },
  { id: "course-marketing", public: true },
];

async function ensureBucket(bucketId, isPublic) {
  const res = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: bucketId,
      name: bucketId,
      public: isPublic,
    }),
  });

  const text = await res.text();
  if (res.ok) {
    console.log(`✓ Bucket "${bucketId}" created (${isPublic ? "public" : "private"}).`);
    return;
  }

  if (res.status === 409 || text.toLowerCase().includes("already exists")) {
    console.log(`✓ Bucket "${bucketId}" already exists.`);
    if (isPublic) {
      await ensureBucketPublic(bucketId);
    }
    return;
  }

  console.error(`Failed to create bucket "${bucketId}":`, res.status, text);
  process.exit(1);
}

async function ensureBucketPublic(bucketId) {
  const res = await fetch(`${url}/storage/v1/bucket/${bucketId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: bucketId,
      name: bucketId,
      public: true,
    }),
  });

  if (res.ok) {
    console.log(`✓ Bucket "${bucketId}" set to public.`);
    return;
  }

  const text = await res.text();
  console.warn(`Could not update "${bucketId}" to public (${res.status}): ${text}`);
  console.warn(`  → In Supabase Dashboard → Storage → ${bucketId}, enable "Public bucket".`);
}

async function main() {
  console.log("Supabase URL:", url);
  for (const bucket of BUCKETS) {
    await ensureBucket(bucket.id, bucket.public);
  }
  console.log("\nDone. Marketing images upload to the public course-marketing bucket.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
