"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import CountryPhoneFields from "@/components/checkout/CountryPhoneFields";
import CourseCoverImage from "@/components/CourseCoverImage";
import CheckMark from "@/components/ui/CheckMark";
import { ACTIVE_PAYMENT_OPTIONS } from "@/lib/constants";
import type { CoursePageData } from "@/lib/courses/types";
import { DEFAULT_COUNTRY_CODE } from "@/lib/geo/countries";
import { moolreNetworkLabel, normalizeGhanaMoMoPhone } from "@/lib/payments/moolre-phone";
import type { InitializePaymentResult, PaymentProvider } from "@/lib/payments/types";

type CheckoutFormProps = {
  data: CoursePageData;
};

const MOOLRE_PROVIDER: PaymentProvider = "moolre";

function momoNetworkHint(phone: string): string | null {
  try {
    return moolreNetworkLabel(normalizeGhanaMoMoPhone(phone));
  } catch {
    return null;
  }
}

export default function CheckoutForm({ data }: CheckoutFormProps) {
  const { course, valueStack, checkoutIncluded, landingPath, badge, brandName, media } = data;
  const paymentOption = ACTIVE_PAYMENT_OPTIONS[0];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    countryCode: DEFAULT_COUNTRY_CODE,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [pendingReference, setPendingReference] = useState("");
  const [otpNetwork, setOtpNetwork] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const detectedNetwork = useMemo(() => momoNetworkHint(form.phone), [form.phone]);

  const startPayment = async (options?: { momoOtpCode?: string; existingReference?: string }) => {
    const response = await fetch("/api/payments/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        provider: MOOLRE_PROVIDER,
        courseSlug: data.slug,
        momoOtpCode: options?.momoOtpCode,
        existingReference: options?.existingReference,
      }),
    });

    const result = (await response.json()) as InitializePaymentResult & { error?: string };

    if (!response.ok) {
      throw new Error(result.error ?? "Could not start payment");
    }

    if (result.momoOtpRequired) {
      setOtpStep(true);
      setPendingReference(result.reference);
      setOtpNetwork(result.momoNetwork ?? detectedNetwork ?? "");
      setOtpCode("");
      setIsSubmitting(false);
      return;
    }

    const isMomoPrompt = result.moolreFlow === "momo-prompt" || result.momoPrompt === true;

    if (isMomoPrompt) {
      const params = new URLSearchParams({
        reference: String(result.reference),
        provider: "moolre",
        course: data.slug,
        momo: "1",
      });
      if (result.momoNetwork) params.set("network", result.momoNetwork);
      window.location.href = `/success?${params.toString()}`;
      return;
    }

    if (result.checkoutUrl) {
      throw new Error(
        "Phone prompt mode is required but a payment webpage was returned. Contact the course provider."
      );
    }

    throw new Error("Payment could not be started. Please try again.");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await startPayment();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!otpCode.trim() || !pendingReference) return;

    setError("");
    setIsSubmitting(true);

    try {
      await startPayment({
        momoOtpCode: otpCode.trim(),
        existingReference: pendingReference,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const totalValue = valueStack.reduce((sum, item) => sum + item.value, 0);

  const submitLabel = isSubmitting
    ? otpStep
      ? "Confirming code…"
      : "Sending MoMo prompt to your phone…"
    : otpStep
      ? "Confirm & send MoMo prompt"
      : `Pay ${course.currency} ${course.price} with MoMo`;

  return (
    <main className="min-h-screen bg-gray-light">
      <header className="bg-black text-white py-4 px-4">
        <Link href={landingPath} className="flex items-center gap-2 max-w-7xl mx-auto w-fit">
          <span className="w-8 h-8 rounded-lg bg-purple flex items-center justify-center text-sm font-bold">
            {badge}
          </span>
          <span className="font-bold">{brandName}</span>
        </Link>
      </header>

      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Complete your enrollment</h1>
        <p className="text-gray-muted text-center mb-8 max-w-lg mx-auto">
          Enter your MoMo number — we&apos;ll send a payment prompt straight to your phone for{" "}
          <strong>{course.title}</strong>. No login or redirect needed.
        </p>

        <section className="grid lg:grid-cols-2 gap-8">
          <aside className="rounded-2xl bg-white p-6 sm:p-8 border border-black/5 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-6">Order summary</h2>

            <section className="flex gap-4 mb-6 pb-6 border-b border-black/5">
              <CourseCoverImage
                title={course.title}
                coverUrl={media?.coverImage}
                badge={badge}
                className="w-20 h-20 rounded-xl shrink-0"
              />
              <div>
                <h3 className="font-bold">{course.title}</h3>
                <p className="text-sm text-gray-muted mt-1">
                  {course.duration} · {course.lessons} lessons
                </p>
              </div>
            </section>

            <h3 className="font-semibold text-sm mb-3">What&apos;s included</h3>
            <ul className="space-y-2 mb-6 max-h-48 overflow-y-auto">
              {checkoutIncluded.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-muted">
                  <CheckMark className="w-4 h-4 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <section className="border-t border-black/5 pt-4 space-y-2">
              <p className="flex justify-between text-sm">
                <span>Total value</span>
                <span className="line-through text-gray-muted">
                  {course.currency} {totalValue.toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between text-sm">
                <span>Regular price</span>
                <span className="line-through text-gray-muted">
                  {course.currency} {course.oldPrice}
                </span>
              </p>
              <p className="flex justify-between font-bold text-lg">
                <span>You pay today</span>
                <span className="text-purple">
                  {course.currency} {course.price}
                </span>
              </p>
            </section>
          </aside>

          <form
            onSubmit={otpStep ? handleOtpSubmit : handleSubmit}
            className="rounded-2xl bg-white p-6 sm:p-8 border border-black/5 shadow-sm"
            noValidate
          >
            <h2 className="font-bold text-lg mb-2">Your details</h2>
            <p className="text-sm text-gray-muted mb-6">
              We use this to send your receipt, course access, and occasional updates about your program.
            </p>

            {error && (
              <p className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
                {error}
              </p>
            )}

            <fieldset className="space-y-4 mb-6 border-0 p-0 m-0">
              <legend className="sr-only">Contact information</legend>
              <label className="block">
                <span className="text-sm font-medium mb-1 block">Full name</span>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
                  placeholder="Your full name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium mb-1 block">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
                  placeholder="you@email.com"
                />
              </label>

              <CountryPhoneFields
                countryCode={form.countryCode}
                onCountryChange={(countryCode) => setForm((prev) => ({ ...prev, countryCode }))}
                phone={form.phone}
                onPhoneChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
                region={form.region}
                onRegionChange={(region) => setForm((prev) => ({ ...prev, region }))}
              />
            </fieldset>

            {otpStep && (
              <section className="mb-6 rounded-xl border border-gold/40 bg-gold/10 p-4 space-y-3">
                <p className="text-sm font-semibold">SMS verification required</p>
                <p className="text-xs text-gray-muted">
                  Moolre sent a verification code to your phone
                  {otpNetwork ? ` (${otpNetwork})` : ""}. Enter it below, then we&apos;ll send the MoMo
                  payment prompt.
                </p>
                <label className="block">
                  <span className="text-sm font-medium mb-1 block">Verification code</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20 tracking-widest"
                    placeholder="Enter SMS code"
                  />
                </label>
                <button
                  type="button"
                  className="text-xs text-purple hover:underline"
                  onClick={() => {
                    setOtpStep(false);
                    setPendingReference("");
                    setOtpCode("");
                  }}
                >
                  Start over
                </button>
              </section>
            )}

            {!otpStep && (
              <section className="mb-6 rounded-xl border border-purple/20 bg-purple/5 p-4 space-y-2">
                <p className="text-sm font-semibold text-purple">{paymentOption?.label ?? "Mobile Money"}</p>
                <p className="text-xs text-gray-muted">
                  After you pay, approve the charge on your phone{detectedNetwork ? ` (${detectedNetwork})` : ""}.
                  Enter your MoMo PIN when prompted — your course unlocks automatically.
                </p>
                <ol className="text-xs text-gray-muted list-decimal list-inside space-y-1 pt-1">
                  <li>Tap Pay below</li>
                  <li>Check your phone for the MoMo approval request</li>
                  <li>Enter your PIN to confirm</li>
                </ol>
              </section>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full mb-4"
              disabled={isSubmitting || (otpStep && !otpCode.trim())}
            >
              {submitLabel}
            </Button>

            <p className="text-center text-xs text-gray-muted mb-4">
              <Link href={landingPath} className="text-purple hover:underline">
                Back to course page
              </Link>
            </p>

            <p className="text-center text-xs text-gray-muted">
              Secure payment · Instant access after confirmation · {course.guaranteeDays}-day money-back guarantee
            </p>
          </form>
        </section>
      </article>
    </main>
  );
}
