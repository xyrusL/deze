import type { Metadata } from "next";
import HashScrollManager from "@/components/HashScrollManager";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import Navbar from "@/components/Navbar";
import RevealObserver from "@/components/RevealObserver";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deze.me | Modern web projects by Paul",
  description:
    "Deze.me is a polished index of live apps, tools, and experiments built by Paul across the web.",
  metadataBase: new URL("https://landing.deze.me"),
  openGraph: {
    title: "Deze.me | Modern web projects by Paul",
    description: "Explore live apps, tools, and experiments from the Deze.me network.",
    url: "https://landing.deze.me",
    siteName: "Deze.me",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${syne.variable} antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        <HashScrollManager />
        <RevealObserver />
        <main>{children}</main>
      </body>
    </html>
  );
}
