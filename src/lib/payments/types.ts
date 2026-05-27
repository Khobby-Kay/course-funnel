export type PaymentProvider = "moolre" | "paystack" | "flutterwave" | "card";

/** Moolre: phone USSD prompt vs hosted pos.moolre.com page vs SMS OTP step */
export type MoolreCheckoutFlow = "momo-prompt" | "momo-otp" | "hosted-link";

export type InitializePaymentInput = {
  name: string;
  email: string;
  phone: string;
  region: string;
  countryCode: string;
  provider: PaymentProvider;
  courseSlug: string;
  /** Retry the same payment with the SMS code Moolre sent (TP14 flow). */
  momoOtpCode?: string;
  /** Reuse reference from a prior TP14 response — do not create a new payment. */
  existingReference?: string;
};

export type CoursePricing = {
  slug: string;
  title: string;
  price: number;
  currency: string;
};

export type InitializePaymentResult = {
  /** Hosted checkout URL (Paystack/Flutterwave/Moolre link). Omitted for direct MoMo prompt. */
  checkoutUrl?: string;
  reference: string;
  provider: PaymentProvider;
  /** Customer approves payment on their phone — no third-party login page. */
  momoPrompt?: boolean;
  /** Present for Moolre — tells the client which UX to show. */
  moolreFlow?: MoolreCheckoutFlow;
  /** True when direct MoMo was unavailable (e.g. TP14) and hosted link was used instead. */
  moolreFallback?: boolean;
  /** Network label when a direct MoMo prompt was sent (e.g. "MTN MoMo"). */
  momoNetwork?: string;
  /** Moolre sent an SMS verification code — customer must enter it and retry. */
  momoOtpRequired?: boolean;
};

export type VerifyPaymentResult = {
  success: boolean;
  reference: string;
  provider: PaymentProvider;
  courseSlug?: string;
  amount?: number;
  currency?: string;
  customerEmail?: string;
};

export type PaymentOption = {
  id: PaymentProvider;
  label: string;
  hint: string;
};
