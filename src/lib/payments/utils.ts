import type { PaymentProvider } from "./types";

const REF_PROVIDERS = "moolre|paystack|flutterwave|card|demo";

/** Embeds course slug in the reference so grant can resolve the right dashboard. */
export function createPaymentReference(provider: PaymentProvider | "demo", courseSlug: string): string {
  const safeSlug = courseSlug.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").toLowerCase();
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `cf-${safeSlug}-${provider}-${stamp}-${random}`;
}

/** Parse course slug from references created by createPaymentReference. */
export function parseCourseSlugFromReference(reference: string): string | null {
  const match = reference.match(new RegExp(`^cf-(.+)-(${REF_PROVIDERS})-[a-z0-9]+-[a-z0-9]+$`, "i"));
  return match?.[1]?.toLowerCase() ?? null;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

/** True only when explicitly enabled — never auto-demo when API keys are missing (prevents free access). */
export function isDemoMode(): boolean {
  return process.env.PAYMENTS_DEMO_MODE === "true";
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
