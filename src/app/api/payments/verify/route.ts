import { NextResponse } from "next/server";
import { verifyPayment } from "@/lib/payments";
import type { PaymentProvider } from "@/lib/payments/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  const provider = searchParams.get("provider") as PaymentProvider | "demo" | null;

  if (!reference || !provider) {
    return NextResponse.json({ error: "Missing reference or provider" }, { status: 400 });
  }

  try {
    const result = await verifyPayment(reference, provider);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
