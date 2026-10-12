import "server-only";

import { Resend } from "resend";
import { renderRefundNotice, type RefundNotice } from "@/lib/email/refund-notice";
import { serverEnv } from "@/lib/env";

/**
 * Prévient la cliente de son remboursement. Ne lève jamais : l'argent est
 * déjà rendu chez Stripe, un e-mail raté ne doit pas faire croire à la
 * boutique que le remboursement a échoué. L'échec est journalisé.
 */
export async function sendRefundNotice(to: string, notice: RefundNotice): Promise<void> {
  if (!serverEnv.RESEND_API_KEY || !serverEnv.EMAIL_FROM) {
    console.warn(`Avis de remboursement de ${notice.reference} NON envoyé : RESEND_API_KEY ou EMAIL_FROM absente.`);
    return;
  }
  const email = renderRefundNotice(notice);
  try {
    const { error } = await new Resend(serverEnv.RESEND_API_KEY).emails.send({
      from: serverEnv.EMAIL_FROM,
      to: [to],
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    if (error) console.error(`Avis de remboursement de ${notice.reference} refusé par Resend : ${error.message}`);
  } catch (error) {
    console.error(`Avis de remboursement de ${notice.reference} non envoyé :`, error);
  }
}
