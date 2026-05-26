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
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
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

const BUCKET = "course-videos";

async function main() {
  console.log("Supabase URL:", url);

  const res = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: false,
      file_size_limit: 524288000,
      allowed_mime_types: ["video/mp4", "video/webm", "video/quicktime"],
    }),
  });

  const text = await res.text();
  if (res.ok) {
    console.log(`✓ Bucket "${BUCKET}" created (private).`);
    return;
  }

  if (res.status === 409 || text.toLowerCase().includes("already exists")) {
    console.log(`✓ Bucket "${BUCKET}" already exists.`);
    return;
  }

  console.error("Failed to create bucket:", res.status, text);
  console.log("\nIf API fails, run supabase/storage.sql in Supabase → SQL Editor instead.");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
