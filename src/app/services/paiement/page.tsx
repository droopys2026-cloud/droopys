import type { Metadata } from "next";
import { ContentPageView } from "@/components/layout/content-page-view";
import { contentMetadata, getContentPage } from "@/lib/queries/content";

const SLUG = "services/paiement";

export function generateMetadata(): Promise<Metadata> {
  return contentMetadata(SLUG);
}

export default async function Page() {
  return <ContentPageView page={await getContentPage(SLUG)} />;
}
