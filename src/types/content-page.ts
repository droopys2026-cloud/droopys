/**
 * Pages de contenu : aide, à propos, services, informations légales.
 *
 * Ces pages ne sont pas écrites en JSX dans les routes mais décrites en
 * données, pour une seule raison : l'admin doit pouvoir les modifier. Une
 * page rédigée en JSX se modifie avec un éditeur de code et un déploiement ;
 * une page décrite en blocs se modifie avec un formulaire. Le jour où la base
 * est branchée, `CONTENT_PAGES` devient une table et rien d'autre ne bouge.
 *
 * Le vocabulaire de blocs est volontairement court. Chaque nouveau `kind`
 * demande un rendu côté site ET un champ côté admin : on n'en ajoute un que
 * lorsqu'aucun des existants ne dit la chose.
 */

/** Une paire question / réponse d'un bloc `faq`. */
export type ContentQuestion = { question: string; answer: string };

/** Une carte ou une étape : un intitulé et son explication. */
export type ContentItem = { title: string; text: string };

export type ContentBlock =
  /** Intertitre. Découpe la page, sert d'ancre à la table des matières. */
  | { kind: "titre"; text: string }
  /** Paragraphe courant. */
  | { kind: "paragraphe"; text: string }
  /** Liste à puces. */
  | { kind: "liste"; items: string[] }
  /** Tableau simple : une ligne d'en-tête, puis les lignes de données. */
  | { kind: "tableau"; caption?: string; head: string[]; rows: string[][] }
  /** Questions fréquentes, repliées par défaut. */
  | { kind: "faq"; items: ContentQuestion[] }
  /** Grille de cartes — pour des points qui se lisent en parallèle. */
  | { kind: "cartes"; items: ContentItem[] }
  /** Marche à suivre — pour des points qui se lisent dans l'ordre. */
  | { kind: "etapes"; items: ContentItem[] }
  /** Encadré : une précision qui doit se voir sans casser la lecture. */
  | { kind: "note"; text: string }
  /** Bouton d'appel à l'action en fin de section. */
  | { kind: "appel"; label: string; href: string };

/** Regroupement utilisé par le pied de page et par la liste de l'admin. */
export type ContentGroup = "aide" | "a-propos" | "services" | "legal";

export type ContentPage = {
  /** Chemin sans barre oblique initiale : « aide/livraison ». */
  slug: string;
  group: ContentGroup;
  /** Titre affiché dans l'en-tête et repris dans <title>. */
  title: string;
  /** Chapô : une à deux phrases, sert aussi de meta description. */
  lead: string;
  /** Photo posée en fond de l'en-tête. Sans elle, en-tête blanc habituel. */
  image?: string;
  /** Recadrage propre à cette photo. */
  imageClassName?: string;
  /**
   * Date de dernière mise à jour, au format ISO. Obligatoire en pratique sur
   * les pages légales : une CGV sans date n'est pas opposable.
   */
  updatedAt?: string;
  /** Vrai pour afficher un sommaire des intertitres (pages longues). */
  toc?: boolean;
  /**
   * Faux pour retirer la page des colonnes du pied de page. Elle reste
   * publiée, atteignable par son lien et modifiable dans l'admin : c'est un
   * choix d'affichage, pas une dépublication. Absent vaut vrai.
   */
  footer?: boolean;
  blocks: ContentBlock[];
};
