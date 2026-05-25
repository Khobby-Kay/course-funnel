import { loadCourseBySlug } from "@/lib/courses/store";
import type { InitializePaymentInput, InitializePaymentResult, PaymentProvider, VerifyPaymentResult } from "./types";
import type { CoursePricing } from "./types";
import { initializeFlutterwave, verifyFlutterwave } from "./providers/flutterwave";
import { initializeMoolre, verifyMoolre } from "./providers/moolre";
import { initializePaystack, verifyPaystack } from "./providers/paystack";
import { getAppUrl, isDemoMode } from "./utils";

export function resolveCoursePricing(courseSlug: string): CoursePricing {
  const course = loadCourseBySlug(courseSlug);
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
  const pricing = resolveCoursePricing(input.courseSlug);

  if (isDemoMode()) {
    const reference = `demo-${Date.now()}`;
    return {
      checkoutUrl: `${getAppUrl()}/success?reference=${reference}&provider=demo&demo=1&course=${input.courseSlug}`,
      reference,
      provider: input.provider,
    };
  }

  switch (input.provider) {
    case "moolre":
      return initializeMoolre(input, pricing);
    case "flutterwave":
      return initializeFlutterwave(input, pricing);
    case "card":
      return initializePaystack(input, pricing, ["card"]);
    case "paystack":
    default:
      return initializePaystack(input, pricing);
  }
}

export async function verifyPayment(
  reference: string,
  provider: PaymentProvider | "demo"
): Promise<VerifyPaymentResult> {
  if (provider === "demo" || reference.startsWith("demo-")) {
    return {
      success: true,
      reference,
      provider: "paystack",
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
  if (isDemoMode()) return true;

  switch (provider) {
    case "moolre":
      return Boolean(process.env.MOOLRE_API_USER && process.env.MOOLRE_ACCOUNT_NUMBER);
    case "flutterwave":
      return Boolean(process.env.FLUTTERWAVE_SECRET_KEY);
    case "card":
    case "paystack":
      return Boolean(process.env.PAYSTACK_SECRET_KEY);
    default:
      return false;
  }
}
