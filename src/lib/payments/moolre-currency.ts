/** Moolre MoMo wallets in Ghana only accept GHS (ISO 4217). */
export const MOOLRE_CURRENCY = "GHS";

export function normalizeCurrencyCode(value: string | undefined): string {
  return (value ?? "").trim().toUpperCase();
}

export function assertMoolreCurrency(courseCurrency: string): string {
  const normalized = normalizeCurrencyCode(courseCurrency);
  const override = normalizeCurrencyCode(process.env.MOOLRE_CURRENCY);

  if (override && override !== MOOLRE_CURRENCY) {
    throw new Error(
      `MOOLRE_CURRENCY must be GHS for Mobile Money. Your wallet is a Ghana cedis (GHS) account.`
    );
  }

  if (normalized !== MOOLRE_CURRENCY) {
    throw new Error(
      `Mobile Money checkout requires ${MOOLRE_CURRENCY}. This course is priced in ${courseCurrency || "an unknown currency"}. Open Admin → edit the course → set Currency to GHS, then try again.`
    );
  }

  return MOOLRE_CURRENCY;
}
