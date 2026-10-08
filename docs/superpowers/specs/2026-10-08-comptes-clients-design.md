# Comptes clients — design

Date : 2026-10-08. Validé en conversation (parties 1 et 2).

## Objectif

Permettre à un client de créer un compte, de se connecter (e-mail + mot de
passe ou Google) et de retrouver dans un espace personnel : ses commandes, son
profil, son carnet d'adresses et ses favoris. Le compte reste **facultatif** :
on commande toujours en invité.

Hors périmètre : programme de fidélité, préremplissage des adresses dans le
tunnel Stripe (lot suivant), groupes de clients.

## Décisions prises

| Sujet | Décision |
|---|---|
| Fournisseur d'authentification | Supabase Auth, déjà utilisé par l'admin |
| Méthodes | E-mail + mot de passe, Google (OAuth) |
| E-mails transactionnels | Resend branché en SMTP dans Supabase (aucun code), modèles en français |
| Commande sans compte | Toujours possible |
| Favoris d'un visiteur | Cookie, fusionnés dans le compte à la connexion |
| Confirmation d'e-mail | Obligatoire avant de voir des commandes |

## Parcours et pages

Non connecté :

- `/compte/connexion` — mise en page actuelle de `/compte` (photo à gauche).
  E-mail, mot de passe, « Continuer avec Google », « Mot de passe oublié ».
- `/compte/inscription` — prénom, nom, e-mail, mot de passe, Google. Après envoi :
  écran « Vérifiez votre boîte mail ».
- `/compte/mot-de-passe-oublie` — e-mail ; message neutre quel que soit le résultat.
- `/compte/nouveau-mot-de-passe` — atteinte par le lien de l'e-mail, session de
  récupération active.
- `/compte/confirmation` — Route Handler : échange le code (confirmation d'e-mail,
  retour Google, récupération) contre une session, puis redirige.

Connecté (coquille commune avec menu latéral) :

- `/compte` — tableau de bord : salutation, dernière commande, raccourcis.
- `/compte/commandes`, `/compte/commandes/[reference]` — liste et détail.
- `/compte/adresses` — CRUD, adresse par défaut.
- `/compte/profil` — nom, e-mail, mot de passe, déconnexion, suppression du compte.
- `/favoris` — même page, alimentée par le compte ou par le cookie.

Le suivi de commande sans compte quitte `/compte/commandes` pour `/suivi-commande`
(redirection permanente depuis l'ancienne adresse : elle a pu être envoyée par
e-mail).

Redirections :

- non connecté sur `/compte/*` protégé → `/compte/connexion?suite=<chemin>` ;
- connecté sur connexion / inscription → `/compte` ;
- `suite` n'accepte qu'un chemin interne (`/` sans `//`) — sinon redirection ouverte ;
- l'icône compte du header mène à `/compte` dans les deux cas, la page choisit.

## Données (Drizzle, `src/db/schema/customers.ts`)

- `customers` : `id uuid` = `auth.users.id` (clé primaire, pas de FK inter-schéma),
  `first_name`, `last_name`, `created_at`. L'e-mail reste dans Supabase Auth.
- `customer_addresses` : `id`, `customer_id` (FK cascade), `full_name`, `line1`,
  `line2`, `postal_code`, `city`, `country` (défaut `FR`), `phone`, `is_default`,
  `created_at`. Index unique partiel `(customer_id) where is_default`.
- `wishlist_items` : `customer_id` (FK cascade), `product_id` (FK cascade),
  `created_at`, unique `(customer_id, product_id)`.
- `orders.customer_id uuid null` (FK `set null`), renseigné par le webhook Stripe
  quand la session de paiement porte l'identifiant client.

La ligne `customers` est créée à la première connexion confirmée (dans
`/compte/confirmation` et après connexion par mot de passe), via un `insert … on
conflict do nothing` : pas de trigger SQL sur `auth.users`.

Après migration : `npm run db:secure` (RLS sur les nouvelles tables, aucune policy).

## Rôles et autorisation

- Admin = `user.app_metadata.role === "admin"`. `app_metadata` n'est inscriptible
  qu'avec la clé secrète.
- `requireAdmin()` vérifie le rôle ; un client connecté est renvoyé vers `/compte`.
  `proxy.ts` applique la même règle pour `/admin` (confort, pas sécurité).
- `requireCustomer()` (`src/lib/auth.ts`) : session valide sinon redirection vers
  la connexion ; renvoie `{ user, customer }`. Appelé dans chaque page **et chaque
  action** de l'espace client.
- Script `scripts/grant-admin.mts <email>` : pose le rôle. **À lancer sur le
  compte admin actuel avant de déployer**, sinon l'admin est verrouillé.

Commandes visibles par un client : `customer_id = user.id` **ou**
(`customer_email = user.email` **et** `user.email_confirmed_at` non nul).

## Sécurité

- Toute entrée de formulaire passe par Zod (`src/lib/account/schema.ts`).
- Toute écriture filtre sur `customer_id = user.id` dans la clause `where` — la
  propriété se vérifie dans la requête, pas avant.
- Messages neutres à la connexion (« E-mail ou mot de passe incorrect ») et au mot
  de passe oublié (« Si un compte existe, un e-mail vient de partir »).
- Mot de passe : 8 caractères minimum (règle reprise dans Supabase).
- Limitation des tentatives : celle de Supabase Auth.
- Aucun e-mail ni mot de passe dans les logs (`owasp-logging.md`).
- Suppression du compte : `auth.admin.deleteUser` (clé secrète) ; les commandes
  sont conservées (obligation comptable), `customer_id` passe à null.

## Favoris

- Cookie `droopys_favoris` : liste d'identifiants produit, bornée (100), validée
  par Zod à la lecture, illisible → liste vide.
- Bouton cœur : Server Action `toggleWishlist(productId)` — table si connecté,
  cookie sinon. Le bouton devient composant client avec état optimiste.
- À la connexion : fusion du cookie dans `wishlist_items` (`on conflict do
  nothing`), puis suppression du cookie.

## Configuration hors code (à faire dans les tableaux de bord)

1. Supabase → Auth → SMTP : Resend (`smtp.resend.com`, port 465, clé API Resend).
2. Supabase → Auth → Templates : confirmation et réinitialisation en français,
   lien vers `/compte/confirmation?…`.
3. Supabase → Auth → Providers → Google : identifiants OAuth de la console Google.
4. Supabase → Auth → URL Configuration : URL du site et `/compte/confirmation`
   en URL de redirection autorisée (local et production).
5. Mentions de confidentialité : ajout de Google comme fournisseur d'identité.

## Erreurs

- Erreur de validation → message sous le champ, état conservé (`useActionState`).
- Lien expiré ou déjà utilisé sur `/compte/confirmation` → page de connexion avec
  message « Ce lien a expiré » et proposition d'en renvoyer un.
- Erreur Supabase inattendue → message générique + erreur journalisée sans donnée
  personnelle. Jamais de `catch` silencieux.

## Vérification

- Vitest (à installer) sur les fonctions pures : validation de `suite`, règle de
  visibilité des commandes, fusion des favoris, lecture du cookie.
- `npm run check` et `npm run build`.
- Parcours vérifiés au navigateur : inscription → e-mail → confirmation → compte ;
  connexion ; mot de passe oublié ; client connecté refusé sur `/admin` ; admin
  toujours accepté.
