const MOOLRE_USER_MESSAGES: Record<string, string> = {
  AIN01:
    "Moolre could not verify your merchant account. On Vercel, set MOOLRE_API_USER and MOOLRE_PUBLIC_KEY (Production) and redeploy. Use the username and Public API Key from app.moolre.com — not your login password.",
  AIN02:
    "Moolre public key is invalid or missing. Copy the Public API Key from app.moolre.com into MOOLRE_PUBLIC_KEY on Vercel, then redeploy.",
  TP14:
    "Direct Mobile Money prompts are not enabled on your Moolre account yet. Complete SMS verification at app.moolre.com, or checkout will open Moolre's payment page instead.",
  TP09:
    "This mobile network is not enabled for API payments on the merchant Moolre account. Try MTN, Telecel, or AT — or contact the course provider.",
  TR03: "Enter a valid Ghana MoMo number starting with 0 (e.g. 0241234567). Do not include +233.",
  TP04: "Payment could not be started — merchant Moolre account or currency settings may be wrong.",
  TP01: "Mobile Money only accepts Ghana cedis (GHS). Set the course currency to GHS in Admin, then try again.",
  TP13: "This payment reference was already used. Refresh checkout and try again.",
  INP02: "This payment was already started. Refresh checkout and try again.",
};

export function moolreErrorMessage(code: string | undefined, fallback: string): string {
  if (code) {
    const mapped = MOOLRE_USER_MESSAGES[code.toUpperCase()];
    if (mapped) return mapped;
  }

  const lower = fallback.toLowerCase();
  if (lower.includes("currency invalid")) {
    return MOOLRE_USER_MESSAGES.TP01;
  }
  if (
    lower.includes("authentication error") ||
    lower.includes("user not found") ||
    lower.includes("unauthorized")
  ) {
    return MOOLRE_USER_MESSAGES.AIN01;
  }

  return fallback;
}

/** True when Moolre accepted the request and should have sent a MoMo approval prompt (code TR099 per docs). */
export function isMoolrePromptSent(payload: {
  status?: number | string;
  code?: string;
  message?: string;
  data?: unknown;
}): boolean {
  const status = Number(payload.status);
  if (status !== 1) return false;

  const code = payload.code?.toUpperCase() ?? "";
  const blocked = new Set([
    "TP14",
    "TP09",
    "TR03",
    "TP04",
    "TP01",
    "TP13",
    "INP02",
    "PL02",
    "POS09",
    "AIN01",
    "AIN02",
  ]);
  if (blocked.has(code)) return false;

  // Official success code for /open/transact/payment
  if (code === "TR099") return true;

  // Some responses return a session UUID in data without a code
  if (typeof payload.data === "string" && payload.data.length > 0) return true;

  return /prompt|pin|approve|initiated|sent|ussd/i.test(payload.message ?? "");
}
