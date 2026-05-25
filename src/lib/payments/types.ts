export type PaymentProvider = "moolre" | "paystack" | "flutterwave" | "card";

export type InitializePaymentInput = {
  name: string;
  email: string;
  phone: string;
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
  checkoutUrl: string;
  reference: string;
  provider: PaymentProvider;
};

export type VerifyPaymentResult = {
  success: boolean;
  reference: string;
  provider: PaymentProvider;
  amount?: number;
  currency?: string;
  customerEmail?: string;
};

export type PaymentOption = {
  id: PaymentProvider;
  label: string;
  hint: string;
};
