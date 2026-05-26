import { loadCourseBySlug } from "@/lib/courses/store";
import type { InitializePaymentInput, InitializePaymentResult, PaymentProvider, VerifyPaymentResult } from "./types";
import type { CoursePricing } from "./types";
import { initializeFlutterwave, verifyFlutterwave } from "./providers/flutterwave";
import { initializeMoolre, verifyMoolre } from "./providers/moolre";
import { initializePaystack, verifyPaystack } from "./providers/paystack";
import { recordPendingPayment } from "./pending-store";
import { getAppUrl, isDemoMode, isMoolreConfigured } from "./utils";

export async function resolveCoursePricing(courseSlug: string): Promise<CoursePricing> {
  const course = await loadCourseBySlug(courseSlug);
  if (!course) throw new Error("Course not found");
  const meta = course.marketing.course;
  return {
    slug: course.slug,
    title: meta.title,
    price: meta.price,
    currency: meta.currency,
  };
}

export async function initializePayment(
  input: InitializePaymentInput
): Promise<InitializePaymentResult> {
  const pricing = await resolveCoursePricing(input.courseSlug);

  if (isDemoMode()) {
    const reference = `cf-${input.courseSlug.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").toLowerCase()}-demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    recordPendingPayment({
      reference,
      courseSlug: input.courseSlug,
      provider: "demo",
      createdAt: Date.now(),
    });
    return {
      checkoutUrl: `${getAppUrl()}/success?reference=${reference}&provider=demo&demo=1&course=${input.courseSlug}`,
      reference,
      provider: input.provider,
    };
  }

  let result: InitializePaymentResult;
  switch (input.provider) {
    case "moolre":
      result = await initializeMoolre(input, pricing);
      break;
    case "flutterwave":
      result = await initializeFlutterwave(input, pricing);
      break;
    case "card":
      result = await initializePaystack(input, pricing, ["card"]);
      break;
    case "paystack":
    default:
      result = await initializePaystack(input, pricing);
  }

  recordPendingPayment({
    reference: result.reference,
    courseSlug: input.courseSlug,
    provider: result.provider,
    createdAt: Date.now(),
  });

  return result;
}

export async function verifyPayment(
  reference: string,
  provider: PaymentProvider | "demo"
): Promise<VerifyPaymentResult> {
  if (provider === "demo" || reference.includes("-demo-")) {
    return {
      success: process.env.PAYMENTS_DEMO_MODE === "true",
      reference,
      provider: "moolre",
      amount: undefined,
      currency: undefined,
    };
  }

  switch (provider) {
    case "moolre":
      return verifyMoolre(reference);
    case "flutterwave":
      return verifyFlutterwave(reference);
    case "card":
    case "paystack":
      return verifyPaystack(reference);
    default:
      return { success: false, reference, provider: "paystack" };
  }
}

export function isProviderConfigured(provider: PaymentProvider): boolean {
  if (isDemoMode()) {
    return process.env.PAYMENTS_DEMO_MODE === "true";
  }

  switch (provider) {
    case "moolre":
      return isMoolreConfigured();
    case "flutterwave":
      return Boolean(process.env.FLUTTERWAVE_SECRET_KEY);
    case "card":
    case "paystack":
      return Boolean(process.env.PAYSTACK_SECRET_KEY);
    default:
      return false;
  }
}
