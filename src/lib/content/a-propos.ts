import type { ContentPage } from "@/types/content-page";

/**
 * Groupe « À propos ».
 *
 * Les seuls faits vérifiables de ces pages — année de création, adresse,
 * enseigne — viennent du registre et sont centralisés dans `@/lib/legal`.
 * Le reste est un récit de marque : il se relit et se corrige depuis l'admin,
 * il ne se déduit d'aucune source.
 */
export const A_PROPOS_PAGES: ContentPage[] = [
  {
    slug: "a-propos",
    group: "a-propos",
    title: "L'histoire Droopy's",
    lead: "Une boutique née à Marseille en 2006, devenue la maison des grandes marques pour enfants, de la naissance à 16 ans.",
    image: "/imgdress/petitmoncler.webp",
    imageClassName: "object-[50%_20%]",
    blocks: [
      {
        kind: "paragraphe",
        text: "Droopy's commence en 2006 dans le quinzième arrondissement de Marseille, au centre commercial Grand Littoral. L'idée tient en une phrase : les marques que les adultes s'offrent existent aussi pour les enfants, et personne ne les réunit sous un même toit.",
      },
      {
        kind: "paragraphe",
        text: "Vingt ans plus tard, la sélection n'a pas changé de principe. Stone Island, C.P. Company, Moncler, Lanvin, Burberry — des maisons choisies pour ce qu'elles font réellement pour les enfants, pas pour la ligne enfant qu'elles ont ajoutée par opportunisme. Une doudoune doit tenir chaud et passer l'hiver ; une paire de baskets doit supporter une cour de récréation.",
      },
      {
        kind: "titre",
        text: "Ce que nous cherchons dans une pièce",
      },
      {
        kind: "cartes",
        items: [
          {
            title: "Elle se porte",
            text: "Une pièce que l'enfant refuse d'enfiler n'a aucun intérêt, quelle que soit la marque. Nous écartons ce qui gratte, ce qui gêne aux épaules et ce qui se salit au premier goûter.",
          },
          {
            title: "Elle dure",
            text: "Coutures, doublures, fermetures : ce sont ces trois points qui décident si un vêtement finit au petit frère ou à la poubelle. Nous les regardons avant le logo.",
          },
          {
            title: "Elle se lave",
            text: "Un vêtement d'enfant passe en machine chaque semaine. Une pièce qui ne supporte que le nettoyage à sec ne rentre pas dans la sélection.",
          },
          {
            title: "Elle se transmet",
            text: "La bonne pièce a deux vies au minimum. C'est le meilleur argument écologique d'un vêtement, et c'est aussi ce qui justifie son prix.",
          },
        ],
      },
      {
        kind: "titre",
        text: "La boutique et le site",
      },
      {
        kind: "paragraphe",
        text: "Le magasin de Grand Littoral reste le cœur de la maison : c'est là que les pièces sont choisies, essayées et conseillées. Le site prolonge la boutique plutôt qu'il ne la remplace — mêmes prix, mêmes articles, et la possibilité de retirer ou de rapporter en rayon ce qui a été commandé en ligne.",
      },
      {
        kind: "appel",
        label: "Voir la boutique",
        href: "/boutiques",
      },
    ],
  },

  {
    slug: "engagements",
    group: "a-propos",
    title: "Nos engagements",
    lead: "Ce sur quoi nous nous engageons, ce que nous mesurons, et ce que nous ne savons pas encore faire.",
    toc: true,
    blocks: [
      {
        kind: "paragraphe",
        text: "Une page d'engagements n'a d'intérêt que si elle dit aussi ce qui n'est pas atteint. Celle-ci sépare donc trois choses : ce qui est en place, ce qui est en cours, et ce qui reste hors de portée aujourd'hui.",
      },
      {
        kind: "titre",
        text: "Ce qui est en place",
      },
      {
        kind: "liste",
        items: [
          "Toutes les pièces vendues proviennent de marques ou de distributeurs officiels. Aucun achat en marché parallèle, aucune pièce sans facture d'origine.",
          "Les colis partent en carton recyclé, sans plastique de calage et sans papier de soie neuf.",
          "Trente jours de retour au lieu des quatorze jours légaux, retour en point relais sans frais.",
          "Les prix affichés sont les mêmes en boutique et en ligne, y compris pendant les soldes.",
        ],
      },
      {
        kind: "titre",
        text: "Ce qui est en cours",
      },
      {
        kind: "liste",
        items: [
          "Afficher, pour chaque pièce, sa composition et son pays de fabrication tels que la marque les déclare.",
          "Reprendre en boutique les pièces devenues trop petites, pour les remettre en circulation plutôt que les laisser dans un placard.",
          "Regrouper les commandes d'une même adresse dans un seul envoi lorsqu'elles se suivent de près.",
        ],
      },
      {
        kind: "titre",
        text: "Ce que nous ne savons pas encore faire",
      },
      {
        kind: "paragraphe",
        text: "Nous ne contrôlons pas les usines de nos marques et nous ne prétendrons pas le contraire : nous sommes un détaillant, pas un fabricant. Nous ne publions pas non plus de bilan carbone, faute de données fiables sur l'amont. Ces deux points sont des limites réelles, pas des étapes prévues pour l'an prochain.",
      },
      {
        kind: "note",
        text: "Cette page est datée et révisée : si une ligne passe d'« en cours » à « en place », la date de mise à jour change avec elle.",
      },
    ],
    updatedAt: "2026-09-15",
  },

  {
    slug: "boutiques",
    group: "a-propos",
    title: "Nos boutiques",
    lead: "Droopy's se visite à Marseille, au centre commercial Grand Littoral.",
    blocks: [
      {
        kind: "paragraphe",
        text: "La boutique tient l'essentiel de la sélection en rayon et reçoit les nouveautés en même temps que le site. On y essaie, on y échange, on y retire une commande passée en ligne.",
      },
    ],
  },

  {
    slug: "recrutement",
    group: "a-propos",
    title: "Recrutement",
    lead: "Nous recrutons rarement, mais nous lisons toutes les candidatures — y compris spontanées.",
    blocks: [
      {
        kind: "paragraphe",
        text: "Droopy's est une petite équipe. Les postes s'ouvrent au rythme de la boutique, quelques fois par an, et le plus souvent en vente et en conseil. Aucune offre n'est publiée en ce moment.",
      },
      {
        kind: "titre",
        text: "Les métiers de la maison",
      },
      {
        kind: "cartes",
        items: [
          {
            title: "Vente et conseil",
            text: "Accueillir, conseiller une taille, expliquer une matière. C'est le métier le plus exigeant de la boutique : il faut connaître les marques et savoir parler aux enfants autant qu'aux parents.",
          },
          {
            title: "Réception et réassort",
            text: "Réception des livraisons, contrôle, étiquetage, tenue des réserves. Le poste qui décide si une pièce est trouvable le jour où on la cherche.",
          },
          {
            title: "Préparation des commandes",
            text: "Prélèvement, contrôle, emballage, expédition. Un colis bien préparé, c'est un retour évité.",
          },
          {
            title: "Boutique en ligne",
            text: "Fiches produit, photos, service client par écrit. Le métier le plus récent de la maison, et celui qui bouge le plus.",
          },
        ],
      },
      {
        kind: "titre",
        text: "Candidater",
      },
      {
        kind: "paragraphe",
        text: "Écrivez-nous depuis la page Nous contacter, en indiquant le métier visé et vos disponibilités. Une candidature spontanée bien ciblée passe mieux qu'une lettre générique : dites-nous ce que vous avez remarqué dans la sélection.",
      },
      {
        kind: "note",
        text: "Les candidatures sont conservées un an, puis supprimées. Vous pouvez demander leur effacement à tout moment — voir notre page Confidentialité.",
      },
      {
        kind: "appel",
        label: "Envoyer une candidature",
        href: "/contact",
      },
    ],
  },

  {
    slug: "journal",
    group: "a-propos",
    title: "Journal",
    lead: "Les choix de la maison expliqués : pourquoi telle marque, telle matière, telle coupe.",
    image: "/imgdress/fille2.webp",
    blocks: [
      {
        kind: "paragraphe",
        text: "Le journal réunit ce qui ne tient pas dans une fiche produit : l'histoire d'une maison, la différence entre deux rembourrages, la façon d'entretenir une pièce pour qu'elle serve à deux enfants.",
      },
      {
        kind: "note",
        text: "Aucun article n'est encore publié. Les sujets ci-dessous sont ceux en préparation — mieux vaut annoncer une page vide que de la remplir de textes qui ne servent à personne.",
      },
      {
        kind: "titre",
        text: "En préparation",
      },
      {
        kind: "cartes",
        items: [
          {
            title: "Duvet, synthétique, laine",
            text: "Trois façons de tenir chaud, trois entretiens différents, et le critère qui départage vraiment : le climat dans lequel l'enfant vit.",
          },
          {
            title: "Lire une étiquette de composition",
            text: "Ce que veulent dire les pourcentages, les symboles de lavage et les mentions qui n'engagent à rien.",
          },
          {
            title: "Faire durer une doudoune",
            text: "Lavage, séchage, stockage d'été. Trois erreurs courantes suffisent à ruiner un garnissage en une saison.",
          },
          {
            title: "Une taille pour deux hivers",
            text: "Comment choisir la marge sans se retrouver avec un manteau qui flotte le premier hiver et serre le second.",
          },
        ],
      },
      {
        kind: "appel",
        label: "Être prévenu des publications",
        href: "/contact",
      },
    ],
  },
];
