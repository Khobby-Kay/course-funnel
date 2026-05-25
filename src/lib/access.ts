const enc = new TextEncoder();

export const ACCESS_COOKIE = "course_access";
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 365;

export type CourseEntitlement = {
  courseSlug: string;
  reference: string;
  provider: string;
  grantedAt: number;
};

export type AccessPayload = {
  entitlements: CourseEntitlement[];
};

function getSecret(): string {
  const secret = process.env.ACCESS_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ACCESS_SECRET must be set in production");
  }
  return "dev-access-secret-change-me";
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

async function signData(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

function normalizePayload(raw: unknown): AccessPayload | null {
  if (!raw || typeof raw !== "object") return null;

  const legacy = raw as Record<string, unknown>;
  if (typeof legacy.reference === "string" && typeof legacy.provider === "string") {
    return {
      entitlements: [
        {
          courseSlug: "digital-marketing-mastery",
          reference: legacy.reference,
          provider: legacy.provider,
          grantedAt: typeof legacy.grantedAt === "number" ? legacy.grantedAt : Date.now(),
        },
      ],
    };
  }

  const entitlements = (legacy as AccessPayload).entitlements;
  if (!Array.isArray(entitlements) || entitlements.length === 0) return null;

  const valid = entitlements.every(
    (e) =>
      e &&
      typeof e.courseSlug === "string" &&
      typeof e.reference === "string" &&
      typeof e.provider === "string" &&
      typeof e.grantedAt === "number"
  );

  return valid ? { entitlements } : null;
}

export async function createAccessToken(
  existing: AccessPayload | null,
  entitlement: CourseEntitlement
): Promise<string> {
  const entitlements = [...(existing?.entitlements ?? [])];
  const index = entitlements.findIndex((e) => e.courseSlug === entitlement.courseSlug);
  if (index >= 0) entitlements[index] = entitlement;
  else entitlements.push(entitlement);

  const payload: AccessPayload = { entitlements };
  const data = toBase64Url(enc.encode(JSON.stringify(payload)));
  const sig = await signData(data);
  return `${data}.${sig}`;
}

export async function verifyAccessToken(token: string): Promise<AccessPayload | null> {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;

    const expected = await signData(data);
    if (!timingSafeEqual(sig, expected)) return null;

    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(data)));
    return normalizePayload(parsed);
  } catch {
    return null;
  }
}

export async function hasValidAccess(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const payload = await verifyAccessToken(cookieValue);
  return Boolean(payload?.entitlements.length);
}

export async function hasAccessToCourse(
  cookieValue: string | undefined,
  courseSlug: string
): Promise<boolean> {
  if (!cookieValue) return false;
  const payload = await verifyAccessToken(cookieValue);
  return Boolean(payload?.entitlements.some((e) => e.courseSlug === courseSlug));
}

export function getEntitlements(payload: AccessPayload | null): CourseEntitlement[] {
  return payload?.entitlements ?? [];
}
