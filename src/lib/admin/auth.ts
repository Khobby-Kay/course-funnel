const enc = new TextEncoder();

export const ADMIN_COOKIE = "admin_session";
export const ADMIN_MAX_AGE = 60 * 60 * 24;

function getSecret(): string {
  const secret = (process.env.ADMIN_SECRET || process.env.ACCESS_SECRET)?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SECRET or ACCESS_SECRET must be set in production");
  }
  return "dev-admin-secret-change-me";
}

function getPassword(): string {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (password) return password;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_PASSWORD must be set in production");
  }
  return "admin123";
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

async function sign(data: string): Promise<string> {
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

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getPassword();
  if (password.length !== expected.length) return false;
  return timingSafeEqual(password, expected);
}

export async function createAdminToken(): Promise<string> {
  const payload = { role: "admin", exp: Date.now() + ADMIN_MAX_AGE * 1000 };
  const data = toBase64Url(enc.encode(JSON.stringify(payload)));
  const sig = await sign(data);
  return `${data}.${sig}`;
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return false;

    const expected = await sign(data);
    if (!timingSafeEqual(sig, expected)) return false;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(data))) as {
      role?: string;
      exp?: number;
    };

    return payload.role === "admin" && typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
