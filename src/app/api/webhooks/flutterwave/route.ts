import { NextResponse } from "next/server";
import { recordConfirmedPayment } from "@/lib/payments/confirmed-store";
import type { PaymentProvider } from "@/lib/payments/types";

type FlutterwaveEvent = {
  event?: string;
  data?: {
    tx_ref?: string;
    status?: string;
    meta?: {
      course_slug?: string;
    };
  };
};

export async function POST(request: Request) {
  const secret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
  const signature = request.headers.get("verif-hash");

  if (secret && signature !== secret) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: FlutterwaveEvent;
  try {
    event = (await request.json()) as FlutterwaveEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const reference = event.data?.tx_ref;
  const courseSlug = event.data?.meta?.course_slug?.trim();
  const isSuccessful =
    event.event === "charge.completed" &&
    (event.data?.status === "successful" || event.data?.status === "success");

  if (isSuccessful && reference && courseSlug) {
    await recordConfirmedPayment({
      reference,
      provider: "flutterwave" as PaymentProvider,
      courseSlug,
      confirmedAt: Date.now(),
    });
  }

  return NextResponse.json({ received: true });
}
