import { z } from "zod";

/**
 * Variables d'environnement, relues une fois au démarrage.
 *
 * Une variable manquante doit arrêter le processus tout de suite, avec son
 * nom, plutôt que de produire un `undefined` qui ressortira trois couches
 * plus bas en « connection string is not a string ». C'est la règle
 * « échouer bruyamment, tôt, à la frontière » appliquée à la configuration.
 *
 * Les secrets ne sont lus que côté serveur : ce module ne doit jamais être
 * importé par un composant client.
 */
const serverSchema = z.object({
  /**
   * Pooler Supabase en mode transaction (port 6543). C'est l'URL du runtime :
   * sur Vercel chaque requête est une fonction éphémère, et sans pooler les
   * connexions Postgres seraient épuisées en quelques secondes.
   */
  DATABASE_URL: z.string().url(),
  /**
   * Connexion directe (port 5432), réservée aux migrations : drizzle-kit a
   * besoin d'une session persistante que le mode transaction ne fournit pas.
   */
  DIRECT_URL: z.string().url(),
  /**
   * Pooler en mode **session** (port 5432). Le nom est historique : il sert
   * désormais partout — développement, build et production — dès qu'il est
   * défini. En mode transaction (`DATABASE_URL`), des requêtes restaient
   * figées à mi-protocole (état « active / ClientRead » côté base) : pages
   * bloquées en dev, build qui échoue au hasard, pages en ligne qui tombent
   * au bout de 300 s. Le mode session plafonne à quinze connexions pour tout
   * le projet : voir les pools réduits dans `@/db`.
   */
  DEV_DATABASE_URL: z.string().url().optional(),
  /** Accès privilégié : contourne RLS. Jamais exposée au navigateur. */
  SUPABASE_SECRET_KEY: z.string().min(1),

  /**
   * Clé secrète Stripe. En développement elle commence par `sk_test_` : le
   * contrôle est là pour qu'une clé live posée par erreur en local échoue
   * bruyamment plutôt que de débiter de vraies cartes.
   */
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  /**
   * Secret de signature des webhooks, donné par `stripe listen`. Sans lui,
   * n'importe qui pourrait forger un « paiement réussi » et faire expédier
   * une commande jamais payée. Facultatif seulement en local, où l'on peut
   * travailler avant d'avoir lancé `stripe listen`.
   */
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  /**
   * Envoi des e-mails de commande. Facultatifs : sans eux la boutique vend,
   * mais n'écrit pas — et le dit dans les logs à chaque commande.
   */
  RESEND_API_KEY: z.string().startsWith("re_").optional(),

  /**
   * Sendcloud — intégration « Sendcloud API ». Tarifs réels des transporteurs,
   * points relais, étiquettes. La clé publique n'est pas un secret : le
   * sélecteur de points relais la reçoit dans le navigateur.
   */
  SENDCLOUD_PUBLIC_KEY: z.string().min(1).optional(),
  SENDCLOUD_SECRET_KEY: z.string().min(1).optional(),
  /**
   * « 1 » : les étiquettes créées depuis l'admin sont des lettres non
   * affranchies, gratuites (`sendcloud:letter`). À laisser à « 1 » partout
   * sauf en production, où l'étiquette doit être celle du transporteur payé.
   */
  SENDCLOUD_TEST_LABELS: z.enum(["0", "1"]).default("1"),
  EMAIL_FROM: z.string().min(3).optional(),

  /**
   * Google Gemini, pour générer les photos produit depuis l'admin.
   * Facultative : sans elle, les boutons de génération restent inactifs et
   * le disent. Les modèles d'image n'ont pas de quota gratuit : la
   * facturation doit être activée sur le projet Google.
   */
  GEMINI_API_KEY: z.string().min(1).optional(),
});

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  /** Adresse publique du site : Stripe y renvoie le client après paiement. */
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  /**
   * Clé publiable Stripe, pour le formulaire de carte du tunnel. Publique
   * par nature ; elle est lue ici pour qu'une clé absente arrête le serveur
   * au démarrage plutôt qu'à l'étape de paiement d'un client.
   */
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
});

function parse<T extends z.ZodTypeAny>(schema: T, source: unknown): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    const missing = result.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ");
    throw new Error(
      `Configuration incomplète — variables d'environnement invalides ou absentes : ${missing}. ` +
        "Voir .env.example.",
    );
  }
  return result.data;
}

export const serverEnv = parse(serverSchema, process.env);

/**
 * Les `NEXT_PUBLIC_*` sont remplacées à la compilation, pas lues dans un
 * objet : Next n'inline que les accès littéraux `process.env.NEXT_PUBLIC_X`.
 * D'où cette écriture explicite plutôt qu'un passage de `process.env`.
 */
export const publicEnv = parse(publicSchema, {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
});
