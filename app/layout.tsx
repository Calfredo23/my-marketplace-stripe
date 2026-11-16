import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://my-marketplace-stripe.vercel.app";
const title = "The Market — buy, sell, get paid";
const description =
  "A small marketplace built with Next.js, React, Supabase, and Stripe Connect. List something, browse by category, and buy with Stripe Checkout.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "The Market",
  authors: [
    { name: "Cedrick Alfredo Catimbang", url: "https://calfredo.is-pinoy.dev" },
  ],
  creator: "Cedrick Alfredo Catimbang",
  keywords: [
    "marketplace",
    "classifieds",
    "React",
    "Next.js",
    "Supabase",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "The Market",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#e31c5f",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
