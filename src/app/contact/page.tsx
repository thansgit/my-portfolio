import { ContactSection } from "@/components/sections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Timo Hanski",
  description: "Get in touch with Timo Hanski. Fill out the contact form or connect via social media for freelance projects, job opportunities, or collaboration inquiries.",
};

export default function ContactPage() {
  return <ContactSection />;
} 