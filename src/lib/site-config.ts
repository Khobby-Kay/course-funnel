/**
 * Public site configuration — reads from environment variables.
 * Copy `env.example` → `.env.local` and fill in when ready.
 */

function env(key: string, fallback = ""): string {
  return process.env[key]?.trim() || fallback;
}

export const siteConfig = {
  appUrl: env("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  whatsappNumber: env("NEXT_PUBLIC_WHATSAPP_NUMBER", "233000000000"),
  whatsappMessage: env(
    "NEXT_PUBLIC_WHATSAPP_MESSAGE",
    "Hi! I have a question about the Digital Marketing course."
  ),
  lmsUrl: env("NEXT_PUBLIC_LMS_URL"),
  successRedirectSeconds: Number(env("NEXT_PUBLIC_SUCCESS_REDIRECT_SECONDS", "5")),
  paymentsDemoMode: env("PAYMENTS_DEMO_MODE", "false") === "true",
};

export const assets = {
  instructorPhoto: env("NEXT_PUBLIC_INSTRUCTOR_PHOTO"),
  courseVideoUrl: env("NEXT_PUBLIC_COURSE_VIDEO_URL"),
  courseVideoPoster: env("NEXT_PUBLIC_COURSE_VIDEO_POSTER"),
  previewScreenshots: [
    env("NEXT_PUBLIC_SCREENSHOT_1"),
    env("NEXT_PUBLIC_SCREENSHOT_2"),
    env("NEXT_PUBLIC_SCREENSHOT_3"),
  ].filter(Boolean),
};

export function whatsappHref(): string {
  const text = encodeURIComponent(siteConfig.whatsappMessage);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function hasAsset(path: string | undefined): path is string {
  return Boolean(path && path.length > 0);
}

export function isExternalUrl(path: string): boolean {
  return path.startsWith("http://") || path.startsWith("https://");
}
