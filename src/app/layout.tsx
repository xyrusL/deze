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

export const metadata: Metadata = {
  title: `${brand.name} | ${brand.portfolioLabel}`,
  description: `Modern portfolio homepage showcasing selected projects by ${brand.name}.`,
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
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
