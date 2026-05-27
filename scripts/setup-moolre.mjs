/**
 * Enable Moolre API MoMo prompts on the merchant wallet.
 * Requires in .env.local:
 *   MOOLRE_API_USER
 *   MOOLRE_ACCOUNT_NUMBER
 *   MOOLRE_PUBLIC_KEY (payment + wallet status)
 * Optional:
 *   MOOLRE_API_KEY — Private API Key for account updates (app.moolre.com → Profile → API Keys)
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
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) process.env[key] = value;
  }
}

function resolveAccountApiKey() {
  return (
    process.env.MOOLRE_API_KEY?.trim() ||
    process.env.MOOLRE_SECRET_KEY?.trim() ||
    process.env.MOOLRE_PUBLIC_KEY?.trim() ||
    ""
  );
}

function hasPrivateAccountKey() {
  return Boolean(process.env.MOOLRE_API_KEY?.trim() || process.env.MOOLRE_SECRET_KEY?.trim());
}

loadEnvLocal();

const base =
  process.env.MOOLRE_SANDBOX === "true"
    ? "https://sandbox.moolre.com"
    : "https://api.moolre.com";

const user = process.env.MOOLRE_API_USER?.trim();
const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER?.trim();
const publicKey = process.env.MOOLRE_PUBLIC_KEY?.trim();
const accountApiKey = resolveAccountApiKey();
const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

if (!user || !accountNumber || !publicKey) {
  const missing = [];
  if (!user) missing.push("MOOLRE_API_USER");
  if (!publicKey) missing.push("MOOLRE_PUBLIC_KEY");
  if (!accountNumber) missing.push("MOOLRE_ACCOUNT_NUMBER");
  console.error(`Missing in .env.local: ${missing.join(", ")}`);
  process.exit(1);
}

function accountHeaders() {
  return {
    "Content-Type": "application/json",
    "X-API-USER": user,
    "X-API-KEY": accountApiKey,
  };
}

function paymentHeaders() {
  return {
    "Content-Type": "application/json",
    "X-API-USER": user,
    ...(process.env.MOOLRE_SANDBOX !== "true" && publicKey ? { "X-API-PUBKEY": publicKey } : {}),
  };
}

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
  console.log(
    "Account API key:",
    hasPrivateAccountKey() ? "MOOLRE_API_KEY (private)" : "MOOLRE_PUBLIC_KEY (fallback for status)"
  );
  console.log("");

  console.log("1. Checking wallet status…");
  const status = await post("/open/account/status", accountHeaders(), {
    type: 1,
    accountnumber: accountNumber,
  });
  console.log(JSON.stringify(status.json, null, 2));

  if (Number(status.json?.status) !== 1) {
    console.error("\nWallet check failed. Verify MOOLRE_API_USER and MOOLRE_ACCOUNT_NUMBER.");
    process.exit(1);
  }

  const callback = status.json?.data?.callback;
  if (callback) {
    console.log("\n   Webhook already set:", callback);
  }

  if (hasPrivateAccountKey()) {
    console.log("\n2. Enabling API transactions (api: true) + webhook…");
    const update = await post("/open/account/update", accountHeaders(), {
      type: 1,
      accountnumber: accountNumber,
      api: true,
      callback: `${appUrl}/api/webhooks/moolre`,
    });
    console.log(JSON.stringify(update.json, null, 2));

    if (Number(update.json?.status) !== 1) {
      console.warn(
        "\n   Account update failed. If code is AIN01, your MOOLRE_API_KEY may be wrong — use the Private API Key from app.moolre.com."
      );
    } else {
      console.log("\n   API access update accepted.");
    }
  } else {
    console.log("\n2. Skipping account update — add MOOLRE_API_KEY (Private API Key) to enable api:true via API.");
    console.log("   Your wallet callback is already configured if shown above.");
  }

  console.log("\n3. Testing direct MoMo prompt API (/open/transact/payment)…");
  const probeRef = `cf-setup-probe-${Date.now().toString(36)}`;
  const payment = await post("/open/transact/payment", paymentHeaders(), {
    type: 1,
    amount: "1",
    externalref: probeRef,
    currency: "GHS",
    accountnumber: accountNumber,
    payer: "0240000000",
    channel: "13",
  });
  console.log(JSON.stringify(payment.json, null, 2));

  const code = payment.json?.code?.toUpperCase?.() ?? "";

  if (code === "TR099") {
    console.log("\n✓ Direct phone prompts are WORKING (TR099). Checkout will send MoMo to customer phones.");
    process.exit(0);
  }

  if (code === "TP14") {
    console.log("\n✓ Payment API is reachable. TP14 = Moolre sent an SMS verification step.");
    console.log("  At checkout: tap Pay → enter the SMS code when prompted → MoMo prompt goes to the phone.");
    console.log("  If SMS never arrives, contact Moolre support to fully activate API MoMo on your wallet.");
    process.exit(0);
  }

  if (code === "TR03") {
    console.log("\n✓ Payment API is reachable (test number invalid — expected for probe).");
    console.log("  Use a real Ghana MoMo number at checkout.");
    process.exit(0);
  }

  console.log("\nSetup finished with payment API response above.");
  if (Number(payment.json?.status) === 1) {
    process.exit(0);
  }

  console.error("\nPayment API returned an error. Check MOOLRE_PUBLIC_KEY and account number.");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
