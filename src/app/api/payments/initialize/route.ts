import { NextResponse } from "next/server";
import { getCourseBySlug } from "@/lib/courses/server";
import { isValidGhanaRegion } from "@/lib/geo/regions";
import { DEFAULT_COUNTRY_CODE } from "@/lib/geo/countries";
import { initializePayment, isProviderConfigured } from "@/lib/payments";
import { assertMoolreCurrency } from "@/lib/payments/moolre-currency";
import { getMoolreConfigIssues } from "@/lib/payments/utils";
import type { PaymentProvider } from "@/lib/payments/types";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  region?: string;
  countryCode?: string;
  provider?: PaymentProvider;
  courseSlug?: string;
  momoOtpCode?: string;
  existingReference?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const {
      name,
      email,
      phone,
      region,
      countryCode,
      provider,
      courseSlug,
      momoOtpCode,
      existingReference,
    } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !region?.trim() || !provider || !courseSlug?.trim()) {
      return NextResponse.json({ error: "Please fill in all required fields, including your region." }, { status: 400 });
    }

    if (!isValidGhanaRegion(region.trim())) {
      return NextResponse.json({ error: "Please select a valid region." }, { status: 400 });
    }

    if (provider !== "moolre") {
      return NextResponse.json(
        { error: "Only Moolre Mobile Money is enabled right now. Card payments coming soon." },
        { status: 400 }
      );
    }

    const course = await getCourseBySlug(courseSlug.trim());
    if (!course || course.status !== "published") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (provider === "moolre") {
      try {
        assertMoolreCurrency(course.marketing.course.currency);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Course currency must be GHS for Mobile Money.";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    if (!isProviderConfigured(provider)) {
      const missing = provider === "moolre" ? getMoolreConfigIssues() : [];
      const hint =
        missing.length > 0
          ? ` Missing: ${missing.join(", ")}. Add to .env.local and restart npm run dev, or to Vercel → Settings → Environment Variables and redeploy.`
          : " Add API keys to .env.local (local) or Vercel env vars (production).";
      return NextResponse.json(
        { error: `${provider} is not configured.${hint}` },
        { status: 503 }
      );
    }

    const result = await initializePayment({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      region: region.trim(),
      countryCode: (countryCode?.trim() || DEFAULT_COUNTRY_CODE).toUpperCase(),
      provider,
      courseSlug: course.slug,
      momoOtpCode: momoOtpCode?.trim(),
      existingReference: existingReference?.trim(),
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment initialization failed";
    const status =
      message.includes("GHS") || message.toLowerCase().includes("currency") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
