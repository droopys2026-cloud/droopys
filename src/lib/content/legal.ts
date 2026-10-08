import { LEGAL, LEGAL_ADDRESS_INLINE } from "@/lib/legal";
import type { ContentPage } from "@/types/content-page";

/**
 * Groupe « Informations légales ».
 *
 * Deux règles tiennent ce fichier :
 *
 * 1. L'identité de l'entreprise ne s'écrit jamais en dur ici. Elle vient de
 *    `@/lib/legal`, qui la tient du registre public. Recopier un SIRET dans
 *    cinq paragraphes, c'est s'exposer à en corriger quatre le jour où il
 *    change.
 * 2. Les champs que le registre ne publie pas (capital, TVA, greffe,
 *    hébergeur) n'apparaissent pas dans ces textes : ils sont rendus par le
 *    tableau d'identité de la page « Mentions légales », qui sait les marquer
 *    comme restant à fournir au lieu de les inventer.
 *
 * Ces pages sont des textes de référence, pas un conseil juridique : elles
 * doivent être relues par un juriste avant l'ouverture de la boutique.
 */

/** Date de la rédaction de ces textes. Elle change à chaque révision. */
const REVISION = "2026-09-15";

export const LEGAL_PAGES: ContentPage[] = [
  {
    slug: "legal/cgv",
    group: "legal",
    title: "Conditions générales de vente",
    lead: `Les conditions applicables à toute commande passée sur le site Droopy's, exploité par ${LEGAL.companyName}.`,
    updatedAt: REVISION,
    toc: true,
    blocks: [
      {
        kind: "note",
        text: "Ce texte est un modèle de travail. Il doit être relu par un juriste et complété des mentions manquantes avant la mise en service de la boutique.",
      },
      { kind: "titre", text: "1. Objet et champ d'application" },
      {
        kind: "paragraphe",
        text: `Les présentes conditions générales régissent les ventes d'articles conclues à distance entre ${LEGAL.companyName}, ${LEGAL.legalForm} dont le siège est situé ${LEGAL_ADDRESS_INLINE}, immatriculée sous le numéro SIREN ${LEGAL.siren}, ci-après « le Vendeur », et toute personne physique non commerçante effectuant un achat sur le site, ci-après « le Client ».`,
      },
      {
        kind: "paragraphe",
        text: "Le fait de passer commande emporte acceptation sans réserve des présentes conditions, dans leur version en ligne au jour de la commande. Le Vendeur se réserve le droit de les modifier à tout moment ; les commandes déjà passées restent régies par la version acceptée lors de leur validation.",
      },
      { kind: "titre", text: "2. Articles et disponibilité" },
      {
        kind: "paragraphe",
        text: "Les articles proposés sont décrits et présentés avec la plus grande exactitude possible. Les photographies ne sont pas contractuelles : un écran ne restitue pas fidèlement une couleur, et un léger écart de teinte ne constitue pas un défaut de conformité.",
      },
      {
        kind: "paragraphe",
        text: "Les offres sont valables tant que les articles figurent au catalogue et dans la limite des stocks disponibles. Si un article devient indisponible après la commande, le Client en est informé et remboursé de sa part dans les meilleurs délais, sans que cette indisponibilité ouvre droit à indemnité.",
      },
      { kind: "titre", text: "3. Prix" },
      {
        kind: "paragraphe",
        text: "Les prix sont indiqués en euros toutes taxes comprises, hors frais de livraison. Les frais de livraison applicables sont affichés avant la validation définitive de la commande et rappelés sur la confirmation.",
      },
      {
        kind: "paragraphe",
        text: "Le Vendeur peut modifier ses prix à tout moment. Le prix applicable est celui affiché au moment de la validation de la commande. Pour une livraison hors Union européenne, les droits de douane et taxes locales restent à la charge du Client.",
      },
      { kind: "titre", text: "4. Commande" },
      {
        kind: "etapes",
        items: [
          {
            title: "Sélection",
            text: "Le Client choisit ses articles, leur taille et leur quantité, et les ajoute au panier.",
          },
          {
            title: "Vérification",
            text: "Le récapitulatif de commande indique les articles, le prix total, les frais de livraison et l'adresse. Le Client peut corriger toute erreur avant de valider.",
          },
          {
            title: "Validation",
            text: "La validation, précédée de l'acceptation des présentes conditions, vaut conclusion du contrat.",
          },
          {
            title: "Confirmation",
            text: "Un e-mail récapitulatif est adressé au Client sans délai injustifié. Il constitue la confirmation de la commande.",
          },
        ],
      },
      {
        kind: "paragraphe",
        text: "Le Vendeur peut refuser ou annuler une commande présentant un caractère anormal, notamment en cas de litige antérieur, de quantité manifestement destinée à la revente ou de suspicion de fraude au paiement.",
      },
      { kind: "titre", text: "5. Paiement" },
      {
        kind: "paragraphe",
        text: "Le paiement est exigible à la commande. Il s'effectue par carte bancaire, portefeuille électronique, ou en trois échéances via notre partenaire Klarna selon les conditions propres à ce service.",
      },
      {
        kind: "paragraphe",
        text: "Les coordonnées bancaires sont transmises chiffrées au prestataire de paiement et ne sont jamais conservées par le Vendeur. La commande n'est traitée qu'après autorisation du centre de paiement ; en cas de refus, elle est automatiquement annulée.",
      },
      {
        kind: "paragraphe",
        text: "Le Vendeur conserve la propriété des articles jusqu'au paiement complet du prix. Le transfert des risques intervient en revanche à la remise physique du colis au Client.",
      },
      { kind: "titre", text: "6. Livraison" },
      {
        kind: "paragraphe",
        text: "Les articles sont livrés à l'adresse indiquée par le Client, selon le mode choisi et dans les délais annoncés sur la page Livraison et délais. Ces délais courent à compter de l'expédition et ne sont pas garantis en cas de force majeure ou de fait du transporteur.",
      },
      {
        kind: "paragraphe",
        text: "À défaut d'indication de délai, le Vendeur livre sans retard injustifié et au plus tard trente jours après la conclusion du contrat. Passé ce terme, le Client peut résoudre le contrat après mise en demeure restée infructueuse, et être remboursé sous quatorze jours.",
      },
      {
        kind: "paragraphe",
        text: "Le Client est invité à vérifier l'état du colis à la réception et à signaler toute avarie au transporteur et au Vendeur dans les trois jours ouvrables.",
      },
      { kind: "titre", text: "7. Droit de rétractation" },
      {
        kind: "paragraphe",
        text: "Le Client dispose d'un délai de quatorze jours à compter de la réception pour exercer son droit de rétractation sans avoir à motiver sa décision ni à supporter de pénalité. Le Vendeur porte volontairement ce délai à trente jours au titre de sa politique commerciale de retour.",
      },
      {
        kind: "paragraphe",
        text: "La rétractation s'exerce par toute déclaration dénuée d'ambiguïté, notamment depuis le suivi de commande. Les articles doivent être renvoyés dans les quatorze jours suivant la déclaration, dans un état permettant leur remise en vente.",
      },
      {
        kind: "paragraphe",
        text: "Le remboursement intervient au plus tard quatorze jours après récupération des articles, par le même moyen de paiement que celui utilisé pour la commande. Il comprend les frais de livraison standard initialement payés, à l'exclusion du surcoût d'un mode de livraison plus rapide.",
      },
      {
        kind: "paragraphe",
        text: "Sont exclus du droit de rétractation les articles confectionnés sur mesure ou personnalisés, ainsi que les articles descellés ne pouvant être renvoyés pour des raisons d'hygiène.",
      },
      { kind: "titre", text: "8. Garanties légales" },
      {
        kind: "paragraphe",
        text: "Tous les articles bénéficient de la garantie légale de conformité, qui s'exerce dans un délai de deux ans à compter de la délivrance, et de la garantie contre les vices cachés, qui s'exerce dans un délai de deux ans à compter de la découverte du vice.",
      },
      {
        kind: "paragraphe",
        text: "Au titre de la garantie de conformité, le Client choisit entre la réparation et le remplacement, sous réserve du coût manifestement disproportionné de l'option retenue. Il est dispensé de prouver l'existence du défaut de conformité durant les vingt-quatre mois suivant la délivrance.",
      },
      {
        kind: "paragraphe",
        text: "Ces garanties s'appliquent indépendamment de la politique commerciale de retour et sans frais pour le Client.",
      },
      { kind: "titre", text: "9. Données personnelles" },
      {
        kind: "paragraphe",
        text: "Les données collectées sont nécessaires au traitement de la commande et à la relation client. Leur traitement, leur durée de conservation et les droits du Client sont détaillés sur la page Confidentialité.",
      },
      { kind: "titre", text: "10. Réclamation et médiation" },
      {
        kind: "paragraphe",
        text: "Toute réclamation doit d'abord être adressée au service client, qui s'engage à répondre sous un jour ouvré. À défaut de solution amiable, le Client peut recourir gratuitement à un médiateur de la consommation dans un délai d'un an à compter de sa réclamation écrite.",
      },
      {
        kind: "paragraphe",
        text: `La Commission européenne met également à disposition une plateforme de règlement en ligne des litiges, accessible à l'adresse ${LEGAL.odrUrl}.`,
      },
      { kind: "titre", text: "11. Droit applicable" },
      {
        kind: "paragraphe",
        text: "Les présentes conditions sont soumises au droit français. En cas de litige, les tribunaux français sont compétents dans les conditions de droit commun ; le Client conserve le bénéfice des dispositions impératives protectrices du consommateur de son pays de résidence.",
      },
    ],
  },

  {
    slug: "legal/mentions",
    group: "legal",
    title: "Mentions légales",
    lead: "Éditeur, hébergeur et identité de l'entreprise qui exploite le site Droopy's.",
    updatedAt: REVISION,
    blocks: [
      {
        kind: "paragraphe",
        text: "Les informations ci-dessous sont publiées en application de la loi pour la confiance dans l'économie numérique. Les données d'immatriculation proviennent du registre public des entreprises.",
      },
      { kind: "titre", text: "Éditeur du site" },
    ],
  },

  {
    slug: "legal/confidentialite",
    group: "legal",
    title: "Confidentialité",
    lead: "Les données que nous collectons, pourquoi, combien de temps, et comment reprendre la main dessus.",
    updatedAt: REVISION,
    toc: true,
    blocks: [
      {
        kind: "paragraphe",
        text: `${LEGAL.companyName} est responsable du traitement des données collectées sur le site. Cette page décrit ce que nous faisons de ces données ; elle est écrite pour être lue, pas pour être acceptée sans être lue.`,
      },
      { kind: "titre", text: "Ce que nous collectons" },
      {
        kind: "tableau",
        head: ["Donnée", "Pourquoi", "Base légale", "Conservation"],
        rows: [
          [
            "Identité et coordonnées",
            "Traiter et livrer la commande",
            "Exécution du contrat",
            "3 ans après le dernier contact",
          ],
          [
            "Adresse de livraison",
            "Acheminer le colis",
            "Exécution du contrat",
            "3 ans après le dernier contact",
          ],
          [
            "Historique de commandes",
            "Suivi, retours, garanties",
            "Exécution du contrat",
            "10 ans (obligation comptable)",
          ],
          [
            "Adresse e-mail (newsletter)",
            "Envoyer nos actualités",
            "Consentement",
            "Jusqu'au retrait du consentement",
          ],
          [
            "Mesure d'audience",
            "Comprendre l'usage du site",
            "Consentement",
            "13 mois",
          ],
          [
            "Candidature spontanée",
            "Étudier une candidature",
            "Intérêt légitime",
            "1 an",
          ],
        ],
      },
      {
        kind: "paragraphe",
        text: "Nous ne collectons aucune donnée relative aux enfants eux-mêmes en dehors de ce que le parent saisit volontairement (taille, date d'anniversaire pour le programme fidélité). Aucune de ces informations n'est utilisée à des fins publicitaires.",
      },
      { kind: "titre", text: "Nous ne vendons pas vos données" },
      {
        kind: "paragraphe",
        text: "Vos données ne sont ni vendues, ni louées, ni échangées. Elles sont transmises uniquement à nos sous-traitants, et strictement pour ce qu'ils font pour nous : transporteur pour livrer, prestataire de paiement pour encaisser, service d'e-mailing pour envoyer nos messages.",
      },
      {
        kind: "paragraphe",
        text: "Ces sous-traitants sont liés par contrat, n'utilisent vos données pour aucun autre usage, et sont hébergés dans l'Union européenne. Si l'un d'eux devait traiter des données hors de l'Union, nous l'indiquerions ici avec le mécanisme de transfert applicable.",
      },
      { kind: "titre", text: "Vos droits" },
      {
        kind: "liste",
        items: [
          "Accès : obtenir une copie des données que nous détenons sur vous.",
          "Rectification : corriger une donnée inexacte ou incomplète.",
          "Effacement : demander la suppression, sous réserve de nos obligations comptables.",
          "Opposition : refuser un traitement fondé sur notre intérêt légitime.",
          "Limitation : geler un traitement le temps d'une contestation.",
          "Portabilité : récupérer vos données dans un format lisible par machine.",
          "Retrait du consentement : à tout moment, sans effet sur ce qui a été fait avant.",
        ],
      },
      {
        kind: "paragraphe",
        text: "Ces droits s'exercent depuis la page Nous contacter. Nous répondons sous un mois. En cas de désaccord persistant, vous pouvez saisir la CNIL, 3 place de Fontenoy, 75007 Paris, ou déposer une plainte sur cnil.fr.",
      },
      { kind: "titre", text: "Sécurité" },
      {
        kind: "paragraphe",
        text: "Le site est servi intégralement en HTTPS. Les coordonnées bancaires ne transitent jamais par nos serveurs : elles sont transmises directement au prestataire de paiement. L'accès aux données clients est limité aux personnes qui en ont besoin pour leur travail.",
      },
      {
        kind: "note",
        text: "La base de données n'est pas encore en service : aucun compte client n'existe à ce jour. Cette page décrit les traitements prévus à l'ouverture.",
      },
      {
        kind: "appel",
        label: "Exercer un droit",
        href: "/contact",
      },
    ],
  },

  {
    slug: "legal/cookies",
    group: "legal",
    title: "Gestion des cookies",
    lead: "Ce que nous déposons sur votre appareil, à quoi cela sert, et comment le refuser.",
    updatedAt: REVISION,
    blocks: [
      {
        kind: "paragraphe",
        text: "Un cookie est un petit fichier déposé par un site sur votre appareil. Certains sont indispensables au fonctionnement du site et n'ont pas à être acceptés ; les autres ne sont déposés qu'avec votre accord.",
      },
      { kind: "titre", text: "Les cookies du site" },
      {
        kind: "tableau",
        head: ["Cookie", "Rôle", "Catégorie", "Durée"],
        rows: [
          [
            "Session",
            "Maintenir le panier et l'étape de commande en cours",
            "Nécessaire",
            "Le temps de la visite",
          ],
          [
            "Préférences",
            "Retenir le rayon et les filtres choisis",
            "Nécessaire",
            "6 mois",
          ],
          [
            "Consentement",
            "Mémoriser vos choix sur cette page",
            "Nécessaire",
            "6 mois",
          ],
          [
            "Mesure d'audience",
            "Compter les visites et les pages vues, de façon agrégée",
            "Soumis au consentement",
            "13 mois",
          ],
        ],
      },
      {
        kind: "note",
        text: "Aucun cookie publicitaire ni de traçage inter-sites n'est déposé. Aucune régie tierce n'est présente sur ce site.",
      },
      { kind: "titre", text: "Refuser, accepter, changer d'avis" },
      {
        kind: "paragraphe",
        text: "Le refus est aussi simple que l'acceptation et n'empêche ni la navigation ni l'achat. Vos choix se modifient à tout moment depuis le bandeau de consentement, qui se rouvre par cette page.",
      },
      {
        kind: "paragraphe",
        text: "Vous pouvez également agir depuis votre navigateur : chacun permet de bloquer les cookies, de les supprimer, ou d'être averti avant chaque dépôt. Un blocage total des cookies nécessaires empêchera en revanche le panier de fonctionner.",
      },
      {
        kind: "note",
        text: "Le bandeau de consentement n'est pas encore déployé et aucune mesure d'audience n'est active : à ce jour, seuls les cookies nécessaires sont utilisés.",
      },
    ],
  },

  {
    slug: "legal/accessibilite",
    group: "legal",
    title: "Accessibilité",
    lead: "Où nous en sommes, ce qui fonctionne, ce qui ne fonctionne pas encore.",
    updatedAt: REVISION,
    toc: true,
    blocks: [
      {
        kind: "paragraphe",
        text: "Un site marchand doit pouvoir s'utiliser au clavier, à la loupe et au lecteur d'écran. Nous n'y sommes pas encore complètement : cette page dit où nous en sommes, sans arrondir.",
      },
      { kind: "titre", text: "État de conformité" },
      {
        kind: "paragraphe",
        text: "Le site n'a fait l'objet d'aucun audit RGAA à ce jour. Il est donc déclaré non conforme, faute d'évaluation — et non parce qu'une évaluation aurait conclu en ce sens. Cette déclaration sera remplacée par un taux réel dès le premier audit.",
      },
      { kind: "titre", text: "Ce qui est en place" },
      {
        kind: "liste",
        items: [
          "Navigation complète au clavier, avec un anneau de mise au point visible sur chaque élément actionnable.",
          "Structure de titres hiérarchisée et repères de page (en-tête, navigation, contenu, pied de page) déclarés.",
          "Toute icône seule porte un intitulé lu par les lecteurs d'écran ; tout champ de formulaire porte une étiquette.",
          "Les questions fréquentes utilisent les éléments natifs du navigateur, qui gèrent déjà le clavier et l'annonce d'état.",
          "Les animations respectent le réglage système « réduire les animations ».",
          "Aucun texte n'est posé en blanc sur fond clair : le contraste des textes courants atteint le rapport exigé.",
        ],
      },
      { kind: "titre", text: "Ce qui ne va pas encore" },
      {
        kind: "liste",
        items: [
          "Les tableaux de tailles débordent horizontalement sur petit écran : ils se lisent, mais demandent un défilement latéral.",
          "Les photographies de catalogue n'ont pas toutes une description alternative rédigée.",
          "Aucun test n'a été mené avec de vrais utilisateurs de lecteur d'écran.",
          "Le parcours de paiement n'est pas encore branché, donc pas encore évaluable.",
        ],
      },
      { kind: "titre", text: "Signaler un obstacle" },
      {
        kind: "paragraphe",
        text: "Si une page vous bloque, écrivez-nous en décrivant la page, votre équipement et ce que vous cherchiez à faire. Nous traitons ces signalements en priorité, et nous vous proposons une solution de remplacement pour finaliser votre achat en attendant le correctif.",
      },
      {
        kind: "paragraphe",
        text: "Si votre signalement reste sans réponse satisfaisante, vous pouvez saisir le Défenseur des droits, qui dispose d'un délégué dans chaque département.",
      },
      {
        kind: "appel",
        label: "Signaler un obstacle",
        href: "/contact",
      },
    ],
  },
];
