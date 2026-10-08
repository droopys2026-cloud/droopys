import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv } from "@/lib/env";

/**
 * Client Supabase lié à la session du visiteur.
 *
 * Il est créé par requête et non partagé : la session vit dans les cookies de
 * la requête en cours, un client mémorisé servirait la session d'un autre.
 *
 * La clé employée est la clé **publiable** : ce client agit au nom de
 * l'utilisateur connecté, pas au nom du serveur. Toute opération privilégiée
 * passe par `@/lib/supabase/admin`.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Écrire un cookie depuis un Server Component est interdit : seuls
            // une Server Action ou un Route Handler le peuvent. Le rafraîchi-
            // ssement de session est déjà assuré par `proxy.ts`, donc l'échec
            // est sans conséquence ici — d'où le seul `catch` vide du projet.
          }
        },
      },
    },
  );
}

/**
 * L'utilisateur connecté, ou `null`.
 *
 * On passe par `getUser()` et non par `getSession()` : `getSession` relit le
 * cookie sans le vérifier, et un cookie peut être forgé. `getUser` demande à
 * Supabase de valider le jeton. C'est un aller-retour réseau, et c'est le
 * prix d'une autorisation qui veut dire quelque chose.
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
