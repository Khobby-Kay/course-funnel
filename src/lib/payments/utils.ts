import type { PaymentProvider } from "./types";

export function createPaymentReference(provider: PaymentProvider, courseSlug: string): string {
  const prefix = courseSlug.replace(/[^a-z0-9]/gi, "").slice(0, 6) || "course";
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${provider}-${stamp}-${random}`.toLowerCase();
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

export function isDemoMode(): boolean {
  if (process.env.PAYMENTS_DEMO_MODE === "true") return true;
  if (process.env.PAYMENTS_DEMO_MODE === "false") return false;
  return !hasAnyPaymentProvider();
}

export function hasAnyPaymentProvider(): boolean {
  return Boolean(
    process.env.PAYSTACK_SECRET_KEY ||
      process.env.FLUTTERWAVE_SECRET_KEY ||
      process.env.MOOLRE_API_USER
  );
}

export function amountToMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}
