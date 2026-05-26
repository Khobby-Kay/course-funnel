/**
 * Upload all local data/courses/*.json to Supabase course-data bucket.
 * Run after setup:supabase: node scripts/migrate-courses-to-supabase.mjs
 */
import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Missing .env.local");
    process.exit(1);
  }
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const coursesDir = path.join(process.cwd(), "data", "courses");
const bucket = "course-data";

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

if (!fs.existsSync(coursesDir)) {
  console.error("No data/courses directory");
  process.exit(1);
}

const files = fs.readdirSync(coursesDir).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.log("No course JSON files to migrate.");
  process.exit(0);
}

for (const file of files) {
  const slug = file.replace(/\.json$/, "");
  const body = fs.readFileSync(path.join(coursesDir, file), "utf8");
  const storagePath = `courses/${slug}.json`;

  const res = await fetch(
    `${url}/storage/v1/object/${bucket}/${storagePath}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
        "x-upsert": "true",
      },
      body,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed ${slug}:`, res.status, text);
    process.exit(1);
  }

  console.log(`✓ Migrated ${slug}`);
}

console.log(`\nDone. ${files.length} course(s) in Supabase bucket "${bucket}".`);
