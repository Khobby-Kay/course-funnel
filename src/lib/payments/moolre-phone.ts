/** Ghana MoMo channel IDs for Moolre `/open/transact/payment` (override via env if needed). */
const DEFAULT_CHANNELS = {
  mtn: 7,
  telecel: 6,
  at: 13,
} as const;

function channelFromEnv(key: keyof typeof DEFAULT_CHANNELS): number {
  const envKey = `MOOLRE_CHANNEL_${key.toUpperCase()}` as const;
  const raw = process.env[envKey]?.trim();
  if (!raw) return DEFAULT_CHANNELS[key];
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : DEFAULT_CHANNELS[key];
}

/** Normalize to 10-digit Ghana local format: 0XXXXXXXXX (no country code). */
export function normalizeGhanaMoMoPhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("233") && digits.length >= 12) {
    digits = `0${digits.slice(3)}`;
  }

  if (digits.length === 9 && !digits.startsWith("0")) {
    digits = `0${digits}`;
  }

  if (!/^0[2-5]\d{8}$/.test(digits)) {
    throw new Error("Enter a valid Ghana MoMo number starting with 0 (e.g. 0241234567).");
  }

  return digits;
}

export function resolveMoolreChannelFromPhone(phone: string): number {
  const normalized = normalizeGhanaMoMoPhone(phone);
  const prefix = normalized.slice(0, 3);

  if (["024", "054", "055", "059", "025"].includes(prefix)) {
    return channelFromEnv("mtn");
  }
  if (["020", "050"].includes(prefix)) {
    return channelFromEnv("telecel");
  }
  if (["026", "027", "056", "057"].includes(prefix)) {
    return channelFromEnv("at");
  }

  throw new Error(
    "Could not detect your mobile network. Use an MTN, Telecel, or AT Money number."
  );
}

export function moolreNetworkLabel(phone: string): string {
  const normalized = normalizeGhanaMoMoPhone(phone);
  const prefix = normalized.slice(0, 3);
  if (["024", "054", "055", "059", "025"].includes(prefix)) return "MTN MoMo";
  if (["020", "050"].includes(prefix)) return "Telecel Cash";
  if (["026", "027", "056", "057"].includes(prefix)) return "AT Money";
  return "Mobile Money";
}
