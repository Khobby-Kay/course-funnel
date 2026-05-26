import { NextResponse } from "next/server";
import { getCourseBySlug } from "@/lib/courses/server";
import { verifyMoolre, moolreAmountMatchesPrice } from "@/lib/payments/providers/moolre";
import { isMoolrePaid, parseMoolreCourseSlug } from "@/lib/payments/moolre-status";
import { recordConfirmedPayment } from "@/lib/payments/confirmed-store";
import type { PaymentProvider } from "@/lib/payments/types";
import { parseCourseSlugFromReference } from "@/lib/payments/utils";

type MoolreWebhook = {
  status?: number | string;
  code?: string;
  message?: string;
  data?: {
    txstatus?: number | string;
    externalref?: string;
    amount?: number | string;
    currency?: string;
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
  if (!reference) {
    return NextResponse.json({ received: true, skipped: "no reference" });
  }

  if (!isMoolrePaid(payload)) {
    return NextResponse.json({ received: true, skipped: "not paid" });
  }

  const verified = await verifyMoolre(reference);
  if (!verified.success) {
    return NextResponse.json({ received: true, skipped: "verify failed" });
  }

  const courseSlug =
    verified.courseSlug ||
    parseMoolreCourseSlug(payload) ||
    parseCourseSlugFromReference(reference);

  if (!courseSlug) {
    return NextResponse.json({ received: true, skipped: "no course slug" });
  }

  const course = await getCourseBySlug(courseSlug);
  if (!course) {
    return NextResponse.json({ received: true, skipped: "unknown course" });
  }

  if (!moolreAmountMatchesPrice(verified.amount, course.marketing.course.price)) {
    return NextResponse.json({ received: true, skipped: "amount mismatch" });
  }

  await recordConfirmedPayment({
    reference,
    provider: "moolre" as PaymentProvider,
    courseSlug,
    confirmedAt: Date.now(),
  });

  return NextResponse.json({ received: true, confirmed: true });
}
