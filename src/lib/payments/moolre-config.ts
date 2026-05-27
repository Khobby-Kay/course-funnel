/**
 * Moolre checkout mode. Production uses direct phone prompts only.
 * Hosted pos.moolre.com is opt-in via MOOLRE_ALLOW_HOSTED_LINK=true (debugging only).
 */
export type MoolrePaymentMode = "momo" | "link";

export function getMoolrePaymentMode(): MoolrePaymentMode {
  const allowHosted =
    process.env.MOOLRE_ALLOW_HOSTED_LINK?.trim().toLowerCase() === "true";
  const mode = process.env.MOOLRE_PAYMENT_MODE?.trim().toLowerCase();

  if (allowHosted && mode === "link") {
    return "link";
  }

  return "momo";
}

export function prefersDirectMomoPrompt(): boolean {
  return getMoolrePaymentMode() === "momo";
}
