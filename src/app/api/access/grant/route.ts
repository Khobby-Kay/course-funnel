import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, ACCESS_MAX_AGE } from "@/lib/access";
import { grantAccessAfterPayment } from "@/lib/access/grant-access";
import type { PaymentProvider } from "@/lib/payments/types";

type Body = {
  reference?: string;
  provider?: PaymentProvider | "demo";
  courseSlug?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const { reference, provider, courseSlug } = body;

    if (!reference || !provider) {
      return NextResponse.json({ error: "Missing payment reference" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const result = await grantAccessAfterPayment({
      reference,
      provider,
      courseSlug: courseSlug?.trim(),
      existingToken: cookieStore.get(ACCESS_COOKIE)?.value,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const response = NextResponse.json({
      ok: true,
      reference: result.reference,
      courseSlug: result.courseSlug,
      dashboardPath: `/dashboard/${result.courseSlug}`,
    });

    response.cookies.set(ACCESS_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Access grant failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
