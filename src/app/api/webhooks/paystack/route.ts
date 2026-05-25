import crypto from "crypto";
import { NextResponse } from "next/server";
import { recordConfirmedPayment } from "@/lib/payments/confirmed-store";
import type { PaymentProvider } from "@/lib/payments/types";

type PaystackEvent = {
  event?: string;
  data?: {
    reference?: string;
    status?: string;
    metadata?: {
      course_slug?: string;
      custom_fields?: Array<{ variable_name?: string; value?: string }>;
    };
  };
};

function extractCourseSlug(data: PaystackEvent["data"]): string | undefined {
  if (!data) return undefined;
  const direct = data.metadata?.course_slug;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const field = data.metadata?.custom_fields?.find(
    (item) => item.variable_name === "course_slug" && typeof item.value === "string"
  );
  return field?.value?.trim() || undefined;
}

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
  const signature = request.headers.get("x-paystack-signature");
  const rawBody = await request.text();

  if (secret && signature) {
    const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: PaystackEvent;
  try {
    event = JSON.parse(rawBody) as PaystackEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference && event.data.status === "success") {
    const courseSlug = extractCourseSlug(event.data);
    if (courseSlug) {
      recordConfirmedPayment({
        reference: event.data.reference,
        provider: "paystack" as PaymentProvider,
        courseSlug,
        confirmedAt: Date.now(),
      });
    }
  }

  return NextResponse.json({ received: true });
}
