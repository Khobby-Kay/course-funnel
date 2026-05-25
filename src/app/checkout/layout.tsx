import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Digital Marketing Mastery",
  description: "Complete your enrollment and get instant access to the course.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}