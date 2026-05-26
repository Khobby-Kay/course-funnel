"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { courseCheckoutPath, courseDashboardPath } from "@/lib/courses";
import type { PaymentProvider } from "@/lib/payments/types";
import { siteConfig } from "@/lib/site-config";

function resolvePaymentReference(searchParams: URLSearchParams): string | null {
  return (
    searchParams.get("reference") ??
    searchParams.get("trxref") ??
    searchParams.get("tx_ref")
  );
}

type GrantResponse = {
  ok?: boolean;
  courseSlug?: string;
  dashboardPath?: string;
  confirmationEmailSent?: boolean;
  error?: string;
};

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = resolvePaymentReference(searchParams);
  const provider = searchParams.get("provider") as PaymentProvider | "demo" | null;
  const courseFromUrl = searchParams.get("course")?.trim() || "";
  const momoPrompt = searchParams.get("momo") === "1";

  const [grantedCourseSlug, setGrantedCourseSlug] = useState<string | null>(null);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    reference && provider ? "loading" : "failed"
  );
  const redirected = useRef(false);

  const dashboardHref = grantedCourseSlug
    ? courseDashboardPath(grantedCourseSlug)
    : courseFromUrl
      ? courseDashboardPath(courseFromUrl)
      : "/dashboard";
  const checkoutHref = courseFromUrl ? courseCheckoutPath(courseFromUrl) : "/";

  useEffect(() => {
    if (!reference || !provider) return;

    const grantAccess = async () => {
      const maxAttempts = provider === "moolre" ? 8 : 1;
      const delayMs = 2000;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const grantRes = await fetch("/api/access/grant", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reference,
              provider,
              courseSlug: courseFromUrl || undefined,
            }),
          });

          const data = (await grantRes.json().catch(() => ({}))) as GrantResponse;

          if (grantRes.ok && data.courseSlug) {
            setGrantedCourseSlug(data.courseSlug);
            setConfirmationEmailSent(Boolean(data.confirmationEmailSent));
            setStatus("success");
            return;
          }

          if (attempt < maxAttempts && provider === "moolre") {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            continue;
          }

          setStatus("failed");
          return;
        } catch {
          if (attempt < maxAttempts && provider === "moolre") {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            continue;
          }
          setStatus("failed");
          return;
        }
      }
    };

    grantAccess();
  }, [reference, provider, courseFromUrl]);

  useEffect(() => {
    if (status !== "success" || !grantedCourseSlug || redirected.current) return;

    const path = courseDashboardPath(grantedCourseSlug);

    if (siteConfig.successRedirectSeconds <= 0) return;

    const timer = setTimeout(() => {
      redirected.current = true;
      router.replace(path);
    }, siteConfig.successRedirectSeconds * 1000);

    return () => clearTimeout(timer);
  }, [status, grantedCourseSlug, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4 text-center max-w-md mx-auto">
        <p className="text-white/70">
          {momoPrompt
            ? "Approve the Mobile Money prompt on your phone, then wait while we confirm…"
            : "Confirming your payment and unlocking your course…"}
        </p>
        <p className="text-white/40 text-sm mt-2">
          MoMo payments can take a few seconds after you enter your PIN.
        </p>
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4">
        <article className="max-w-md text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Payment Not Confirmed</h1>
          <p className="text-white/70 mb-6">
            We couldn&apos;t verify this payment or grant course access. If money was deducted,
            contact support with reference:{" "}
            <span className="text-gold font-mono">{reference}</span>
          </p>
          <Button href={checkoutHref} size="lg">
            Try Again
          </Button>
        </article>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple/30 to-black flex items-center justify-center px-4">
      <article className="max-w-lg w-full text-center">
        <div
          className="inline-flex w-20 h-20 rounded-full bg-gold/20 text-4xl items-center justify-center mx-auto mb-6"
          aria-hidden
        >
          🎉
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Payment Successful</h1>
        <p className="text-white/70 text-lg mb-2">Your course is ready — open it below to start watching.</p>
        {confirmationEmailSent && (
          <p className="text-gold/90 text-sm mb-2">
            We sent a confirmation email with your dashboard link. Check your inbox (and spam folder).
          </p>
        )}
        {reference && <p className="text-white/40 text-sm mb-8 font-mono">Ref: {reference}</p>}

        <section className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button href={dashboardHref} size="lg">
            Start Watching Course
          </Button>
          <Button variant="secondary" size="lg" disabled ariaLabel="Receipt download coming soon">
            Download Receipt
          </Button>
        </section>

        {siteConfig.successRedirectSeconds > 0 && grantedCourseSlug && (
          <p className="text-white/50 text-sm">
            Opening your course in {siteConfig.successRedirectSeconds} seconds…{" "}
            <Link href={dashboardHref} className="text-gold hover:underline">
              Open now
            </Link>
          </p>
        )}
      </article>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black flex items-center justify-center">
          <p className="text-white/70">Confirming your payment…</p>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
