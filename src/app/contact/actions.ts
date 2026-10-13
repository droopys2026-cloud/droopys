"use server";

import { Resend } from "resend";
import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { emailField, issueMessages } from "@/lib/account/schema";
import { CONTACT_SUBJECTS } from "@/lib/contact";
import { renderContactMessage } from "@/lib/email/contact-message";
import { serverEnv } from "@/lib/env";
import { getShopSettings } from "@/lib/queries/settings";

/**
 * Formulaire de contact. Le message est **enregistré en base** — il se traite
 * dans Admin → Messages clients — puis signalé par e-mail à la boutique si
 * son adresse est remplie (Admin → Réglages → Boutique), avec l'adresse du
 * visiteur en `replyTo` : la boutique répond depuis sa messagerie.
 *
 * L'enregistrement fait foi : un e-mail raté est journalisé, il ne fait pas
 * échouer l'envoi du formulaire.
 */

export type ContactValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  orderReference: string;
  message: string;
};

export type ContactState =
  | { status: "idle" }
  | { status: "error"; errors: string[]; values: ContactValues }
  | { status: "sent" };

const contactSchema = z.object({
  name: z.string().trim().min(1, "Indiquez votre nom.").max(120),
  email: emailField,
  phone: z
    .string()
    .trim()
    .regex(/^(\+?[0-9 ().-]{6,20})?$/, "Numéro de téléphone invalide."),
  subject: z.enum(CONTACT_SUBJECTS, { message: "Choisissez un sujet." }),
  orderReference: z.string().trim().max(40),
  message: z
    .string()
    .trim()
    .min(10, "Votre message est un peu court.")
    .max(5000, "Votre message est trop long (5 000 caractères au plus)."),
});

const UNAVAILABLE =
  "Le message n'a pas pu partir. Réessayez dans un instant, ou écrivez-nous directement par e-mail.";

export async function sendContactMessage(
  _state: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Piège à robots : un champ caché aux humains. Rempli, c'est un robot — on
  // lui répond « envoyé » pour qu'il ne cherche pas à contourner le piège.
  if (String(formData.get("site") ?? "") !== "") return { status: "sent" };

  const values: ContactValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    orderReference: String(formData.get("orderReference") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { status: "error", errors: issueMessages(parsed.error), values };

  const saved = {
    ...parsed.data,
    phone: parsed.data.phone || null,
    orderReference: parsed.data.orderReference || null,
  };
  try {
    await db.insert(contactMessages).values(saved);
  } catch (error) {
    console.error("Message de contact non enregistré :", error);
    return { status: "error", errors: [UNAVAILABLE], values };
  }

  await notifyShop(parsed.data);
  return { status: "sent" };
}

/** Signale le message par e-mail à la boutique. Ne lève jamais. */
async function notifyShop(contact: z.infer<typeof contactSchema>) {
  const { boutique } = await getShopSettings();
  if (!serverEnv.RESEND_API_KEY || !serverEnv.EMAIL_FROM || !boutique.email) {
    console.warn(
      "Message de contact enregistré, mais pas d'e-mail à la boutique : RESEND_API_KEY, EMAIL_FROM ou e-mail de la boutique (Réglages) absent.",
    );
    return;
  }

  const email = renderContactMessage({
    ...contact,
    receivedAt: new Date().toLocaleString("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Europe/Paris",
    }),
  });

  try {
    const { error } = await new Resend(serverEnv.RESEND_API_KEY).emails.send({
      from: serverEnv.EMAIL_FROM,
      to: [boutique.email],
      replyTo: contact.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    if (error) console.error(`Alerte de contact refusée par Resend : ${error.message}`);
  } catch (error) {
    console.error("Alerte de contact non envoyée :", error);
  }
}
