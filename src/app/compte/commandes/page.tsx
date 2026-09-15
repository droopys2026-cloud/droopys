import type { Metadata } from "next";
import { ContentPageView } from "@/components/layout/content-page-view";
import { OrderTrackingForm } from "@/components/sections/order-tracking-form";
import { contentMetadata, contentPage } from "@/lib/content-pages";

const SLUG = "compte/commandes";

export const metadata: Metadata = contentMetadata(SLUG);

export default function SuiviCommandePage() {
  return (
    <ContentPageView page={contentPage(SLUG)}>
      <OrderTrackingForm />
    </ContentPageView>
  );
}
