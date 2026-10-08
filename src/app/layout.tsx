import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { CartDrawerProvider } from "@/components/layout/cart-drawer-context";
import { KlarnaModal } from "@/components/layout/klarna-modal";
import { PageTransition } from "@/components/layout/page-transition";
import { WishlistProvider } from "@/components/product/wishlist-provider";
import "./globals.css";

/**
 * Poppins couvre tous les rôles typographiques du site : les graisses 300 à
 * 900 rejouent la hiérarchie du design (léger / courant / médium / fort)
 * sans avoir besoin d'une seconde famille.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Droopy's",
  description:
    "Droopy's — vêtements, chaussures et accessoires de grandes marques pour enfants, de la naissance à 16 ans : Stone Island, C.P. Company, Moncler, Lanvin, Burberry, Chloé…",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={poppins.variable}>
      <body className="text-body antialiased">
        {/* L'état du tiroir du panier est posé ici et non dans l'en-tête : le
            bouton « Ajouter au panier », dans la page, doit pouvoir l'ouvrir. */}
        <CartDrawerProvider>
          <WishlistProvider>
            <PageTransition>{children}</PageTransition>
          </WishlistProvider>
        </CartDrawerProvider>
        <KlarnaModal />
      </body>
    </html>
  );
}
