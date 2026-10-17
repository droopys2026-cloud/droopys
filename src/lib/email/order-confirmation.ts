import { formatPrice } from "@/lib/format";
import { orderItemsCents, orderTotalCents } from "@/lib/orders/total";
import { inlineVariantLabel, variantLabel } from "@/lib/products/variants";

/**
 * E-mail de confirmation de commande, envoyé à la cliente par le webhook.
 *
 * Module pur : il fabrique l'objet, le HTML et le texte, sans rien envoyer —
 * c'est ce qui le rend testable. Les deux versions sont fournies : certaines
 * messageries n'affichent que le texte, et un e-mail sans version texte est
 * plus souvent classé en indésirable.
 */

export type ConfirmationOrder = {
  reference: string;
  customerName: string;
  deliveryMethod: "domicile" | "relais" | "retrait";
  /** « Mondial Relay en point relais »… vide pour un retrait. */
  serviceLabel: string;
  shippingAddress: string[];
  shippingCents: number;
  /** Code promo utilisé, et sa remise en centimes (0 sans code). */
  promoCode: string | null;
  discountCents: number;
  lines: {
    brand: string | null;
    productName: string;
    color: string | null;
    size: string;
    quantity: number;
    unitPriceCents: number;
    /** Adresse absolue de la photo, ou `null` : une messagerie ne connaît pas nos chemins relatifs. */
    imageUrl: string | null;
  }[];
  shop: { name: string; address: string[] };
  siteUrl: string;
};

/**
 * Couleurs de l'e-mail. Une messagerie ne lit pas nos variables CSS : les
 * valeurs sont recopiées de `theme.css` (`--color-ink`, `--color-ink-secondary`,
 * `--color-border-muted`, `--color-surface`, `--color-surface-alt`) — à
 * garder alignées.
 */
const INK = "rgb(0, 0, 0)";
const INK_SECONDARY = "rgb(105, 105, 105)";
const BORDER = "rgb(216, 216, 216)";
const SURFACE = "rgb(255, 255, 255)";
const SURFACE_ALT = "rgb(248, 248, 248)";

/** Tout texte venu de la base passe par ici avant d'entrer dans le HTML. */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderOrderConfirmation(order: ConfirmationOrder): {
  subject: string;
  html: string;
  text: string;
} {
  const itemsCents = orderItemsCents(order.lines);
  const totalCents = orderTotalCents(order);
  const discountLabel = `Code promo${order.promoCode ? ` ${order.promoCode}` : ""}`;
  const shippingLabel =
    order.shippingCents === 0 ? "Offerte" : formatPrice(order.shippingCents);
  const firstName = order.customerName.split(" ")[0] ?? order.customerName;

  const deliveryTitle =
    order.deliveryMethod === "retrait"
      ? "Retrait en boutique"
      : order.serviceLabel || "Livraison à domicile";
  const deliveryLines =
    order.deliveryMethod === "retrait"
      ? [order.shop.name, ...order.shop.address]
      : order.deliveryMethod === "relais"
        ? order.shippingAddress
        : [order.customerName, ...order.shippingAddress];
  const deliveryNote =
    order.deliveryMethod === "retrait"
      ? "Nous vous prévenons dès que votre commande est prête à être retirée."
      : "Vous recevrez un e-mail avec le lien de suivi de votre colis dès son expédition.";

  const subject = `Votre commande ${order.reference} est confirmée`;

  const text = [
    `Bonjour ${firstName},`,
    "",
    `Merci pour votre commande ${order.reference}. Nous la préparons.`,
    "",
    ...order.lines.map(
      (line) =>
        `- ${line.brand ? `${line.brand} — ` : ""}${line.productName}, ${inlineVariantLabel(line)}, ×${line.quantity} : ${formatPrice(line.unitPriceCents * line.quantity)}`,
    ),
    "",
    `Sous-total : ${formatPrice(itemsCents)}`,
    ...(order.discountCents > 0 ? [`${discountLabel} : −${formatPrice(order.discountCents)}`] : []),
    `Livraison : ${shippingLabel}`,
    `Total payé : ${formatPrice(totalCents)}`,
    "",
    `${deliveryTitle} :`,
    ...deliveryLines,
    deliveryNote,
    "",
    `Retours sous 30 jours : ${order.siteUrl}/aide/retours`,
    `Se rétracter du contrat ici : ${order.siteUrl}/retractation?commande=${encodeURIComponent(order.reference)}`,
    "",
    "L'équipe Droopy's",
  ].join("\n");

  const cell = `padding:12px 0;border-bottom:1px solid ${BORDER};font-size:14px;`;
  const rows = order.lines
    .map(
      (line) => `
        <tr>
          <td style="${cell}width:64px;vertical-align:top;">
            ${
              line.imageUrl?.startsWith("https://")
                ? `<img src="${escapeHtml(line.imageUrl)}" alt="" width="56" height="75" style="display:block;width:56px;height:75px;object-fit:cover;background:${SURFACE_ALT};">`
                : `<div style="width:56px;height:75px;background:${SURFACE_ALT};"></div>`
            }
          </td>
          <td style="${cell}padding-left:12px;">
            ${line.brand ? `<span style="color:${INK_SECONDARY};font-size:12px;text-transform:uppercase;">${escapeHtml(line.brand)}</span><br>` : ""}
            ${escapeHtml(line.productName)}<br>
            <span style="color:${INK_SECONDARY};">${escapeHtml(variantLabel(line))} · ×${line.quantity}</span>
          </td>
          <td style="${cell}text-align:right;white-space:nowrap;vertical-align:top;">
            ${formatPrice(line.unitPriceCents * line.quantity)}
          </td>
        </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:${SURFACE_ALT};font-family:Poppins,Helvetica,Arial,sans-serif;color:${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE_ALT};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${SURFACE};padding:32px;">
          <tr><td style="font-size:24px;font-weight:700;letter-spacing:2px;">DROOPY'S</td></tr>
          <tr><td style="padding-top:24px;font-size:20px;font-weight:600;">Merci pour votre commande, ${escapeHtml(firstName)}</td></tr>
          <tr><td style="padding-top:8px;font-size:14px;color:${INK_SECONDARY};">
            Commande <strong style="color:${INK};">${escapeHtml(order.reference)}</strong> — nous la préparons.
          </td></tr>
          <tr><td style="padding-top:24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${rows}
              <tr><td></td><td style="padding-top:12px;font-size:14px;padding-left:12px;">Sous-total</td><td style="padding-top:12px;font-size:14px;text-align:right;">${formatPrice(itemsCents)}</td></tr>
              ${order.discountCents > 0 ? `<tr><td></td><td style="padding-top:4px;font-size:14px;padding-left:12px;">${escapeHtml(discountLabel)}</td><td style="padding-top:4px;font-size:14px;text-align:right;">−${formatPrice(order.discountCents)}</td></tr>` : ""}
              <tr><td></td><td style="padding-top:4px;font-size:14px;padding-left:12px;">Livraison</td><td style="padding-top:4px;font-size:14px;text-align:right;">${shippingLabel}</td></tr>
              <tr><td></td><td style="padding-top:12px;font-size:18px;font-weight:600;padding-left:12px;">Total payé</td><td style="padding-top:12px;font-size:18px;font-weight:600;text-align:right;">${formatPrice(totalCents)}</td></tr>
            </table>
          </td></tr>
          <tr><td style="padding-top:24px;font-size:14px;line-height:1.6;">
            <strong>${deliveryTitle}</strong><br>
            ${deliveryLines.map(escapeHtml).join("<br>")}<br>
            <span style="color:${INK_SECONDARY};">${deliveryNote}</span>
          </td></tr>
          <tr><td style="padding-top:28px;font-size:12px;color:${INK_SECONDARY};line-height:1.6;">
            Retours sous 30 jours : <a href="${order.siteUrl}/aide/retours" style="color:${INK};">la marche à suivre</a>.<br>
            <a href="${order.siteUrl}/retractation?commande=${encodeURIComponent(order.reference)}" style="color:${INK};">Se rétracter du contrat ici</a><br>
            Une question ? Répondez simplement à cet e-mail.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}
