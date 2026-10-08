import type { Metadata } from "next";
import { ContentPageView } from "@/components/layout/content-page-view";
import { OrderTrackingForm } from "@/components/sections/order-tracking-form";
import { contentMetadata, getContentPage } from "@/lib/queries/content";

// Le slug de contenu garde son ancienne valeur : c'est une clé en base, que
// l'admin édite sous ce nom. Seule l'adresse publique a changé — /compte/
// commandes est devenue la liste des commandes d'un client connecté.
const SLUG = "compte/commandes";

export function generateMetadata(): Promise<Metadata> {
  return contentMetadata(SLUG);
}

export default async function SuiviCommandePage() {
  return (
    <ContentPageView page={await getContentPage(SLUG)}>
      <OrderTrackingForm />
    </ContentPageView>
  );
}
