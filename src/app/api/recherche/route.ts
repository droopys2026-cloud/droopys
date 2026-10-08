import { NextResponse } from "next/server";
import { z } from "zod";
import { searchProducts } from "@/lib/queries/catalog";

/**
 * Recherche pour le tiroir d'en-tête.
 *
 * Le tiroir est un composant client : il ne peut pas interroger Postgres,
 * d'où cette route. Elle ne rend que ce qu'une vignette affiche — jamais la
 * fiche entière, qui ferait passer descriptions et stock sur le réseau à
 * chaque frappe.
 *
 * `q` vient de l'URL, donc d'une entrée non fiable : elle est bornée par Zod
 * avant d'atteindre la base.
 */
const querySchema = z.object({
  q: z.string().trim().min(1).max(80),
});

/** Au-delà, le tiroir devient une page de résultats : c'est le rôle de /recherche. */
const MAX_RESULTS = 6;

export async function GET(request: Request) {
  const parsed = querySchema.safeParse({
    q: new URL(request.url).searchParams.get("q") ?? "",
  });

  // Requête vide ou trop longue : une liste vide, pas une erreur. Le tiroir
  // interroge à chaque frappe, un 400 y serait du bruit, pas une information.
  if (!parsed.success) return NextResponse.json({ results: [] });

  const results = await searchProducts(parsed.data.q);

  return NextResponse.json({
    results: results.slice(0, MAX_RESULTS).map((product) => ({
      id: product.id,
      slug: product.slug,
      brand: product.brand,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl,
    })),
  });
}
