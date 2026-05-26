export type PaymentProvider = "moolre" | "paystack" | "flutterwave" | "card";

export type InitializePaymentInput = {
  name: string;
  email: string;
  phone: string;
  region: string;
  countryCode: string;
  provider: PaymentProvider;
  courseSlug: string;
};

export type CoursePricing = {
  slug: string;
  title: string;
  price: number;
  currency: string;
};

export type InitializePaymentResult = {
  /** Hosted checkout URL (Paystack/Flutterwave). Omitted for direct MoMo prompt. */
  checkoutUrl?: string;
  reference: string;
  provider: PaymentProvider;
  /** Customer approves payment on their phone — no third-party login page. */
  momoPrompt?: boolean;
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
