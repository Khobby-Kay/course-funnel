import "server-only";

import { getAppUrl } from "./utils";

type MoolreAccountResponse = {
  status?: number | string;
  code?: string;
  message?: string | string[];
  data?: {
    api?: number | boolean;
    callback?: string;
    balance?: number;
    accountname?: string;
  };
};

function getMoolreBaseUrl(): string {
  return process.env.MOOLRE_SANDBOX === "true"
    ? "https://sandbox.moolre.com"
    : "https://api.moolre.com";
}

function getMoolreAccountHeaders(): Record<string, string> | null {
  const user = process.env.MOOLRE_API_USER?.trim();
  const apiKey =
    process.env.MOOLRE_API_KEY?.trim() ||
    process.env.MOOLRE_SECRET_KEY?.trim() ||
    process.env.MOOLRE_PUBLIC_KEY?.trim();
  if (!user || !apiKey) return null;

  return {
    "Content-Type": "application/json",
    "X-API-USER": user,
    "X-API-KEY": apiKey,
  };
}

function hasPrivateMoolreAccountKey(): boolean {
  return Boolean(process.env.MOOLRE_API_KEY?.trim() || process.env.MOOLRE_SECRET_KEY?.trim());
}

export function isMoolreAccountApiConfigured(): boolean {
  return getMoolreAccountHeaders() !== null;
}

export async function getMoolreAccountStatus(): Promise<MoolreAccountResponse | null> {
  const headers = getMoolreAccountHeaders();
  const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER?.trim();
  if (!headers || !accountNumber) return null;

  const response = await fetch(`${getMoolreBaseUrl()}/open/account/status`, {
    method: "POST",
    headers,
    body: JSON.stringify({ type: 1, accountnumber: accountNumber }),
  });

  try {
    return (await response.json()) as MoolreAccountResponse;
  } catch {
    return null;
  }
}

/** Enable API transactions + payment webhook on the merchant wallet (requires Private API Key). */
export async function enableMoolreApiAccess(): Promise<{
  ok: boolean;
  code?: string;
  message?: string;
  apiEnabled?: boolean;
  skipped?: boolean;
}> {
  if (!hasPrivateMoolreAccountKey()) {
    return {
      ok: true,
      skipped: true,
      message: "MOOLRE_API_KEY not set — skipping wallet update (payment API still uses MOOLRE_PUBLIC_KEY).",
    };
  }

  const headers = getMoolreAccountHeaders();
  const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER?.trim();
  if (!headers || !accountNumber) {
    return {
      ok: false,
      message: "Moolre account credentials are not configured.",
    };
  }

  const callback = `${getAppUrl()}/api/webhooks/moolre`;

  const response = await fetch(`${getMoolreBaseUrl()}/open/account/update`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      type: 1,
      accountnumber: accountNumber,
      api: true,
      callback,
    }),
  });

  let payload: MoolreAccountResponse;
  try {
    payload = (await response.json()) as MoolreAccountResponse;
  } catch {
    return { ok: false, message: "Could not parse Moolre account update response." };
  }

  const ok = Number(payload.status) === 1;
  const apiFlag = payload.data?.api;
  const apiEnabled = apiFlag === true || apiFlag === 1;

  return {
    ok,
    code: payload.code,
    message: Array.isArray(payload.message) ? payload.message.join(" ") : payload.message,
    apiEnabled,
  };
}

/** Best-effort: turn on API access before collecting via /open/transact/payment. */
export async function ensureMoolreApiEnabled(): Promise<void> {
  if (!isMoolreAccountApiConfigured()) return;
  try {
    await enableMoolreApiAccess();
  } catch {
    // Payment may still work if already enabled
  }
}
