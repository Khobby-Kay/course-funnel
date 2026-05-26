/**
 * Prints which Supabase vars to copy into Vercel (values masked).
 * Run: node scripts/vercel-supabase-checklist.mjs
 */
import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("Missing .env.local");
  process.exit(1);
}

const vars = {};
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
}

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

function mask(value) {
  if (!value) return "(missing)";
  if (value.length <= 12) return "***";
  return `${value.slice(0, 8)}…${value.slice(-4)} (${value.length} chars)`;
}

console.log("\n=== Add these in Vercel → course-funnel → Settings → Environment Variables ===\n");
console.log("Enable for: Production, Preview, and Development\n");

let ok = true;
for (const key of required) {
  const value = vars[key];
  if (!value) ok = false;
  console.log(`${key}`);
  console.log(`  Value: ${mask(value)}`);
  console.log("");
}

if (!ok) {
  console.error("Some variables are missing from .env.local — fix that first.\n");
  process.exit(1);
}

console.log("After saving all variables:");
console.log("  1. Deployments → latest → ⋮ → Redeploy (required — env vars are not applied to old builds)");
console.log("  2. Admin login on https://course-funnel.vercel.app (ADMIN_PASSWORD in Vercel too)");
console.log("  3. Upload a lesson video again\n");
