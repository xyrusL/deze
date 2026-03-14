import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { brand } from "@/data/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-body-mono",
  subsets: ["latin"],
});

const siteTitle = `${brand.name} | ${brand.portfolioLabel}`;
const siteDescription = `Modern portfolio homepage showcasing selected projects by ${brand.name}.`;
const socialImage = "/site-preview.png";

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    url: brand.siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: brand.name,
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: `${brand.name} preview image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${jetBrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
