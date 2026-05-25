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
import type { PaymentProvider } from "@/lib/payments/types";
import { isDemoMode } from "@/lib/payments/utils";

export type GrantAccessInput = {
  reference: string;
  provider: PaymentProvider | "demo";
  courseSlug: string;
  existingToken?: string;
};

export type GrantAccessResult =
  | { ok: true; token: string; reference: string; courseSlug: string }
  | { ok: false; status: number; error: string };

function isDemoPayment(reference: string, provider: string): boolean {
  return provider === "demo" || reference.startsWith("demo-");
}

export async function confirmPayment(
  reference: string,
  provider: PaymentProvider | "demo",
  courseSlug: string
): Promise<boolean> {
  if (isDemoPayment(reference, provider)) return true;

  const stored = getConfirmedPayment(reference);
  if (stored?.courseSlug === courseSlug) return true;

  if (isDemoMode()) return true;

  const verified = await verifyPayment(reference, provider);
  if (!verified.success) return false;

  recordConfirmedPayment({
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
  const { reference, provider, courseSlug, existingToken } = input;

  if (!reference || !provider || !courseSlug) {
    return { ok: false, status: 400, error: "Missing payment reference or course" };
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

  return { ok: true, token, reference, courseSlug };
}
