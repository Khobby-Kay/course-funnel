/**
 * Enable Moolre API MoMo prompts on the merchant wallet.
 * Requires in .env.local:
 *   MOOLRE_API_USER
 *   MOOLRE_API_KEY        (Private API Key — not the Public Key)
 *   MOOLRE_ACCOUNT_NUMBER
 *   NEXT_PUBLIC_APP_URL
 *
 * Run: npm run setup:moolre
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

const base =
  process.env.MOOLRE_SANDBOX === "true"
    ? "https://sandbox.moolre.com"
    : "https://api.moolre.com";

const user = process.env.MOOLRE_API_USER?.trim();
const apiKey = process.env.MOOLRE_API_KEY?.trim();
const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER?.trim();
const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

if (!user || !apiKey || !accountNumber) {
  console.error(
    "Set MOOLRE_API_USER, MOOLRE_API_KEY (Private API Key), and MOOLRE_ACCOUNT_NUMBER in .env.local"
  );
  process.exit(1);
}

const accountHeaders = {
  "Content-Type": "application/json",
  "X-API-USER": user,
  "X-API-KEY": apiKey,
};

const paymentHeaders = {
  "Content-Type": "application/json",
  "X-API-USER": user,
  ...(process.env.MOOLRE_SANDBOX !== "true" && process.env.MOOLRE_PUBLIC_KEY
    ? { "X-API-PUBKEY": process.env.MOOLRE_PUBLIC_KEY.trim() }
    : {}),
};

async function post(pathname, headers, body) {
  const res = await fetch(`${base}${pathname}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try {
    return { status: res.status, json: JSON.parse(text) };
  } catch {
    return { status: res.status, json: { raw: text } };
  }
}

async function main() {
  console.log("Moolre base URL:", base);
  console.log("Account:", accountNumber);
  console.log("Callback:", `${appUrl}/api/webhooks/moolre`);
  console.log("");

  console.log("1. Checking wallet status…");
  const status = await post("/open/account/status", accountHeaders, {
    type: 1,
    accountnumber: accountNumber,
  });
  console.log(JSON.stringify(status.json, null, 2));

  console.log("\n2. Enabling API transactions (api: true) + webhook…");
  const update = await post("/open/account/update", accountHeaders, {
    type: 1,
    accountnumber: accountNumber,
    api: true,
    callback: `${appUrl}/api/webhooks/moolre`,
  });
  console.log(JSON.stringify(update.json, null, 2));

  if (Number(update.json?.status) !== 1) {
    console.error("\nCould not enable API access. Check MOOLRE_API_KEY (Private API Key from app.moolre.com).");
    process.exit(1);
  }

  console.log("\n3. API access update accepted.");
  console.log("\nNext steps:");
  console.log("  • Add MOOLRE_API_KEY to Vercel env vars (same Private API Key)");
  console.log("  • Redeploy, then test checkout — customer should get a MoMo prompt on their phone");
  console.log("  • If checkout asks for an SMS code (TP14), enter the code Moolre sent to the phone");
  console.log("  • If it still fails, email Moolre support and ask to enable /open/transact/payment for your wallet");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
