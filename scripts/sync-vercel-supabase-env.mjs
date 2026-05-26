/**
 * Push Supabase env vars from .env.local to Vercel (production + preview).
 * Run: node scripts/sync-vercel-supabase-env.mjs
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const ENVIRONMENTS = ["production"];

function loadEnvLocal() {
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
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key) vars[key] = value;
  }
  return vars;
}

function run(cmd) {
  execSync(cmd, { stdio: "inherit", encoding: "utf8" });
}

const vars = loadEnvLocal();
for (const key of KEYS) {
  if (!vars[key]) {
    console.error(`Missing ${key} in .env.local`);
    process.exit(1);
  }
}

for (const env of ENVIRONMENTS) {
  for (const key of KEYS) {
    const value = vars[key];
    try {
      run(`npx vercel env rm ${key} ${env} --yes`);
    } catch {
      // not set yet
    }
    console.log(`Setting ${key} (${env})…`);
    const escaped = value.replace(/"/g, '\\"');
    run(`npx vercel env add ${key} ${env} --value "${escaped}" --yes`);
  }
}

console.log("\nDone. Redeploy production: npx vercel --prod --yes\n");
