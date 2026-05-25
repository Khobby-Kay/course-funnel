import { NextResponse } from "next/server";
import { getCourseBySlug } from "@/lib/courses/server";
import { initializePayment, isProviderConfigured } from "@/lib/payments";
import type { PaymentProvider } from "@/lib/payments/types";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  provider?: PaymentProvider;
  courseSlug?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const { name, email, phone, provider, courseSlug } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !provider || !courseSlug?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await getCourseBySlug(courseSlug.trim());
    if (!course || course.status !== "published") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (!isProviderConfigured(provider)) {
      return NextResponse.json(
        { error: `${provider} is not configured. Add API keys to .env.local` },
        { status: 503 }
      );
    }

    const result = await initializePayment({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      provider,
      courseSlug: course.slug,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment initialization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
