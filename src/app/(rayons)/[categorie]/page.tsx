import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmptyCollection } from "@/components/sections/empty-collection";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { DEMO_CART_LINES } from "@/lib/placeholder-data";

type PageProps = { params: Promise<{ categorie: string }> };

/** Une page statique par rayon du hero : /bebe, /fille, /garcon. */
export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ categorie: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categorie } = await params;
  const category = getCategory(categorie);
  if (!category) return {};

  return {
    title: `${category.headline ?? category.title} | Droopys`,
    description: category.intro,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorie } = await params;
  const category = getCategory(categorie);
  if (!category) notFound();

  return (
    <>
      <AnnouncementBar>
        Livraison offerte dès 150 € d&apos;achat · Retours sous 30 jours
      </AnnouncementBar>
      <SiteHeader
        cartLines={DEMO_CART_LINES}
        backdrop={category.image}
        backdropClassName={category.backdropClassName}
        title={category.headline ?? category.title}
      />

      <main className="section-main min-h-[50vh]">
        {/* Aucun article rattaché au rayon pour l'instant : la grille prendra
            la place de cet état vide quand le catalogue sera branché. */}
        <EmptyCollection />
      </main>

      <SiteFooter />
    </>
  );
}
