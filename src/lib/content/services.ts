import type { ContentPage } from "@/types/content-page";

/**
 * Groupe « Nos services ».
 *
 * Aucun de ces services n'est branché : ni la carte cadeau, ni les points de
 * fidélité, ni le parrainage. Les pages décrivent donc des règles, pas des
 * comptes — et chacune le dit en clair, plutôt que d'afficher un solde à zéro
 * qu'on prendrait pour une erreur.
 */
export const SERVICES_PAGES: ContentPage[] = [
  {
    slug: "carte-cadeau",
    group: "services",
    // Retirée du pied de page : L'achat en ligne n'est pas ouvert, un lien en
    // bas de chaque page promettrait un service qui n'existe pas encore.
    footer: false,
    title: "Carte cadeau",
    lead: "Un montant libre entre 25 et 500 €, valable un an, en boutique comme en ligne.",
    blocks: [
      {
        kind: "paragraphe",
        text: "La carte cadeau Droopy's laisse choisir celui qui reçoit. C'est souvent le bon réflexe pour un enfant : la taille change deux fois par an, le goût aussi.",
      },
      {
        kind: "titre",
        text: "Comment elle fonctionne",
      },
      {
        kind: "etapes",
        items: [
          {
            title: "Choisir un montant",
            text: "Libre, entre 25 et 500 €. Le montant se répartit sur autant d'achats que nécessaire : la carte n'a pas à être dépensée en une fois.",
          },
          {
            title: "Choisir la forme",
            text: "Carte électronique envoyée par e-mail à la date que vous fixez, ou carte physique remise en boutique.",
          },
          {
            title: "L'utiliser",
            text: "Le code se saisit à l'étape du paiement, ou se présente en caisse. Si le panier dépasse le solde, la différence se règle normalement.",
          },
        ],
      },
      {
        kind: "titre",
        text: "Les règles",
      },
      {
        kind: "liste",
        items: [
          "Validité : un an à compter de l'émission.",
          "Utilisable en boutique et sur le site, sur tout le catalogue, soldes comprises.",
          "Non rechargeable, non remboursable et non échangeable contre des espèces.",
          "Le solde restant reste attaché au code jusqu'à expiration ; il ne se transfère pas sur une autre carte.",
          "Une carte perdue n'est remplacée que sur présentation de la preuve d'achat.",
        ],
      },
      {
        kind: "note",
        text: "L'achat de carte cadeau en ligne n'est pas encore ouvert. La carte physique est disponible en boutique dès maintenant.",
      },
      {
        kind: "appel",
        label: "Voir la boutique",
        href: "/boutiques",
      },
    ],
  },

  {
    slug: "fidelite",
    group: "services",
    // Retirée du pied de page : Le programme n'est pas ouvert aux inscriptions, un lien en
    // bas de chaque page promettrait un service qui n'existe pas encore.
    footer: false,
    title: "Programme fidélité",
    lead: "Un euro dépensé, un point. Cent points, dix euros de remise — en boutique comme en ligne, sur le même compte.",
    toc: true,
    blocks: [
      {
        kind: "paragraphe",
        text: "Le programme est gratuit et sans carte à sortir : il suit l'adresse e-mail utilisée au moment de l'achat. Les achats en boutique et en ligne alimentent le même compteur.",
      },
      {
        kind: "titre",
        text: "Gagner des points",
      },
      {
        kind: "tableau",
        head: ["Action", "Points"],
        rows: [
          ["1 € dépensé", "1 point"],
          ["Création du compte", "50 points"],
          ["Premier achat en boutique", "50 points"],
          ["Avis publié sur un article acheté", "25 points"],
          ["Anniversaire de l'enfant enregistré", "100 points"],
        ],
      },
      {
        kind: "titre",
        text: "Dépenser les points",
      },
      {
        kind: "tableau",
        head: ["Palier", "Remise"],
        rows: [
          ["100 points", "10 €"],
          ["250 points", "27 €"],
          ["500 points", "60 €"],
          ["1 000 points", "130 €"],
        ],
      },
      {
        kind: "paragraphe",
        text: "La remise se déclenche au moment du paiement, sur un panier d'un montant au moins égal. Elle se cumule avec les soldes et les promotions, mais une seule remise fidélité par commande.",
      },
      {
        kind: "titre",
        text: "Ce qu'il faut savoir",
      },
      {
        kind: "liste",
        items: [
          "Les points sont crédités à l'expédition de la commande, pas à la validation du paiement.",
          "Un retour annule les points correspondants ; si la remise a déjà été utilisée, le solde peut devenir négatif jusqu'au prochain achat.",
          "Les points expirent au bout de vingt-quatre mois sans aucun achat.",
          "Les points ne s'achètent pas, ne se transfèrent pas et n'ont aucune valeur en euros hors du programme.",
        ],
      },
      {
        kind: "note",
        text: "Le programme n'est pas encore ouvert aux inscriptions : les comptes clients arriveront avec la mise en service de la base. Les règles ci-dessus sont celles qui s'appliqueront à l'ouverture.",
      },
    ],
  },

  {
    slug: "services/retrait",
    group: "services",
    title: "Retrait en boutique",
    lead: "Commandez en ligne, essayez et récupérez à Grand Littoral. Gratuit, et souvent disponible dans la journée.",
    blocks: [
      {
        kind: "paragraphe",
        text: "Le retrait en boutique évite les frais de port et l'attente du transporteur. Il permet surtout d'essayer sur place : si la taille ne va pas, l'échange se fait immédiatement, sans repasser par un colis.",
      },
      {
        kind: "titre",
        text: "Comment ça se passe",
      },
      {
        kind: "etapes",
        items: [
          {
            title: "Choisir le retrait au paiement",
            text: "L'option apparaît dans la liste des modes de livraison dès qu'un article du panier est disponible en boutique.",
          },
          {
            title: "Attendre l'avis de mise à disposition",
            text: "Un e-mail confirme que la commande est prête. Comptez deux heures pour un article en rayon, deux jours ouvrés s'il doit venir de l'entrepôt.",
          },
          {
            title: "Se présenter en caisse",
            text: "Munissez-vous du numéro de commande et d'une pièce d'identité. Une autre personne peut retirer à votre place si vous nous avez communiqué son nom.",
          },
        ],
      },
      {
        kind: "titre",
        text: "Les règles",
      },
      {
        kind: "liste",
        items: [
          "La commande reste à disposition quatorze jours. Passé ce délai, elle est annulée et remboursée intégralement.",
          "Le paiement se fait en ligne, au moment de la commande : il n'y a rien à régler au retrait.",
          "Un article retiré puis refusé sur place est remboursé immédiatement, sans procédure de retour.",
          "Le retrait est possible pour les articles disponibles en boutique et pour ceux acheminés depuis l'entrepôt.",
        ],
      },
      {
        kind: "appel",
        label: "Voir les horaires et l'adresse",
        href: "/boutiques",
      },
    ],
  },

  {
    slug: "services/paiement",
    group: "services",
    title: "Paiement en 3 fois",
    lead: "Régler en trois échéances sans frais, de 100 à 2 000 €, via Klarna.",
    // Pas de photo d'en-tête : le seul visuel Klarna disponible est un logo,
    // et un logo étiré en bandeau pleine largeur ne ressemble à rien.
    blocks: [
      {
        kind: "paragraphe",
        text: "Le paiement en trois fois est proposé par Klarna, notre partenaire de financement. Le premier tiers est prélevé à la commande, les deux autres à trente et soixante jours. Sans frais pour vous, et sans intérêt.",
      },
      {
        kind: "titre",
        text: "Comment y accéder",
      },
      {
        kind: "etapes",
        items: [
          {
            title: "Choisir Klarna au paiement",
            text: "L'option apparaît dès que le panier atteint 100 €.",
          },
          {
            title: "Renseigner sa carte",
            text: "Klarna vérifie l'éligibilité en quelques secondes. La réponse est immédiate, et un refus n'a aucune conséquence sur la commande, qui peut se régler autrement.",
          },
          {
            title: "Laisser courir les échéances",
            text: "Les deux prélèvements suivants partent automatiquement sur la même carte. Klarna prévient par e-mail quelques jours avant chacun.",
          },
        ],
      },
      {
        kind: "tableau",
        caption: "Exemple pour un achat de 300 €.",
        head: ["Échéance", "Date", "Montant"],
        rows: [
          ["1er versement", "À la commande", "100 €"],
          ["2e versement", "30 jours après", "100 €"],
          ["3e versement", "60 jours après", "100 €"],
        ],
      },
      {
        kind: "titre",
        text: "Conditions",
      },
      {
        kind: "liste",
        items: [
          "Panier compris entre 100 et 2 000 €.",
          "Réservé aux personnes majeures résidant en France.",
          "Carte bancaire française, valable au moins jusqu'à la dernière échéance.",
          "L'éligibilité est décidée par Klarna, pas par Droopy's : nous n'avons ni le motif d'un refus ni le moyen de le lever.",
          "En cas d'incident de paiement, des frais de retard peuvent être appliqués par Klarna selon ses propres conditions.",
        ],
      },
      {
        kind: "note",
        text: "Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. En cas de retour, le remboursement transite par Klarna et ajuste les échéances restantes.",
      },
    ],
  },

  {
    slug: "parrainage",
    group: "services",
    // Retirée du pied de page : Les liens de parrainage ne sont pas générés, un lien en
    // bas de chaque page promettrait un service qui n'existe pas encore.
    footer: false,
    title: "Parrainage",
    lead: "20 € pour vous, 20 € pour la personne que vous parrainez, dès sa première commande.",
    blocks: [
      {
        kind: "paragraphe",
        text: "Le parrainage récompense les deux côtés, et seulement après un achat réel : c'est ce qui le distingue d'un code de remise ordinaire.",
      },
      {
        kind: "etapes",
        items: [
          {
            title: "Partager votre lien",
            text: "Chaque client dispose d'un lien personnel, disponible dans son espace commande.",
          },
          {
            title: "La personne commande",
            text: "Elle reçoit 20 € de remise dès 120 € d'achat, utilisables sur sa première commande.",
          },
          {
            title: "Vous êtes crédité",
            text: "Un bon de 20 € vous est envoyé une fois le délai de retour de trente jours écoulé — le temps que la commande soit définitive.",
          },
        ],
      },
      {
        kind: "titre",
        text: "Les règles",
      },
      {
        kind: "liste",
        items: [
          "Le parrainage s'adresse à une personne qui n'a jamais commandé chez Droopy's.",
          "Cinq filleuls au maximum par an et par parrain.",
          "Les bons de parrainage ne se cumulent pas entre eux sur une même commande.",
          "Un bon est valable six mois et n'est pas remboursable en espèces.",
          "Une commande annulée ou retournée annule le bon correspondant.",
        ],
      },
      {
        kind: "note",
        text: "Le parrainage ouvrira avec les comptes clients. Les liens personnels ne sont pas encore générés.",
      },
    ],
  },
];
