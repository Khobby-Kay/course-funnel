import type { CoursePricing, InitializePaymentInput, InitializePaymentResult, VerifyPaymentResult } from "../types";
import {
  isMoolrePaid,
  parseMoolreAmount,
  parseMoolreCourseSlug,
  type MoolreStatusPayload,
} from "../moolre-status";
import { createPaymentReference, getAppUrl, parseCourseSlugFromReference } from "../utils";

type MoolreLinkResponse = {
  status: number;
  code?: string;
  message?: string;
  data?: {
    authorization_url: string;
    reference: string;
  };
};

function getMoolreBaseUrl(): string {
  return process.env.MOOLRE_SANDBOX === "true"
    ? "https://sandbox.moolre.com"
    : "https://api.moolre.com";
}

function getMoolreHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-USER": process.env.MOOLRE_API_USER ?? "",
  };

  if (process.env.MOOLRE_SANDBOX !== "true" && process.env.MOOLRE_PUBLIC_KEY) {
    headers["X-API-PUBKEY"] = process.env.MOOLRE_PUBLIC_KEY;
  }

  return headers;
}

export async function initializeMoolre(
  input: InitializePaymentInput,
  pricing: CoursePricing
): Promise<InitializePaymentResult> {
  const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER;
  const apiUser = process.env.MOOLRE_API_USER;

  if (!accountNumber || !apiUser) {
    throw new Error("Moolre is not configured");
  }

  const reference = createPaymentReference("moolre", pricing.slug);
  const appUrl = getAppUrl();

  const response = await fetch(`${getMoolreBaseUrl()}/embed/link`, {
    method: "POST",
    headers: getMoolreHeaders(),
    body: JSON.stringify({
      type: 1,
      amount: String(pricing.price),
      email: input.email,
      externalref: reference,
      callback: `${appUrl}/api/webhooks/moolre`,
      redirect: `${appUrl}/success?reference=${encodeURIComponent(reference)}&provider=moolre&course=${encodeURIComponent(pricing.slug)}`,
      reusable: "0",
      currency: pricing.currency,
      accountnumber: accountNumber,
      metadata: {
        name: input.name,
        phone: input.phone,
        course: pricing.title,
        course_slug: pricing.slug,
      },
    }),
  });

  const payload = (await response.json()) as MoolreLinkResponse;
  const checkoutUrl = payload.data?.authorization_url;

  if (!response.ok || payload.status !== 1 || !checkoutUrl) {
    throw new Error(payload.message || "Moolre payment link generation failed");
  }

  return {
    checkoutUrl,
    reference,
    provider: "moolre",
  };
}

function buildVerifyResult(
  reference: string,
  payload: MoolreStatusPayload
): VerifyPaymentResult {
  const paid = isMoolrePaid(payload);
  const courseSlug =
    parseMoolreCourseSlug(payload) || parseCourseSlugFromReference(reference) || undefined;

  return {
    success: paid,
    reference,
    provider: "moolre",
    courseSlug,
    amount: parseMoolreAmount(payload),
    currency: typeof payload.data?.currency === "string" ? payload.data.currency : undefined,
    customerEmail: undefined,
  };
}

export async function verifyMoolre(reference: string): Promise<VerifyPaymentResult> {
  const apiUser = process.env.MOOLRE_API_USER;
  if (!apiUser) throw new Error("Moolre is not configured");

  const response = await fetch(`${getMoolreBaseUrl()}/open/transact/status`, {
    method: "POST",
    headers: getMoolreHeaders(),
    body: JSON.stringify({
      type: 1,
      idtype: 1,
      id: reference,
      accountnumber: process.env.MOOLRE_ACCOUNT_NUMBER,
    }),
  });

  let payload: MoolreStatusPayload;
  try {
    payload = await response.json();
  } catch {
    return {
      success: false,
      reference,
      provider: "moolre",
    };
  }

  return buildVerifyResult(reference, payload);
}

/** Validate paid amount matches course price (major units, e.g. GHS). */
export function moolreAmountMatchesPrice(
  paidAmount: number | undefined,
  expectedPrice: number
): boolean {
  if (paidAmount === undefined) return true;
  return Math.abs(paidAmount - expectedPrice) < 0.01;
}
