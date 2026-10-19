import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage/ContactPage";
import { getFooterContent } from "@/lib/content/queries";
import { instagramHandle } from "@/lib/content/types";
import { CONTACT_CONTENT } from "@/lib/placeholder/contact";

export const metadata: Metadata = {
  title: "Contact — Yurix",
  description: "Commissions, music videos, a thing you want painted, or just a hello. Write to Yurix in Mumbai.",
};

export default async function Contact() {
  // Email + Instagram come from the admin ("Footer & social").
  const footer = await getFooterContent();
  return (
    <ContactPage
      content={{
        ...CONTACT_CONTENT,
        email: footer.email,
        instagramHref: footer.instagram,
        instagramHandle: instagramHandle(footer.instagram),
      }}
    />
  );
}
