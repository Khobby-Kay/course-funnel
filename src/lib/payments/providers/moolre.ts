import type { CoursePricing, InitializePaymentInput, InitializePaymentResult, VerifyPaymentResult } from "../types";
import {
  isMoolrePaid,
  parseMoolreAmount,
  parseMoolreCourseSlug,
  type MoolreStatusPayload,
} from "../moolre-status";
import { assertMoolreCurrency } from "../moolre-currency";
import { ensureMoolreApiEnabled } from "../moolre-account";
import { isMoolrePromptSent, moolreErrorMessage } from "../moolre-errors";
import { prefersDirectMomoPrompt } from "../moolre-config";
import { normalizeGhanaMoMoPhone, resolveMoolreChannelFromPhone, moolreNetworkLabel } from "../moolre-phone";
import { createPaymentReference, getAppUrl, parseCourseSlugFromReference } from "../utils";

type MoolreApiResponse = {
  status?: number | string;
  code?: string;
  message?: string;
  data?: unknown;
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

  const reference =
    input.existingReference?.trim() || createPaymentReference("moolre", pricing.slug);

  if (prefersDirectMomoPrompt()) {
    await ensureMoolreApiEnabled();
    return initializeMoolreDirectMomo({
      input,
      pricing,
      reference,
      accountNumber,
    });
  }

  const appUrl = getAppUrl();
  const redirect = `${appUrl}/success?reference=${encodeURIComponent(reference)}&provider=moolre&course=${encodeURIComponent(pricing.slug)}`;

  return initializeMoolreHostedLink({
    input,
    pricing,
    reference,
    accountNumber,
    redirect,
    appUrl,
  });
}

/** Send a USSD/MoMo approval prompt to the customer's phone — no webpage. */
async function initializeMoolreDirectMomo(params: {
  input: InitializePaymentInput;
  pricing: CoursePricing;
  reference: string;
  accountNumber: string;
}): Promise<InitializePaymentResult> {
  const payer = normalizeGhanaMoMoPhone(params.input.phone);
  const channel = String(resolveMoolreChannelFromPhone(payer));
  const currency = assertMoolreCurrency(params.pricing.currency);
  const otp = params.input.momoOtpCode?.trim();

  const requestBody: Record<string, string | number> = {
    type: 1,
    amount: String(params.pricing.price),
    externalref: params.reference,
    currency,
    accountnumber: params.accountNumber,
    payer,
    channel,
  };

  if (otp) {
    requestBody.otpcode = otp;
  }

  const response = await fetch(`${getMoolreBaseUrl()}/open/transact/payment`, {
    method: "POST",
    headers: getMoolreHeaders(),
    body: JSON.stringify(requestBody),
  });

  let payload: MoolreApiResponse;
  try {
    payload = (await response.json()) as MoolreApiResponse;
  } catch {
    throw new Error("Could not reach Moolre. Please try again.");
  }

  const code = payload.code?.toUpperCase() ?? "";

  if (code === "TP14" && !otp) {
    return {
      reference: params.reference,
      provider: "moolre",
      momoOtpRequired: true,
      moolreFlow: "momo-otp",
      momoNetwork: moolreNetworkLabel(payer),
    };
  }

  if (!isMoolrePromptSent(payload)) {
    const msg = moolreErrorMessage(
      payload.code,
      payload.message || "Could not send Mobile Money prompt to your phone. Please try again."
    );
    throw new Error(msg);
  }

  return {
    reference: params.reference,
    provider: "moolre",
    momoPrompt: true,
    moolreFlow: "momo-prompt",
    momoNetwork: moolreNetworkLabel(payer),
  };
}

/** Hosted pos.moolre.com page — disabled unless MOOLRE_ALLOW_HOSTED_LINK=true. */
async function initializeMoolreHostedLink(params: {
  input: InitializePaymentInput;
  pricing: CoursePricing;
  reference: string;
  accountNumber: string;
  redirect: string;
  appUrl: string;
}): Promise<InitializePaymentResult> {
  const currency = assertMoolreCurrency(params.pricing.currency);

  const response = await fetch(`${getMoolreBaseUrl()}/embed/link`, {
    method: "POST",
    headers: getMoolreHeaders(),
    body: JSON.stringify({
      type: 1,
      amount: String(params.pricing.price),
      email: params.input.email,
      externalref: params.reference,
      callback: `${params.appUrl}/api/webhooks/moolre`,
      redirect: params.redirect,
      reusable: "0",
      currency,
      accountnumber: params.accountNumber,
      metadata: {
        name: params.input.name,
        phone: params.input.phone,
        course: params.pricing.title,
        course_slug: params.pricing.slug,
      },
    }),
  });

  const payload = (await response.json()) as MoolreApiResponse & {
    data?: { authorization_url?: string };
  };
  const checkoutUrl = payload.data?.authorization_url;

  if (!response.ok || Number(payload.status) !== 1 || !checkoutUrl) {
    throw new Error(
      moolreErrorMessage(payload.code, payload.message || "Moolre payment link generation failed")
    );
  }

  return {
    checkoutUrl,
    reference: params.reference,
    provider: "moolre",
    moolreFlow: "hosted-link",
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
      idtype: "1",
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

  if (!response.ok) {
    return {
      success: false,
      reference,
      provider: "moolre",
    };
  }

  const externalRef = payload.data?.externalref;
  if (externalRef && externalRef !== reference) {
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
  if (paidAmount === undefined || !Number.isFinite(paidAmount)) return false;
  return Math.abs(paidAmount - expectedPrice) < 0.01;
}
