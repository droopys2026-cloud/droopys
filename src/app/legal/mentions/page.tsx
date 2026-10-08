import type { Metadata } from "next";
import { ContentPageView } from "@/components/layout/content-page-view";
import { LegalIdentity } from "@/components/sections/legal-identity";
import { contentMetadata, getContentPage } from "@/lib/queries/content";

const SLUG = "legal/mentions";

export function generateMetadata(): Promise<Metadata> {
  return contentMetadata(SLUG);
}

export default async function MentionsLegalesPage() {
  return (
    <ContentPageView page={await getContentPage(SLUG)}>
      <LegalIdentity />
    </ContentPageView>
  );
}
