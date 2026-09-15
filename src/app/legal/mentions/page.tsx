import type { Metadata } from "next";
import { ContentPageView } from "@/components/layout/content-page-view";
import { LegalIdentity } from "@/components/sections/legal-identity";
import { contentMetadata, contentPage } from "@/lib/content-pages";

const SLUG = "legal/mentions";

export const metadata: Metadata = contentMetadata(SLUG);

export default function MentionsLegalesPage() {
  return (
    <ContentPageView page={contentPage(SLUG)}>
      <LegalIdentity />
    </ContentPageView>
  );
}
