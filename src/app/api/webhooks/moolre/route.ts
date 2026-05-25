import { NextResponse } from "next/server";
import { recordConfirmedPayment } from "@/lib/payments/confirmed-store";
import type { PaymentProvider } from "@/lib/payments/types";

type MoolreWebhook = {
  status?: number | string;
  data?: {
    status?: string;
    externalref?: string;
    metadata?: {
      course_slug?: string;
    };
  };
  externalref?: string;
  metadata?: {
    course_slug?: string;
  };
};

export async function POST(request: Request) {
  let payload: MoolreWebhook;
  try {
    payload = (await request.json()) as MoolreWebhook;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const reference = payload.data?.externalref ?? payload.externalref;
  const courseSlug =
    payload.data?.metadata?.course_slug?.trim() ?? payload.metadata?.course_slug?.trim();
  const paid =
    payload.status === 1 ||
    payload.data?.status === "success" ||
    payload.data?.status === "successful";

  if (paid && reference && courseSlug) {
    recordConfirmedPayment({
      reference,
      provider: "moolre" as PaymentProvider,
      courseSlug,
      confirmedAt: Date.now(),
    });
  }

  return NextResponse.json({ received: true });
}
