import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/account/roles";

/**
 * Rafraîchit la session Supabase et barre l'accès à l'administration.
 *
 * Deux rôles, et le second n'est pas une autorisation :
 *
 * 1. **Rafraîchir le jeton.** Les Server Components ne peuvent pas écrire de
 *    cookie ; sans ce passage, une session expirerait en cours de navigation.
 * 2. **Aiguiller** — vers la connexion, le compte ou l'admin. C'est un filtre
 *    de confort, pas la sécurité : la doc de Next le dit, le proxy ne remplace
 *    pas une vérification. Celle qui fait foi est `requireAdmin` /
 *    `requireCustomer` (`@/lib/auth`), appelées dans chaque page et action.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const redirectTo = (path: string, suite?: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    // On garde la page demandée pour y revenir après la connexion : se faire
    // renvoyer à l'accueil après s'être identifié est une petite punition
    // pour un besoin légitime.
    if (suite) url.searchParams.set("suite", suite);
    return NextResponse.redirect(url);
  };

  // ---- administration ----------------------------------------------------
  const isAdminLogin = pathname === "/admin/connexion";
  if (pathname.startsWith("/admin")) {
    if (!user && !isAdminLogin) return redirectTo("/admin/connexion", pathname);
    // Un client connecté n'a rien à faire ici, même sur la page de connexion :
    // elle le déconnecterait de son compte sans lui donner d'accès.
    if (user && !isAdmin(user)) return redirectTo("/compte");
    if (user && isAdminLogin) return redirectTo("/admin");
  }

  // ---- espace client -----------------------------------------------------
  if (pathname === "/compte" || pathname.startsWith("/compte/")) {
    // L'ancienne adresse du suivi sans compte a pu partir dans des e-mails :
    // un visiteur non connecté y retrouve le suivi, pas un mur de connexion.
    if (!user && pathname === "/compte/commandes") return redirectTo("/suivi-commande");

    const isGuestPage = GUEST_PAGES.has(pathname);
    if (!user && !isGuestPage && !OPEN_PAGES.has(pathname)) {
      return redirectTo("/compte/connexion", pathname);
    }
    // Déjà connecté : connexion et inscription n'ont plus rien à proposer.
    if (user && isGuestPage) return redirectTo("/compte");
  }

  return response;
}

/** Pages réservées aux visiteurs non connectés. */
const GUEST_PAGES = new Set([
  "/compte/connexion",
  "/compte/inscription",
  "/compte/mot-de-passe-oublie",
]);

/**
 * Pages ouvertes à tous : la confirmation reçoit le visiteur **avant** que
 * sa session existe, et le nouveau mot de passe vérifie lui-même la session
 * de récupération.
 */
const OPEN_PAGES = new Set([
  "/compte/confirmation",
  "/compte/nouveau-mot-de-passe",
]);

export const config = {
  // Les fichiers statiques et les images n'ont pas de session à rafraîchir :
  // les exclure évite un appel réseau par vignette.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif|gif|ico)$).*)"],
};
