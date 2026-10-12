import type { ContentPage } from "@/types/content-page";

/**
 * Groupe « Besoin d'aide ? ».
 *
 * Les délais, seuils et frais écrits ici sont ceux déjà annoncés ailleurs sur
 * le site (barre d'annonce, pied de page, bandeau Klarna). Les modifier
 * demande de les modifier partout : c'est précisément ce que le formulaire
 * Admin › Réglages est destiné à centraliser.
 */
export const AIDE_PAGES: ContentPage[] = [
  {
    slug: "aide/livraison",
    group: "aide",
    title: "Livraison et délais",
    lead: "Modes d'expédition, frais, délais et suivi. Le port est le tarif réel du transporteur, affiché au moment du paiement selon le poids du colis.",
    toc: true,
    blocks: [
      {
        kind: "titre",
        text: "Modes de livraison",
      },
      {
        kind: "paragraphe",
        text: "Le mode de livraison se choisit à l'étape du paiement. Les délais courent à partir de l'expédition de la commande, et non de la validation du paiement : comptez une journée ouvrée de préparation en plus.",
      },
      {
        kind: "tableau",
        caption: "France métropolitaine, à partir de l'expédition. Le tarif exact s'affiche au paiement : il dépend du poids du colis.",
        head: ["Mode", "Transporteur", "Délai"],
        rows: [
          ["Point relais", "Mondial Relay", "3 à 5 jours ouvrés"],
          ["Point relais", "Colissimo (bureau de poste, relais Pickup)", "2 jours ouvrés"],
          ["Point relais", "Chronopost (relais Pickup)", "2 à 4 jours ouvrés"],
          ["Domicile", "Mondial Relay", "3 à 5 jours ouvrés"],
          ["Domicile", "Colissimo", "2 jours ouvrés"],
          ["Retrait en boutique", "Grand Littoral, Marseille", "Gratuit, dès que la commande est prête"],
        ],
      },
      {
        kind: "tableau",
        caption: "Hors France métropolitaine.",
        head: ["Destination", "Livraison", "Frais"],
        rows: [
          ["Belgique, Luxembourg, Suisse, Monaco", "À domicile", "Tarif du transporteur, affiché au paiement"],
        ],
      },
      {
        kind: "note",
        text: "Hors Union européenne, des droits de douane et taxes locales peuvent s'ajouter à l'arrivée. Ils restent à la charge du destinataire et ne sont ni perçus ni remboursés par Droopy's.",
      },
      {
        kind: "titre",
        text: "Préparation de la commande",
      },
      {
        kind: "paragraphe",
        text: "Les commandes passées avant 13 h un jour ouvré partent le jour même. Passé cette heure, ou le week-end et les jours fériés, la préparation reprend le jour ouvré suivant.",
      },
      {
        kind: "paragraphe",
        text: "Une commande qui réunit plusieurs articles part en un seul colis. Si l'un d'eux est en réassort, nous expédions le reste immédiatement et le solde dès sa réception, sans frais supplémentaires.",
      },
      {
        kind: "titre",
        text: "Suivre son colis",
      },
      {
        kind: "etapes",
        items: [
          {
            title: "Confirmation de commande",
            text: "Un e-mail récapitulatif arrive dans les minutes qui suivent le paiement. S'il manque, vérifiez le dossier des indésirables avant de nous écrire.",
          },
          {
            title: "Avis d'expédition",
            text: "Un second e-mail annonce le départ du colis et porte le numéro de suivi du transporteur.",
          },
          {
            title: "Suivi en direct",
            text: "Le numéro de suivi devient actif quelques heures après l'expédition, le temps que le transporteur scanne le colis.",
          },
        ],
      },
      {
        kind: "appel",
        label: "Suivre ma commande",
        href: "/suivi-commande",
      },
      {
        kind: "titre",
        text: "Questions fréquentes",
      },
      {
        kind: "faq",
        items: [
          {
            question: "Puis-je modifier l'adresse après avoir commandé ?",
            answer: "Tant que la commande n'est pas expédiée, oui : écrivez-nous au plus vite avec votre numéro de commande. Une fois le colis parti, l'adresse ne peut plus être changée que par le transporteur, depuis son propre suivi.",
          },
          {
            question: "Mon colis est annoncé livré mais je ne l'ai pas reçu.",
            answer: "Vérifiez d'abord auprès du gardien et des voisins immédiats, puis le lendemain : un colis scanné « livré » en fin de tournée est parfois remis le jour suivant. Passé 48 h, contactez-nous, nous ouvrons une enquête auprès du transporteur.",
          },
          {
            question: "Livrez-vous en Suisse et au Royaume-Uni ?",
            answer: "Pas encore. Nous livrons la France, l'outre-mer et l'Union européenne. Les autres destinations s'ouvriront au fur et à mesure.",
          },
          {
            question: "Puis-je faire livrer à une adresse différente de la facturation ?",
            answer: "Oui, les deux adresses se saisissent séparément au moment du paiement.",
          },
        ],
      },
    ],
  },

  {
    slug: "aide/retours",
    group: "aide",
    title: "Retours et remboursements",
    lead: "Trente jours pour changer d'avis, retour sans frais depuis un point relais ou en boutique, remboursement sous quatorze jours après réception.",
    toc: true,
    blocks: [
      {
        kind: "titre",
        text: "Le délai",
      },
      {
        kind: "paragraphe",
        text: "Vous disposez de trente jours à compter de la réception pour nous retourner un article. C'est plus que les quatorze jours du droit de rétractation légal : ce délai supplémentaire est un engagement commercial de Droopy's, il ne remplace pas vos droits, il s'y ajoute.",
      },
      {
        kind: "titre",
        text: "L'état de l'article",
      },
      {
        kind: "paragraphe",
        text: "L'article doit revenir dans l'état où il est parti : non porté, non lavé, avec ses étiquettes d'origine encore attachées et, s'il en avait une, sa boîte. Un essayage est évidemment attendu — c'est l'usage qui ne l'est pas.",
      },
      {
        kind: "liste",
        items: [
          "Les chaussures voyagent dans leur boîte, elle-même placée dans un carton d'expédition : une boîte servant d'emballage revient abîmée et l'article n'est plus revendable.",
          "Les sous-vêtements et maillots de bain ne sont repris que si leur protection d'hygiène est intacte.",
          "Les cartes cadeaux, les articles personnalisés et les produits de soin descellés ne sont pas repris.",
        ],
      },
      {
        kind: "titre",
        text: "Renvoyer un article",
      },
      {
        kind: "etapes",
        items: [
          {
            title: "Déclarer le retour",
            text: "Depuis le suivi de commande, indiquez les articles concernés et le motif. Le motif ne conditionne pas l'acceptation : il nous sert à corriger nos fiches produit quand une taille revient systématiquement.",
          },
          {
            title: "Imprimer l'étiquette",
            text: "Une étiquette prépayée s'affiche aussitôt. Le retour en point relais est sans frais ; un enlèvement à domicile coûte 6,90 €, déduits du remboursement.",
          },
          {
            title: "Déposer le colis",
            text: "Conservez la preuve de dépôt jusqu'au remboursement : c'est elle qui fait foi si le colis se perd en chemin.",
          },
          {
            title: "Être remboursé",
            text: "Le remboursement part dans les quatorze jours suivant la réception en entrepôt, sur le moyen de paiement d'origine. Comptez deux à cinq jours ouvrés de plus pour que la banque le crédite.",
          },
        ],
      },
      {
        kind: "note",
        text: "Un achat en ligne se rapporte aussi en boutique, sans étiquette ni colis, dans le même délai de trente jours. Le remboursement suit alors le circuit habituel, sur le moyen de paiement d'origine.",
      },
      {
        kind: "titre",
        text: "Échanges",
      },
      {
        kind: "paragraphe",
        text: "Nous ne pratiquons pas l'échange à distance : une taille réservée le temps d'un aller-retour postal, c'est une taille indisponible pour quelqu'un d'autre pendant une semaine. Retournez l'article et repassez commande — c'est plus rapide, et la nouvelle taille est garantie.",
      },
      {
        kind: "titre",
        text: "Article défectueux ou erreur de notre part",
      },
      {
        kind: "paragraphe",
        text: "Si l'article est abîmé, ne correspond pas à la commande ou présente un défaut de fabrication, le retour et la réexpédition sont intégralement à notre charge. Écrivez-nous avec votre numéro de commande et une photo du défaut, nous réglons cela sans vous faire avancer de frais.",
      },
      {
        kind: "paragraphe",
        text: "Cela ne retire rien à la garantie légale de conformité ni à celle des vices cachés, qui s'appliquent de plein droit et sont détaillées dans nos conditions générales de vente.",
      },
      {
        kind: "appel",
        label: "Lire les conditions générales de vente",
        href: "/legal/cgv",
      },
    ],
  },

  {
    slug: "compte/commandes",
    group: "aide",
    title: "Suivre ma commande",
    lead: "Retrouvez l'état de votre commande avec son numéro et l'adresse e-mail utilisée lors de l'achat — aucun compte n'est nécessaire.",
    blocks: [
      {
        kind: "paragraphe",
        text: "Le numéro de commande figure dans l'e-mail de confirmation, sous la forme DRP-000000. Il est également rappelé sur le bon de livraison glissé dans le colis.",
      },
      {
        kind: "titre",
        text: "Ce que disent les états",
      },
      {
        kind: "tableau",
        head: ["État", "Ce qu'il signifie"],
        rows: [
          ["En préparation", "La commande est acceptée, les articles sont en cours de rassemblement."],
          ["Expédiée", "Le colis a quitté l'entrepôt, le numéro de suivi est actif."],
          ["En cours de livraison", "Le colis est sur la tournée du jour ou disponible en point relais."],
          ["Livrée", "Le transporteur a enregistré la remise."],
          ["Retour reçu", "Votre retour est arrivé, le remboursement part sous quatorze jours."],
        ],
      },
      {
        kind: "note",
        text: "Le suivi n'est pas encore relié à la base de commandes : le formulaire ci-dessous valide la saisie mais n'interroge rien pour l'instant.",
      },
    ],
  },

  {
    slug: "aide/tailles",
    group: "aide",
    title: "Guide des tailles",
    lead: "Les correspondances de la naissance à 16 ans, et la façon de mesurer un enfant sans le faire tenir debout dix minutes.",
    image: "/imgdress/petitgas2.webp",
    imageClassName: "object-[50%_25%]",
    toc: true,
    blocks: [
      {
        kind: "paragraphe",
        text: "Les marques que nous vendons ne taillent pas toutes pareil : une même année d'âge peut couvrir six centimètres d'écart d'une maison italienne à une maison britannique. C'est donc la taille en centimètres qui fait foi, jamais l'âge indiqué sur l'étiquette.",
      },
      {
        kind: "titre",
        text: "Mesurer",
      },
      {
        kind: "liste",
        items: [
          "Taille : debout contre un mur, talons joints, du sol au sommet du crâne. Pour un bébé, allongé sur le dos, de la plante des pieds au sommet du crâne.",
          "Poitrine : le mètre à plat sous les aisselles, sans serrer.",
          "Tour de taille : à l'endroit le plus étroit, le ventre au repos.",
          "Pied : debout, talon contre un mur, du mur au bout du plus grand orteil — qui n'est pas toujours le premier.",
        ],
      },
      {
        kind: "note",
        text: "Entre deux tailles, prenez la plus grande. Un vêtement d'enfant est porté une saison ou deux ; c'est la marge qui décide de laquelle.",
      },
      {
        kind: "titre",
        text: "Bébé — de la naissance à 3 ans",
      },
      {
        kind: "tableau",
        head: ["Taille", "Âge indicatif", "Hauteur", "Poids indicatif"],
        rows: [
          ["Naissance", "0 mois", "50 cm", "3 à 4 kg"],
          ["1 M", "1 mois", "54 cm", "4 à 5 kg"],
          ["3 M", "3 mois", "60 cm", "5 à 6 kg"],
          ["6 M", "6 mois", "67 cm", "7 à 8 kg"],
          ["9 M", "9 mois", "71 cm", "8 à 9 kg"],
          ["12 M", "12 mois", "74 cm", "9 à 10 kg"],
          ["18 M", "18 mois", "81 cm", "11 kg"],
          ["24 M", "2 ans", "86 cm", "12 kg"],
          ["36 M", "3 ans", "94 cm", "14 kg"],
        ],
      },
      {
        kind: "titre",
        text: "Enfant — de 4 à 16 ans",
      },
      {
        kind: "tableau",
        head: ["Taille", "Âge indicatif", "Hauteur", "Poitrine", "Taille"],
        rows: [
          ["4", "4 ans", "102 cm", "55 cm", "52 cm"],
          ["6", "6 ans", "114 cm", "59 cm", "55 cm"],
          ["8", "8 ans", "128 cm", "64 cm", "58 cm"],
          ["10", "10 ans", "140 cm", "69 cm", "61 cm"],
          ["12", "12 ans", "152 cm", "75 cm", "64 cm"],
          ["14", "14 ans", "158 cm", "80 cm", "67 cm"],
          ["16", "16 ans", "164 cm", "85 cm", "70 cm"],
        ],
      },
      {
        kind: "titre",
        text: "Chaussures",
      },
      {
        kind: "tableau",
        caption: "Pointures européennes, longueur de pied en centimètres.",
        head: ["Pointure", "Longueur du pied", "Âge indicatif"],
        rows: [
          ["17", "10,3 cm", "0 à 3 mois"],
          ["19", "11,6 cm", "3 à 6 mois"],
          ["21", "12,9 cm", "9 à 12 mois"],
          ["23", "14,1 cm", "18 mois"],
          ["25", "15,4 cm", "2 ans"],
          ["27", "16,7 cm", "3 ans"],
          ["29", "18,0 cm", "4 à 5 ans"],
          ["31", "19,3 cm", "6 ans"],
          ["33", "20,5 cm", "7 à 8 ans"],
          ["35", "21,8 cm", "9 à 10 ans"],
          ["37", "23,1 cm", "11 à 12 ans"],
          ["39", "24,4 cm", "13 ans et plus"],
        ],
      },
      {
        kind: "note",
        text: "Ajoutez environ un centimètre à la longueur mesurée pour choisir la pointure : un pied d'enfant a besoin de place devant pour se dérouler à chaque pas.",
      },
      {
        kind: "titre",
        text: "Correspondances internationales",
      },
      {
        kind: "tableau",
        head: ["France / Europe", "Royaume-Uni", "États-Unis", "Italie"],
        rows: [
          ["4 ans", "3-4 y", "4T", "4 anni"],
          ["6 ans", "5-6 y", "6", "6 anni"],
          ["8 ans", "7-8 y", "8", "8 anni"],
          ["10 ans", "9-10 y", "10", "10 anni"],
          ["12 ans", "11-12 y", "12", "12 anni"],
          ["14 ans", "13-14 y", "14", "14 anni"],
        ],
      },
      {
        kind: "appel",
        label: "Une taille vous laisse hésitant ? Écrivez-nous",
        href: "/contact",
      },
    ],
  },

  {
    slug: "contact",
    group: "aide",
    title: "Nous contacter",
    lead: "Une question sur une commande, une taille, une pièce ? Nous répondons sous un jour ouvré.",
    blocks: [
      {
        kind: "paragraphe",
        text: "Avant d'écrire, un détour par les pages Livraison et Retours répond souvent plus vite : les délais, les frais et la marche à suivre pour un retour y sont détaillés.",
      },
      {
        kind: "cartes",
        items: [
          {
            title: "Commandes et livraisons",
            text: "Suivi, modification d'adresse, colis en retard. Munissez-vous de votre numéro de commande, cela nous évite un aller-retour.",
          },
          {
            title: "Produits et tailles",
            text: "Coupe, matière, entretien, disponibilité d'un réassort. Dites-nous la taille et la hauteur de l'enfant, nous vous répondrons précisément.",
          },
          {
            title: "Boutique",
            text: "Disponibilité d'une pièce en rayon, retrait, réservation d'un essayage à Grand Littoral.",
          },
          {
            title: "Presse et partenariats",
            text: "Prêts de pièces, collaborations, demandes de visuels : précisez le support et la date de parution.",
          },
        ],
      },
      {
        kind: "titre",
        text: "Écrire",
      },
    ],
  },
];
