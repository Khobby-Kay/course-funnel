import type { CoursePricing, InitializePaymentInput, InitializePaymentResult } from "../types";
import { createPaymentReference, getAppUrl } from "../utils";

type FlutterwaveInitResponse = {
  status: string;
  message: string;
  data?: {
    link: string;
  };
};

export async function initializeFlutterwave(
  input: InitializePaymentInput,
  pricing: CoursePricing
): Promise<InitializePaymentResult> {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secret) throw new Error("Flutterwave is not configured");

  const reference = createPaymentReference("flutterwave", pricing.slug);
  const redirectUrl = `${getAppUrl()}/success?reference=${reference}&provider=flutterwave&course=${pricing.slug}`;

  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: reference,
      amount: pricing.price,
      currency: pricing.currency,
      redirect_url: redirectUrl,
      customer: {
        email: input.email,
        phonenumber: input.phone,
        name: input.name,
      },
      customizations: {
        title: pricing.title,
        description: "Course enrollment — instant access",
      },
      meta: {
        course: pricing.title,
        course_slug: pricing.slug,
      },
    }),
  });

  const payload = (await response.json()) as FlutterwaveInitResponse;
  if (!response.ok || payload.status !== "success" || !payload.data?.link) {
    throw new Error(payload.message || "Flutterwave initialization failed");
  }

  return {
    checkoutUrl: payload.data.link,
    reference,
    provider: "flutterwave",
  };
}

export async function verifyFlutterwave(reference: string) {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secret) throw new Error("Flutterwave is not configured");

  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` } }
  );

  const payload = await response.json();
  const data = payload?.data;

  return {
    success: payload?.status === "success" && data?.status === "successful",
    reference,
    provider: "flutterwave" as const,
    amount: typeof data?.amount === "number" ? data.amount : undefined,
    currency: data?.currency,
    customerEmail: data?.customer?.email,
  };
}
