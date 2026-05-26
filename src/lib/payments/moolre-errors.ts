const MOOLRE_USER_MESSAGES: Record<string, string> = {
  TP14:
    "Mobile Money setup is incomplete on the merchant Moolre account. The store owner must log in at app.moolre.com and complete SMS verification, then try again.",
  TP09:
    "This mobile network is not enabled for API payments on the merchant Moolre account. Try MTN, Telecel, or AT — or contact the course provider.",
  TR03: "Enter a valid Ghana MoMo number starting with 0 (e.g. 0241234567). Do not include +233.",
  TP04: "Payment could not be started — merchant Moolre account or currency settings may be wrong.",
  INP02: "This payment was already started. Refresh checkout and try again.",
};

export function moolreErrorMessage(code: string | undefined, fallback: string): string {
  if (!code) return fallback;
  return MOOLRE_USER_MESSAGES[code] ?? fallback;
}

/** True when Moolre accepted the request and should have sent a MoMo approval prompt. */
export function isMoolrePromptSent(payload: {
  status?: number | string;
  code?: string;
  message?: string;
}): boolean {
  const status = Number(payload.status);
  if (status !== 1) return false;

  const code = payload.code?.toUpperCase() ?? "";
  const blocked = new Set(["TP14", "TP09", "TR03", "TP04", "INP02", "PL02", "POS09"]);
  if (blocked.has(code)) return false;
  if (code) return true;

  return /prompt|pin|approve|initiated|sent|ussd/i.test(payload.message ?? "");
}
