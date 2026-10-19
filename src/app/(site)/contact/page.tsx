import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage/ContactPage";
import { CONTACT_CONTENT } from "@/lib/placeholder/contact";

export const metadata: Metadata = {
  title: "Contact — Yurix",
  description: "Commissions, music videos, a thing you want painted, or just a hello. Write to Yurix in Mumbai.",
};

export default function Contact() {
  return <ContactPage content={CONTACT_CONTENT} />;
}
