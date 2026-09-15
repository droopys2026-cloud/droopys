import type { Metadata } from "next";
import { ContentPageView } from "@/components/layout/content-page-view";
import { ContactForm } from "@/components/sections/contact-form";
import { contentMetadata, contentPage } from "@/lib/content-pages";

const SLUG = "contact";

export const metadata: Metadata = contentMetadata(SLUG);

export default function ContactPage() {
  return (
    <ContentPageView page={contentPage(SLUG)}>
      <ContactForm />
    </ContentPageView>
  );
}
