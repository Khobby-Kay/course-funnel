import "server-only";

import { getAppUrl } from "@/lib/payments/utils";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim());
}

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    return { ok: false, error: "Email is not configured. Set RESEND_API_KEY and EMAIL_FROM." };
  }

  const to = Array.isArray(input.to) ? input.to : [input.to];
  const replyTo = input.replyTo?.trim() || process.env.EMAIL_REPLY_TO?.trim();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: input.subject,
      html: input.html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as { id?: string; message?: string };

  if (!response.ok) {
    return { ok: false, error: payload.message ?? "Failed to send email" };
  }

  return { ok: true, id: payload.id };
}

export function enrollmentConfirmationHtml(params: {
  name: string;
  courseTitle: string;
  courseSlug: string;
  reference: string;
}): string {
  const dashboardUrl = `${getAppUrl()}/dashboard/${encodeURIComponent(params.courseSlug)}`;
  const firstName = params.name.trim().split(/\s+/)[0] || "there";

  return `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #111; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #5B21B6; font-size: 22px;">You're enrolled!</h1>
  <p>Hi ${escapeHtml(firstName)},</p>
  <p>Thank you for purchasing <strong>${escapeHtml(params.courseTitle)}</strong>. Your payment was confirmed and your course is ready.</p>
  <p style="margin: 28px 0;">
    <a href="${dashboardUrl}" style="background: #5B21B6; color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 600; display: inline-block;">
      Start watching →
    </a>
  </p>
  <p style="font-size: 14px; color: #555;">Or open: <a href="${dashboardUrl}">${dashboardUrl}</a></p>
  <p style="font-size: 13px; color: #888; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
    Payment reference: <code>${escapeHtml(params.reference)}</code><br />
    Save this email — you'll need the same browser/device or email if you return later.
  </p>
</body>
</html>`;
}

export function adminMessageHtml(params: {
  name: string;
  subject: string;
  body: string;
  courseTitle?: string;
}): string {
  const firstName = params.name.trim().split(/\s+/)[0] || "there";
  const paragraphs = params.body
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br />")}</p>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #111; max-width: 560px; margin: 0 auto; padding: 24px;">
  <p>Hi ${escapeHtml(firstName)},</p>
  ${params.courseTitle ? `<p><em>Re: ${escapeHtml(params.courseTitle)}</em></p>` : ""}
  ${paragraphs}
  <p style="font-size: 13px; color: #888; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
    You received this because you enrolled in one of our courses.
  </p>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
