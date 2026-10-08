import "server-only";

import { Resend } from "resend";
import { renderShippingNotice, type ShippingNotice } from "@/lib/email/shipping-notification";
import { serverEnv } from "@/lib/env";

/**
 * Envoie l'avis d'expédition. Ne lève jamais : l'étiquette est créée et
 * payée, un e-mail raté ne doit pas faire croire à la boutique que l'envoi
 * a échoué. L'échec est journalisé avec la référence.
 */
export async function sendShippingNotification(
  to: string,
  notice: ShippingNotice,
): Promise<void> {
  if (!serverEnv.RESEND_API_KEY || !serverEnv.EMAIL_FROM) {
    console.warn(
      `Avis d'expédition de ${notice.reference} NON envoyé : RESEND_API_KEY ou EMAIL_FROM absente.`,
    );
    return;
  }
  const email = renderShippingNotice(notice);
  try {
    const { error } = await new Resend(serverEnv.RESEND_API_KEY).emails.send(
      { from: serverEnv.EMAIL_FROM, to: [to], subject: email.subject, html: email.html, text: email.text },
      { idempotencyKey: `expedition-commande/${notice.reference}` },
    );
    if (error) console.error(`Avis d'expédition de ${notice.reference} refusé par Resend : ${error.message}`);
  } catch (error) {
    console.error(`Avis d'expédition de ${notice.reference} non envoyé :`, error);
  }
}
