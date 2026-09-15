import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProductAccordion } from "@/components/product/product-accordion";
import { ProductGallery } from "@/components/product/product-gallery";
import { ShareButton } from "@/components/product/share-button";
import { SizePicker } from "@/components/product/size-picker";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getCategory } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { ALL_PRODUCTS, getProduct } from "@/lib/catalog";
import { DEMO_CART_LINES } from "@/lib/placeholder-data";
import type { Product } from "@/types/product";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ALL_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};

  return {
    title: `${product.name} — ${product.brand} | Droopys`,
    description: product.description?.[0],
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = getProduct((await params).slug);
  // Un slug absent du catalogue est une 404, pas un repli sur un autre
  // article : afficher la mauvaise fiche est pire que ne rien afficher.
  if (!product) notFound();

  const category = product.categorySlug
    ? getCategory(product.categorySlug)
    : undefined;
  const images = galleryImages(product);
  const onSale =
    product.compareAtPriceCents !== undefined &&
    product.compareAtPriceCents > product.priceCents;

  return (
    <>
      <AnnouncementBar>
        Livraison offerte dès 150 € d&apos;achat · Retours sous 30 jours
      </AnnouncementBar>
      <SiteHeader cartLines={DEMO_CART_LINES} />

      <main className="section-main">
        <div className="container-page pt-9">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              ...(category
                ? [
                    {
                      label: category.headline ?? category.title,
                      href: `/${category.slug}`,
                    },
                  ]
                : []),
              { label: product.brand, href: "/marques" },
              { label: product.name },
            ]}
          />
        </div>

        <div className="container-page grid grid-cols-1 gap-13 pb-14 lg:grid-cols-[1.15fr_1fr] lg:gap-17">
          <ProductGallery
            images={images}
            alt={`${product.brand} — ${product.name}`}
          />

          {/* La colonne d'achat suit le défilement des photos : c'est elle qui
              porte la décision, elle ne doit pas sortir de l'écran. */}
          <div className="product-buy lg:sticky lg:top-9 lg:h-fit">
            {product.madeIn && (
              <p className="product-origin">Fabriqué en {product.madeIn}</p>
            )}

            <div className="product-head">
              <span className="product-head__brand">{product.brand}</span>
              <ShareButton title={`${product.brand} — ${product.name}`} />
            </div>

            <div className="product-title-row">
              <h1 className="m-0">{product.name}</h1>
              <p className="product-price m-0">
                {onSale && (
                  <span className="product-price__was">
                    {formatPrice(product.compareAtPriceCents!)}
                  </span>
                )}
                {formatPrice(product.priceCents)}
              </p>
            </div>

            {product.sizes && (
              <SizePicker
                sizes={product.sizes}
                productName={product.name}
                sizeAdvice={product.sizeAdvice}
              />
            )}

            <Link href="/boutiques" className="product-textlink self-center">
              Voir la disponibilité en boutique
            </Link>

            <ul className="product-reassure-grid">
              <li className="product-reassure">Livraison offerte dès 150 €</li>
              <li className="product-reassure">Retour offert sous 30 jours</li>
              <li className="product-reassure">Paiement en 3 fois</li>
            </ul>

            <div>
              {hasDescription(product) && (
                <ProductAccordion title="Description" defaultOpen>
                  {product.description?.map((line) => (
                    <p key={line} className="m-0">
                      {line}
                    </p>
                  ))}

                  {product.madeIn && (
                    <p className="product-spec m-0">
                      <b>Fabriqué en :</b> {product.madeIn}.
                    </p>
                  )}

                  {(product.modelNote || product.measurements) && (
                    <div className="product-spec">
                      <b>Taille et coupe :</b>
                      {product.modelNote && ` ${product.modelNote}`}
                      {product.measurements && (
                        <ul className="product-list">
                          {product.measurements.map((measure) => (
                            <li key={measure.label}>
                              {measure.label} : {measure.value}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {product.composition && (
                    <p className="product-spec m-0">
                      <b>Composition :</b> {product.composition}
                    </p>
                  )}

                  {product.care && (
                    <p className="product-spec m-0">
                      <b>Conseil d&apos;entretien :</b> {product.care}
                    </p>
                  )}

                  {product.reference && (
                    <p className="text-caption-muted m-0">
                      réf. {product.reference}
                    </p>
                  )}
                </ProductAccordion>
              )}

              {/* Les conditions ne sont pas recopiées ici : elles vivent sur
                  leurs pages, et deux versions d'un délai de retour finissent
                  toujours par se contredire. */}
              <ProductAccordion title="Livraison et retour">
                <p className="m-0">
                  Livraison en point relais ou à domicile sous 2 à 4 jours
                  ouvrés, offerte dès 150 € d&apos;achat. Retrait en boutique
                  gratuit, souvent disponible dans la journée.
                </p>
                <p className="m-0">
                  Retour sans frais sous 30 jours depuis un point relais ou en
                  boutique, article non porté et étiquettes attachées.
                </p>
                <p className="m-0">
                  <Link href="/aide/livraison">Délais et frais détaillés</Link>
                  {" · "}
                  <Link href="/aide/retours">Conditions de retour</Link>
                </p>
              </ProductAccordion>

              <ProductAccordion title="Disponibilité en boutique">
                <p className="m-0">
                  La disponibilité en rayon n&apos;est pas encore reliée au
                  stock de la boutique. En attendant, appelez-nous ou
                  passez-nous voir à Marseille — Grand Littoral.
                </p>
                <p className="m-0">
                  <Link href="/boutiques">Adresse et horaires</Link>
                </p>
              </ProductAccordion>
            </div>

            {(category || product.subcategory) && (
              <p className="product-related m-0">
                <span>Collections similaires :</span>
                {category && (
                  <Link href={`/${category.slug}`}>
                    {category.headline ?? category.title}
                  </Link>
                )}
                {product.subcategory && <span>{product.subcategory}</span>}
                <Link href="/marques">{product.brand}</Link>
              </p>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

/**
 * Vrai si l'accordéon « Description » a au moins une ligne à montrer. Un
 * accordéon qui s'ouvre sur du vide se lit comme une page cassée.
 */
function hasDescription(product: Product): boolean {
  return Boolean(
    product.description?.length ||
    product.madeIn ||
    product.modelNote ||
    product.measurements?.length ||
    product.composition ||
    product.care ||
    product.reference,
  );
}

/**
 * Photos de la galerie.
 *
 * `images` est la saisie de l'admin ; sans elle, on retombe sur les deux vues
 * de la carte produit, qui existent toujours. Le filtre écarte les doublons
 * et les champs vides — une miniature identique à la précédente donne
 * l'impression que le clic n'a rien fait.
 */
function galleryImages(product: Product): string[] {
  const candidates = product.images?.length
    ? product.images
    : [product.imageUrl, product.hoverImageUrl];

  return [...new Set(candidates.filter((image): image is string => !!image))];
}
