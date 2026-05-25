import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful | Digital Marketing Mastery",
  description: "Your payment was successful. Welcome to the course.",
  robots: { index: false, follow: false },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}