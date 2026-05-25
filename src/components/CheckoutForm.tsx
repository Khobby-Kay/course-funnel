"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { PAYMENT_OPTIONS } from "@/lib/constants";
import type { CoursePageData } from "@/lib/courses/types";
import type { PaymentProvider } from "@/lib/payments/types";
import { siteConfig } from "@/lib/site-config";

type CheckoutFormProps = {
  data: CoursePageData;
};

export default function CheckoutForm({ data }: CheckoutFormProps) {
  const { course, ctas, valueStack, checkoutIncluded, landingPath, badge, brandName } = data;

  const [provider, setProvider] = useState<PaymentProvider>(PAYMENT_OPTIONS[0].id);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, provider, courseSlug: data.slug }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not start payment");
      }

      window.location.href = result.checkoutUrl as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const totalValue = valueStack.reduce((sum, item) => sum + item.value, 0);

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">You&apos;re One Step Away</h1>
        <p className="text-gray-muted text-center mb-8 max-w-lg mx-auto">
          Complete checkout for <strong>{course.title}</strong> and get instant access.
        </p>

        {siteConfig.paymentsDemoMode && (
          <p className="mb-6 text-center text-sm text-purple bg-purple/10 border border-purple/20 rounded-xl py-3 px-4 max-w-lg mx-auto">
            Demo mode — payments simulate success. Add API keys in{" "}
            <code className="font-mono">.env.local</code> when ready.
          </p>
        )}

        <section className="grid lg:grid-cols-2 gap-8">
          <aside className="rounded-2xl bg-white p-6 sm:p-8 border border-black/5 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-6">Order Summary</h2>

            <section className="flex gap-4 mb-6 pb-6 border-b border-black/5">
              <span
                className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple to-black shrink-0 flex items-center justify-center text-2xl"
                aria-hidden
              >
                📚
              </span>
              <div>
                <h3 className="font-bold">{course.title}</h3>
                <p className="text-sm text-gray-muted mt-1">
                  {course.duration} · {course.lessons} lessons
                </p>
              </div>
            </section>

            <h3 className="font-semibold text-sm mb-3">What&apos;s included:</h3>
            <ul className="space-y-2 mb-6 max-h-48 overflow-y-auto">
              {checkoutIncluded.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-muted">
                  <span className="text-purple" aria-hidden>
                    ✔
                  </span>
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
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 sm:p-8 border border-black/5 shadow-sm"
            noValidate
          >
            <h2 className="font-bold text-lg mb-6">Payment Details</h2>

            {error && (
              <p className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
                {error}
              </p>
            )}

            <fieldset className="space-y-4 mb-6 border-0 p-0 m-0">
              <legend className="sr-only">Contact information</legend>
              <label className="block">
                <span className="text-sm font-medium mb-1 block">Full Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
                  placeholder="Enter your full name"
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
              <label className="block">
                <span className="text-sm font-medium mb-1 block">Phone Number (MoMo)</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
                  placeholder="0241234567 or +233..."
                />
              </label>
            </fieldset>

            <fieldset className="mb-6 border-0 p-0 m-0">
              <legend className="text-sm font-medium mb-3">Payment Method</legend>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PAYMENT_OPTIONS.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => setProvider(option.id)}
                      aria-pressed={provider === option.id}
                      className={`w-full px-3 py-3 rounded-xl text-left border transition-colors ${
                        provider === option.id
                          ? "border-purple bg-purple/10 text-purple"
                          : "border-black/10 hover:border-purple/30"
                      }`}
                    >
                      <span className="block font-semibold text-sm">{option.label}</span>
                      <span className="block text-xs opacity-70 mt-0.5">{option.hint}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>

            <Button type="submit" size="lg" className="w-full mb-4" disabled={isSubmitting}>
              {isSubmitting ? "Redirecting to payment…" : `${ctas.checkout} →`}
            </Button>

            <p className="text-center text-xs text-gray-muted mb-4">
              <Link href={landingPath} className="text-purple hover:underline">
                ← Back to course page
              </Link>
            </p>

            <ul className="flex flex-wrap justify-center gap-4 text-xs text-gray-muted">
              <li className="flex items-center gap-1">🔒 Secure payment</li>
              <li className="flex items-center gap-1">🛡️ SSL encrypted</li>
              <li className="flex items-center gap-1">↩️ Money-back guarantee</li>
            </ul>
          </form>
        </section>
      </article>
    </main>
  );
}
