import type { CoursePricing, InitializePaymentInput, InitializePaymentResult } from "../types";
import { amountToMinorUnits, createPaymentReference, getAppUrl } from "../utils";

type PaystackInitResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export async function initializePaystack(
  input: InitializePaymentInput,
  pricing: CoursePricing,
  channels?: string[]
): Promise<InitializePaymentResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured");

  const reference = createPaymentReference("paystack", pricing.slug);
  const callbackUrl = `${getAppUrl()}/success?reference=${reference}&provider=paystack&course=${pricing.slug}`;

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: amountToMinorUnits(pricing.price),
      currency: pricing.currency,
      reference,
      callback_url: callbackUrl,
      channels: channels ?? ["mobile_money", "card", "bank"],
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: input.name },
          { display_name: "Phone", variable_name: "phone", value: input.phone },
          { display_name: "Course", variable_name: "course_slug", value: pricing.slug },
        ],
        course_slug: pricing.slug,
      },
    }),
  });

  const payload = (await response.json()) as PaystackInitResponse;
  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    throw new Error(payload.message || "Paystack initialization failed");
  }

  return {
    checkoutUrl: payload.data.authorization_url,
    reference: payload.data.reference ?? reference,
    provider: channels?.includes("card") ? "card" : "paystack",
  };
}

export async function verifyPaystack(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured");

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });

  const payload = await response.json();
  const data = payload?.data;

  const meta = data?.metadata;
  const courseSlug =
    (typeof meta?.course_slug === "string" ? meta.course_slug.trim() : undefined) ||
    meta?.custom_fields?.find(
      (item: { variable_name?: string; value?: string }) =>
        item.variable_name === "course_slug" && typeof item.value === "string"
    )?.value?.trim();

  return {
    success: payload?.status === true && data?.status === "success",
    reference,
    provider: "paystack" as const,
    courseSlug: courseSlug || undefined,
    amount: typeof data?.amount === "number" ? data.amount / 100 : undefined,
    currency: data?.currency,
    customerEmail: data?.customer?.email,
  };
}
