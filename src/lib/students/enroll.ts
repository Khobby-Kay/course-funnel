import "server-only";

import { getCourseBySlug } from "@/lib/courses/server";
import {
  enrollmentConfirmationHtml,
  isEmailConfigured,
  sendEmail,
} from "@/lib/email/send";
import { getPendingPayment } from "@/lib/payments/pending-store";
import type { PaymentProvider } from "@/lib/payments/types";
import { getEnrollment, saveEnrollment } from "@/lib/students/store";
import type { StudentEnrollment } from "@/lib/students/types";

export async function enrollStudentAndSendConfirmation(params: {
  reference: string;
  courseSlug: string;
  provider: PaymentProvider | "demo";
}): Promise<{ enrolled: boolean; emailSent: boolean; emailError?: string }> {
  const pending = await getPendingPayment(params.reference);
  const existing = await getEnrollment(params.reference);

  const email = pending?.email?.trim().toLowerCase();
  const name = pending?.name?.trim() || "Student";
  const phone = pending?.phone?.trim() || "";

  if (!email) {
    return { enrolled: false, emailSent: false, emailError: "No email on file for this payment" };
  }

  const enrollment: StudentEnrollment = {
    reference: params.reference,
    email,
    name,
    phone,
    region: pending?.region?.trim() || existing?.region || "",
    countryCode: pending?.countryCode?.trim() || existing?.countryCode || "GH",
    courseSlug: params.courseSlug,
    provider: params.provider,
    enrolledAt: existing?.enrolledAt ?? Date.now(),
    confirmationEmailSentAt: existing?.confirmationEmailSentAt,
  };

  await saveEnrollment(enrollment);

  if (existing?.confirmationEmailSentAt) {
    return { enrolled: true, emailSent: true };
  }

  if (!isEmailConfigured()) {
    return { enrolled: true, emailSent: false, emailError: "Email not configured (RESEND_API_KEY)" };
  }

  const course = await getCourseBySlug(params.courseSlug);
  const courseTitle = course?.marketing.course.title ?? params.courseSlug;

  const result = await sendEmail({
    to: email,
    subject: `You're enrolled — ${courseTitle}`,
    html: enrollmentConfirmationHtml({
      name,
      courseTitle,
      courseSlug: params.courseSlug,
      reference: params.reference,
    }),
  });

  if (result.ok) {
    await saveEnrollment({
      ...enrollment,
      confirmationEmailSentAt: Date.now(),
    });
    return { enrolled: true, emailSent: true };
  }

  return { enrolled: true, emailSent: false, emailError: result.error };
}
