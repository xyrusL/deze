import type { Metadata } from "next";
import { ContactPageClient } from "@/components/contact-page-client";
import { brand } from "@/data/brand";

const contactDescription =
  "Get in touch with Paul for collaboration, project questions, or a quick chat.";

export const metadata: Metadata = {
  title: `Contact | ${brand.name}`,
  description: contactDescription,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact | ${brand.name}`,
    description: contactDescription,
    url: `${brand.siteUrl}/contact`,
  },
  twitter: {
    title: `Contact | ${brand.name}`,
    description: contactDescription,
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
