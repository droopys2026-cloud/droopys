import type { Metadata } from "next";
import { ContentPageView } from "@/components/layout/content-page-view";
import { ContactForm } from "@/components/sections/contact-form";
import { contentMetadata, getContentPage } from "@/lib/queries/content";

const SLUG = "contact";

export function generateMetadata(): Promise<Metadata> {
  return contentMetadata(SLUG);
}

export default async function ContactPage() {
  return (
    <ContentPageView page={await getContentPage(SLUG)}>
      <ContactForm />
    </ContentPageView>
  );
}
