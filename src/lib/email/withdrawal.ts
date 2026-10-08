/**
 * E-mails de la rétractation. Module pur.
 *
 * L'accusé de réception est une obligation (directive (UE) 2023/2673) : il
 * doit partir sans délai, sur un support durable, avec le contenu de la
 * demande et sa date et son heure. L'alerte prévient la boutique.
 */

export type WithdrawalNotice = {
  reference: string;
  customerName: string;
  customerEmail: string;
  items: string[];
  /** Date et heure de la demande, déjà formatées à l'heure de Paris. */
  receivedAt: string;
  late: boolean;
  siteUrl: string;
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

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:${SURFACE_ALT};font-family:Poppins,Helvetica,Arial,sans-serif;color:${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE_ALT};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${SURFACE};padding:32px;">
          <tr><td style="font-size:24px;font-weight:700;letter-spacing:2px;">DROOPY'S</td></tr>
          <tr><td style="padding-top:24px;font-size:20px;font-weight:600;">${title}</td></tr>
          ${body}
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

const itemList = (items: string[]) =>
  `<ul style="margin:8px 0 0;padding-left:18px;font-size:14px;line-height:1.7;">${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;

/** Accusé de réception, envoyé à l'acheteuse. */
export function renderWithdrawalReceipt(notice: WithdrawalNotice) {
  const subject = `Accusé de réception — rétractation de la commande ${notice.reference}`;
  const text = [
    `Bonjour ${notice.customerName},`,
    "",
    `Nous avons bien reçu, le ${notice.receivedAt}, votre demande de rétractation pour la commande ${notice.reference}.`,
    "",
    "Articles concernés :",
    ...notice.items.map((item) => `- ${item}`),
    "",
    "Renvoyez ces articles dans les 14 jours, non portés et avec leur étiquette. Nous vous remboursons, frais de livraison initiaux compris, au plus tard 14 jours après la réception de votre demande — le remboursement peut attendre le retour des articles.",
    `La marche à suivre pour le renvoi : ${notice.siteUrl}/aide/retours`,
    "",
    "Gardez cet e-mail : il fait foi de la date de votre demande.",
    "",
    "L'équipe Droopy's",
  ].join("\n");

  const html = layout(
    "Votre demande de rétractation est bien reçue",
    `<tr><td style="padding-top:12px;font-size:14px;line-height:1.7;">
        Bonjour ${escapeHtml(notice.customerName)},<br>
        nous avons bien reçu, le <strong>${escapeHtml(notice.receivedAt)}</strong>, votre demande de rétractation pour la commande <strong>${escapeHtml(notice.reference)}</strong>.
      </td></tr>
      <tr><td style="padding-top:16px;font-size:14px;font-weight:600;">Articles concernés</td></tr>
      <tr><td>${itemList(notice.items)}</td></tr>
      <tr><td style="padding-top:16px;font-size:14px;line-height:1.7;">
        Renvoyez ces articles dans les 14 jours, non portés et avec leur étiquette. Nous vous remboursons, frais de livraison initiaux compris, au plus tard 14 jours après la réception de votre demande — le remboursement peut attendre le retour des articles.
        <br><a href="${notice.siteUrl}/aide/retours" style="color:${INK};">La marche à suivre pour le renvoi</a>
      </td></tr>
      <tr><td style="padding-top:20px;font-size:12px;color:${INK_SECONDARY};">Gardez cet e-mail : il fait foi de la date de votre demande.</td></tr>`,
  );
  return { subject, html, text };
}

/** Alerte pour la boutique. */
export function renderWithdrawalAlert(notice: WithdrawalNotice) {
  const subject = `${notice.late ? "[Tardive] " : ""}Rétractation — commande ${notice.reference}`;
  const lines = [
    `Demande de rétractation reçue le ${notice.receivedAt}.`,
    `Commande : ${notice.reference}`,
    `Cliente : ${notice.customerName} <${notice.customerEmail}>`,
    notice.late ? "Attention : plus de 30 jours après la commande — à vérifier selon la date de réception." : "",
    "",
    "Articles :",
    ...notice.items.map((item) => `- ${item}`),
    "",
    `Voir dans l'admin : ${notice.siteUrl}/admin/commandes`,
  ].filter(Boolean);
  const text = lines.join("\n");
  const html = layout(
    `Rétractation — commande ${escapeHtml(notice.reference)}`,
    `<tr><td style="padding-top:12px;font-size:14px;line-height:1.7;white-space:pre-line;">${escapeHtml(text)}</td></tr>`,
  );
  return { subject, html, text };
}
