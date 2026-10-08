import type { NextConfig } from "next";

/**
 * L'hôte des images est dérivé de l'URL Supabase plutôt que recopié : deux
 * endroits où écrire le même identifiant de projet, c'est un endroit de trop
 * le jour où l'on change de projet.
 */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  /**
   * Génération statique bridée. Chaque page lit la base au build, et par
   * défaut Next en rend des dizaines de front : le pooler Supabase (mode
   * transaction) sature alors, des requêtes de 150 ms dépassent le délai de
   * 15 s de `src/db/index.ts`, et le build échoue au hasard d'une page.
   * Moins de pages simultanées, un build un peu plus long, mais qui passe.
   *
   * `cpus` borne le nombre de processus de build (neuf par défaut ici), donc
   * de pools de connexions ouverts en même temps : c'est lui qui compte, le
   * reste ne fait que répartir les pages entre eux.
   */
  experimental: {
    cpus: 3,
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 60,
  },
  images: {
    // `next/image` refuse toute origine non déclarée : sans cette entrée, les
    // photos produits téléversées dans le stockage ne s'afficheraient pas.
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;
