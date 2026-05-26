import type { CoursePricing, InitializePaymentInput, InitializePaymentResult } from "../types";
import { createPaymentReference, getAppUrl } from "../utils";

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
      redirect: `${appUrl}/success?reference=${reference}&provider=moolre&course=${pricing.slug}`,
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
    // Keep our externalref — matches redirect URL and Payment Status id (idtype=1)
    reference,
    provider: "moolre",
  };
}

export async function verifyMoolre(reference: string) {
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

  const payload = await response.json();
  const paid = payload?.status === 1 && payload?.data?.txstatus === 1;
  const meta = payload?.data?.metadata ?? payload?.metadata;
  const courseSlug =
    typeof meta?.course_slug === "string"
      ? meta.course_slug.trim()
      : typeof meta?.courseSlug === "string"
        ? meta.courseSlug.trim()
        : undefined;

  return {
    success: Boolean(paid),
    reference,
    provider: "moolre" as const,
    courseSlug: courseSlug || undefined,
    amount: undefined,
    currency: undefined,
    customerEmail: undefined,
  };
}
