import type { Metadata } from "next";
import { AboutPageClient } from "@/components/about-page-client";
import { brand } from "@/data/brand";

const aboutDescription =
  "Meet Paul, learn how he approaches side projects, and see how AI fits into his workflow.";

export const metadata: Metadata = {
  title: `About Me | ${brand.name}`,
  description: aboutDescription,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About Me | ${brand.name}`,
    description: aboutDescription,
    url: `${brand.siteUrl}/about`,
  },
  twitter: {
    title: `About Me | ${brand.name}`,
    description: aboutDescription,
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}

