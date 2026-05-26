import { NextResponse } from "next/server";
import { recordConfirmedPayment } from "@/lib/payments/confirmed-store";
import type { PaymentProvider } from "@/lib/payments/types";
import { parseCourseSlugFromReference } from "@/lib/payments/utils";

type MoolreWebhook = {
  status?: number | string;
  code?: string;
  message?: string;
  data?: {
    txstatus?: number;
    externalref?: string;
    metadata?: {
      course_slug?: string;
      courseSlug?: string;
    };
  };
  externalref?: string;
  metadata?: {
    course_slug?: string;
    courseSlug?: string;
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
  const meta = payload.data?.metadata ?? payload.metadata;
  const courseSlug =
    (typeof meta?.course_slug === "string" ? meta.course_slug.trim() : undefined) ||
    (typeof meta?.courseSlug === "string" ? meta.courseSlug.trim() : undefined) ||
    (reference ? parseCourseSlugFromReference(reference) : null) ||
    undefined;
  const paid = payload.status === 1 || payload.data?.txstatus === 1;

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
