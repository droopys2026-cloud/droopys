import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

/**
 * Crée les buckets d'images.
 *
 * Il est **public en lecture** : ce sont des visuels de boutique, servis par
 * le CDN Supabase et affichés par `next/image` sans jeton. L'écriture, elle,
 * n'est possible qu'avec la clé secrète, donc uniquement depuis le serveur —
 * le navigateur ne téléverse jamais en direct.
 *
 * Le script est rejouable : un bucket déjà présent n'est pas une erreur.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error("Configuration Supabase incomplète — voir .env.example.");

/** Doit rester aligné sur `@/lib/supabase/admin`. */
const BUCKETS = ["produits", "rayons", "photos-ia"];

const supabase = createClient(url, key);

const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) throw listError;

for (const name of BUCKETS) {
  if (buckets.some((bucket) => bucket.name === name)) {
    console.log(`Bucket « ${name} » déjà présent.`);
    continue;
  }

  const { error } = await supabase.storage.createBucket(name, {
    public: true,
    // 8 Mo : une photo bien exportée pèse moins d'1 Mo. La borne arrête un
    // envoi accidentel de fichier brut d'appareil photo.
    fileSizeLimit: 8 * 1024 * 1024,
    allowedMimeTypes: ["image/webp", "image/jpeg", "image/png", "image/avif"],
  });
  if (error) throw error;
  console.log(`Bucket « ${name} » créé, lecture publique.`);
}
