import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "African Skills Academy | Online Programs That Pay",
  description:
    "Professional courses for Africans earning online — digital marketing, social media, templates included. 1,400+ students. 30-day guarantee. Instant access.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lexend.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  );
}