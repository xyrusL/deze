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

const siteTitle = "DEZE.Me | Porfolio Hub";
const siteDescription =
  "Welcome to DEZE.Me, my portfolio hub for the work I am building, the ideas I am exploring, and the web projects I am continuing to improve.";
const socialImage = "/site-preview.png";
const siteName = "DEZE";
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  alternateName: "DEZE.Me",
  url: brand.siteUrl,
  description: siteDescription,
};

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  applicationName: siteName,
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    title: siteName,
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
    siteName,
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${jetBrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
