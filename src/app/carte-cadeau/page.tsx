import type { Metadata } from "next";
import { ContentPageView } from "@/components/layout/content-page-view";
import { contentMetadata, contentPage } from "@/lib/content-pages";

const SLUG = "carte-cadeau";

export const metadata: Metadata = contentMetadata(SLUG);

export default function Page() {
  return <ContentPageView page={contentPage(SLUG)} />;
}
