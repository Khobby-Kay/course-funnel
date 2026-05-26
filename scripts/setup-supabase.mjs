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

const BUCKETS = ["course-videos", "course-data"];

async function ensureBucket(bucketId) {
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
      public: false,
    }),
  });

  const text = await res.text();
  if (res.ok) {
    console.log(`✓ Bucket "${bucketId}" created (private).`);
    return;
  }

  if (res.status === 409 || text.toLowerCase().includes("already exists")) {
    console.log(`✓ Bucket "${bucketId}" already exists.`);
    return;
  }

  console.error(`Failed to create bucket "${bucketId}":`, res.status, text);
  process.exit(1);
}

async function main() {
  console.log("Supabase URL:", url);
  for (const bucket of BUCKETS) {
    await ensureBucket(bucket);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
