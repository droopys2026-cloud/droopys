/**
 * E-mail « votre commande est en route », envoyé à la création de
 * l'étiquette. Module pur, comme la confirmation de commande.
 */

export type ShippingNotice = {
  reference: string;
  customerName: string;
  deliveryMethod: "domicile" | "relais";
  serviceLabel: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
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

export function renderShippingNotice(notice: ShippingNotice) {
  const firstName = notice.customerName.split(" ")[0] ?? notice.customerName;
  const subject = `Votre commande ${notice.reference} est en route`;
  const where =
    notice.deliveryMethod === "relais"
      ? "Le transporteur vous préviendra dès qu'elle vous attend au point relais."
      : "Elle sera livrée à l'adresse indiquée lors de la commande.";
  // Le lien de suivi n'est proposé que s'il vient de Sendcloud en https.
  const trackingUrl = notice.trackingUrl?.startsWith("https://") ? notice.trackingUrl : null;

  const text = [
    `Bonjour ${firstName},`,
    "",
    `Votre commande ${notice.reference} vient d'être confiée à ${notice.serviceLabel}.`,
    where,
    "",
    notice.trackingNumber ? `Numéro de suivi : ${notice.trackingNumber}` : "",
    trackingUrl ? `Suivre le colis : ${trackingUrl}` : "",
    `Vos commandes : ${notice.siteUrl}/compte/commandes`,
    "",
    "L'équipe Droopy's",
  ]
    .filter((line, index, all) => line !== "" || all[index - 1] !== "")
    .join("\n");

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:${SURFACE_ALT};font-family:Poppins,Helvetica,Arial,sans-serif;color:${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE_ALT};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${SURFACE};padding:32px;">
          <tr><td style="font-size:24px;font-weight:700;letter-spacing:2px;">DROOPY'S</td></tr>
          <tr><td style="padding-top:24px;font-size:20px;font-weight:600;">Votre commande est en route, ${escapeHtml(firstName)}</td></tr>
          <tr><td style="padding-top:8px;font-size:14px;color:${INK_SECONDARY};line-height:1.6;">
            Commande <strong style="color:${INK};">${escapeHtml(notice.reference)}</strong>, confiée à ${escapeHtml(notice.serviceLabel)}.<br>${where}
          </td></tr>
          ${notice.trackingNumber ? `<tr><td style="padding-top:16px;font-size:14px;">Numéro de suivi : <strong>${escapeHtml(notice.trackingNumber)}</strong></td></tr>` : ""}
          ${trackingUrl ? `<tr><td style="padding-top:24px;"><a href="${escapeHtml(trackingUrl)}" style="display:inline-block;background:${INK};color:${SURFACE};text-decoration:none;font-size:12px;text-transform:uppercase;padding:12px 32px;">Suivre mon colis</a></td></tr>` : ""}
          <tr><td style="padding-top:28px;font-size:12px;color:${INK_SECONDARY};">Une question ? Répondez simplement à cet e-mail.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}
