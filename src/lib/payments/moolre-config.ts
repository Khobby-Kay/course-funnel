/** How Moolre checkout behaves. Default: direct phone prompt (best UX once merchant is verified). */
export type MoolrePaymentMode = "momo" | "link";

export function getMoolrePaymentMode(): MoolrePaymentMode {
  const mode = process.env.MOOLRE_PAYMENT_MODE?.trim().toLowerCase();
  if (mode === "link") return "link";
  return "momo";
}

export function prefersDirectMomoPrompt(): boolean {
  return getMoolrePaymentMode() === "momo";
}
