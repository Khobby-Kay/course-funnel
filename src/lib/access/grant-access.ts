import "server-only";

import {
  createAccessToken,
  type AccessPayload,
  type CourseEntitlement,
  verifyAccessToken,
} from "@/lib/access";
import { getCourseBySlug } from "@/lib/courses/server";
import { getConfirmedPayment, recordConfirmedPayment } from "@/lib/payments/confirmed-store";
import { verifyPayment } from "@/lib/payments";
import { moolreAmountMatchesPrice } from "@/lib/payments/providers/moolre";
import { getPendingPayment } from "@/lib/payments/pending-store";
import type { PaymentProvider } from "@/lib/payments/types";
import { parseCourseSlugFromReference } from "@/lib/payments/utils";

export type GrantAccessInput = {
  reference: string;
  provider: PaymentProvider | "demo";
  courseSlug?: string;
  existingToken?: string;
};

export type GrantAccessResult =
  | { ok: true; token: string; reference: string; courseSlug: string }
  | { ok: false; status: number; error: string };

function isDemoPayment(reference: string, provider: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return provider === "demo" || reference.includes("-demo-");
}

/** Resolve which course this payment belongs to (source of truth for dashboard redirect). */
export async function resolveCourseSlugForPayment(
  reference: string,
  provider: PaymentProvider | "demo",
  requestedSlug?: string
): Promise<string | null> {
  const confirmed = await getConfirmedPayment(reference);
  if (confirmed?.courseSlug) return confirmed.courseSlug;

  const pending = await getPendingPayment(reference);
  if (pending?.courseSlug) return pending.courseSlug;

  const fromReference = parseCourseSlugFromReference(reference);
  if (fromReference) return fromReference;

  if (isDemoPayment(reference, provider)) {
    return requestedSlug?.trim() || null;
  }

  const verified = await verifyPayment(reference, provider);
  if (verified.success && verified.courseSlug) {
    return verified.courseSlug;
  }

  return null;
}

export async function confirmPayment(
  reference: string,
  provider: PaymentProvider | "demo",
  courseSlug: string
): Promise<boolean> {
  if (isDemoPayment(reference, provider)) {
    return process.env.PAYMENTS_DEMO_MODE === "true";
  }

  const pending = await getPendingPayment(reference);
  if (!pending) {
    return false;
  }
  if (pending.courseSlug !== courseSlug || pending.provider !== provider) {
    return false;
  }

  const verified = await verifyPayment(reference, provider);
  if (!verified.success) {
    return false;
  }

  const resolvedSlug =
    verified.courseSlug || parseCourseSlugFromReference(reference) || pending?.courseSlug;

  if (resolvedSlug && resolvedSlug !== courseSlug) {
    return false;
  }

  const course = await getCourseBySlug(courseSlug);
  if (course && provider === "moolre") {
    const expectedPrice = course.marketing.course.price;
    if (!moolreAmountMatchesPrice(verified.amount, expectedPrice)) {
      return false;
    }
  }

  await recordConfirmedPayment({
    reference,
    provider,
    courseSlug,
    confirmedAt: Date.now(),
  });

  return true;
}

export async function grantAccessAfterPayment(
  input: GrantAccessInput
): Promise<GrantAccessResult> {
  const { reference, provider, existingToken } = input;

  if (!reference || !provider) {
    return { ok: false, status: 400, error: "Missing payment reference" };
  }

  const courseSlug = await resolveCourseSlugForPayment(
    reference,
    provider,
    input.courseSlug
  );

  if (!courseSlug) {
    return {
      ok: false,
      status: 400,
      error: "Could not determine which course this payment is for",
    };
  }

  const course = await getCourseBySlug(courseSlug);
  if (!course || course.status !== "published") {
    return { ok: false, status: 404, error: "Course not available" };
  }

  const paymentConfirmed = await confirmPayment(reference, provider, courseSlug);
  if (!paymentConfirmed) {
    return { ok: false, status: 403, error: "Payment not verified. Access denied." };
  }

  const existing: AccessPayload | null = existingToken
    ? await verifyAccessToken(existingToken)
    : null;

  const entitlement: CourseEntitlement = {
    courseSlug,
    reference,
    provider,
    grantedAt: Date.now(),
  };

  const token = await createAccessToken(existing, entitlement);

  await recordConfirmedPayment({
    reference,
    provider,
    courseSlug,
    confirmedAt: Date.now(),
  });

  return { ok: true, token, reference, courseSlug };
}
