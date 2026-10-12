/**
 * E-mail « votre remboursement est en route », envoyé quand la boutique
 * rembourse depuis l'admin. Module pur, comme les autres e-mails.
 */

export type RefundNotice = {
  reference: string;
  customerName: string;
  /** Montant de ce remboursement, en centimes. */
  amountCents: number;
  /** Vrai si la commande est désormais entièrement remboursée. */
  full: boolean;
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

function euros(cents: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function renderRefundNotice(notice: RefundNotice) {
  const firstName = notice.customerName.split(" ")[0] ?? notice.customerName;
  const amount = euros(notice.amountCents);
  const subject = `Remboursement de votre commande ${notice.reference}`;
  const what = notice.full
    ? `Votre commande ${notice.reference} vous est entièrement remboursée : ${amount}.`
    : `Nous vous remboursons ${amount} sur votre commande ${notice.reference}.`;
  // Délai annoncé par Stripe pour un remboursement par carte : 5 à 10 jours
  // ouvrés selon la banque. Klarna ajuste de son côté les échéances.
  const when =
    "Le montant revient sur le moyen de paiement utilisé, sous 5 à 10 jours ouvrés selon votre banque. Si vous avez payé avec Klarna, vos échéances sont ajustées automatiquement.";

  const text = [`Bonjour ${firstName},`, "", what, when, "", "L'équipe Droopy's"].join("\n");

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:${SURFACE_ALT};font-family:Poppins,Helvetica,Arial,sans-serif;color:${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE_ALT};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${SURFACE};padding:32px;">
          <tr><td style="font-size:24px;font-weight:700;letter-spacing:2px;">DROOPY'S</td></tr>
          <tr><td style="padding-top:24px;font-size:20px;font-weight:600;">Votre remboursement est en route, ${escapeHtml(firstName)}</td></tr>
          <tr><td style="padding-top:8px;font-size:14px;color:${INK_SECONDARY};line-height:1.6;">${escapeHtml(what)}<br>${escapeHtml(when)}</td></tr>
          <tr><td style="padding-top:28px;font-size:12px;color:${INK_SECONDARY};">Une question ? Répondez simplement à cet e-mail.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}
