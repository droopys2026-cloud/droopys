/**
 * Message du formulaire de contact, transmis à la boutique. Module pur, comme
 * les autres e-mails : il fabrique l'objet, le HTML et le texte, sans envoyer.
 *
 * Tout ce qui est dedans a été tapé par un inconnu : chaque valeur passe par
 * `escapeHtml` avant d'entrer dans le HTML.
 */

export type ContactMessage = {
  name: string;
  email: string;
  /** Vide si non renseigné. */
  phone: string;
  subject: string;
  /** Vide si non renseigné. */
  orderReference: string;
  message: string;
  /** Date et heure de réception, déjà formatées à l'heure de Paris. */
  receivedAt: string;
};

const INK = "rgb(0, 0, 0)";
const INK_SECONDARY = "rgb(105, 105, 105)";
const SURFACE = "rgb(255, 255, 255)";
const SURFACE_ALT = "rgb(248, 248, 248)";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderContactMessage(contact: ContactMessage) {
  // Le sujet et le nom dans l'objet : la boîte de la boutique se trie d'un
  // coup d'œil, sans ouvrir chaque message.
  const subject = `[Contact] ${contact.subject} — ${contact.name}`;

  const details: [string, string][] = [
    ["Nom", contact.name],
    ["E-mail", contact.email],
    ["Téléphone", contact.phone],
    ["Sujet", contact.subject],
    ["Commande", contact.orderReference],
  ];
  const filled = details.filter(([, value]) => value !== "");

  const text = [
    `Message reçu le ${contact.receivedAt} via le formulaire de contact.`,
    "",
    ...filled.map(([label, value]) => `${label} : ${value}`),
    "",
    contact.message,
    "",
    "Répondez directement à cet e-mail : la réponse part chez le client.",
  ].join("\n");

  const rows = filled
    .map(
      ([label, value]) =>
        `<tr><td style="padding:2px 16px 2px 0;color:${INK_SECONDARY};white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:2px 0;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:${SURFACE_ALT};font-family:Poppins,Helvetica,Arial,sans-serif;color:${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE_ALT};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${SURFACE};padding:32px;">
          <tr><td style="font-size:24px;font-weight:700;letter-spacing:2px;">DROOPY'S</td></tr>
          <tr><td style="padding-top:24px;font-size:20px;font-weight:600;">${escapeHtml(contact.subject)}</td></tr>
          <tr><td style="padding-top:4px;font-size:13px;color:${INK_SECONDARY};">Reçu le ${escapeHtml(contact.receivedAt)} via le formulaire de contact</td></tr>
          <tr><td style="padding-top:20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">${rows}</table>
          </td></tr>
          <tr><td style="padding-top:20px;font-size:14px;line-height:1.7;white-space:pre-line;">${escapeHtml(contact.message)}</td></tr>
          <tr><td style="padding-top:24px;font-size:13px;color:${INK_SECONDARY};">Répondez directement à cet e-mail : la réponse part chez le client.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}
