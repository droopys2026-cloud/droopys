"use server";

import { and, eq, sql } from "drizzle-orm";
import { Resend } from "resend";
import { z } from "zod";
import { db } from "@/db";
import { orders, withdrawals } from "@/db/schema";
import { emailField, issueMessages } from "@/lib/account/schema";
import { renderWithdrawalAlert, renderWithdrawalReceipt, type WithdrawalNotice } from "@/lib/email/withdrawal";
import { publicEnv, serverEnv } from "@/lib/env";
import { getShopSettings } from "@/lib/queries/settings";
import { isLate, lineLabel, normalizeReference } from "@/lib/withdrawal/rules";

/**
 * Fonction de rétractation (directive (UE) 2023/2673).
 *
 * Deux temps, comme l'exige le texte : la cliente désigne sa commande, puis
 * confirme par un second bouton « Confirmer la rétractation ». La commande ne
 * se retrouve qu'avec son numéro **et** l'e-mail de l'achat : un numéro seul
 * permettrait de viser la commande de quelqu'un d'autre en essayant des
 * numéros à la suite.
 *
 * Les messages d'échec ne disent jamais lequel des deux ne correspond pas.
 */

export type WithdrawalLine = { id: string; label: string };

export type WithdrawalState =
  | { status: "idle" }
  | { status: "error"; errors: string[]; values: { name: string; email: string; reference: string } }
  | {
      status: "found";
      name: string;
      email: string;
      reference: string;
      lines: WithdrawalLine[];
      alreadyRequested: boolean;
      error?: string;
    }
  | { status: "done"; reference: string; receivedAt: string; items: string[] };

const lookupSchema = z.object({
  name: z.string().trim().min(1, "Indiquez votre nom.").max(120),
  email: emailField,
  reference: z.string().transform(normalizeReference).pipe(z.string().min(4, "Indiquez le numéro de commande.").max(40)),
});

const NOT_FOUND =
  "Aucune commande ne correspond à ce numéro et à cette adresse e-mail. Vérifiez l'e-mail de confirmation de votre commande.";

async function findOrder(reference: string, email: string) {
  return db.query.orders.findFirst({
    where: and(eq(orders.reference, reference), sql`lower(${orders.customerEmail}) = ${email}`),
    with: { lines: true, withdrawals: { columns: { id: true } } },
  });
}

/** Étape 1 : retrouver la commande et en proposer les articles. */
export async function findOrderForWithdrawal(
  _state: WithdrawalState,
  formData: FormData,
): Promise<WithdrawalState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    reference: String(formData.get("reference") ?? ""),
  };
  const parsed = lookupSchema.safeParse(values);
  if (!parsed.success) return { status: "error", errors: issueMessages(parsed.error), values };

  const order = await findOrder(parsed.data.reference, parsed.data.email);
  if (!order) return { status: "error", errors: [NOT_FOUND], values };

  return {
    status: "found",
    name: parsed.data.name,
    email: parsed.data.email,
    reference: order.reference,
    lines: order.lines.map((line) => ({ id: line.id, label: lineLabel(line) })),
    alreadyRequested: order.withdrawals.length > 0,
  };
}

/** Étape 2 : « Confirmer la rétractation ». Tout est revérifié. */
export async function confirmWithdrawal(
  _state: WithdrawalState,
  formData: FormData,
): Promise<WithdrawalState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    reference: String(formData.get("reference") ?? ""),
  };
  const parsed = lookupSchema.safeParse(values);
  if (!parsed.success) return { status: "error", errors: issueMessages(parsed.error), values };

  const order = await findOrder(parsed.data.reference, parsed.data.email);
  if (!order) return { status: "error", errors: [NOT_FOUND], values };

  const chosen = new Set(formData.getAll("lines").map(String));
  const lines = order.lines.filter((line) => chosen.has(line.id));
  if (lines.length === 0) {
    // On reste à l'étape 2 : la cliente coche au moins un article.
    return {
      status: "found",
      name: parsed.data.name,
      email: parsed.data.email,
      reference: order.reference,
      lines: order.lines.map((line) => ({ id: line.id, label: lineLabel(line) })),
      alreadyRequested: order.withdrawals.length > 0,
      error: "Choisissez au moins un article.",
    };
  }

  const items = lines.map((line) => ({ lineId: line.id, label: lineLabel(line), quantity: line.quantity }));
  const [saved] = await db
    .insert(withdrawals)
    .values({
      orderId: order.id,
      orderReference: order.reference,
      customerName: parsed.data.name,
      customerEmail: parsed.data.email,
      items,
    })
    .returning({ createdAt: withdrawals.createdAt });

  const receivedAt = saved.createdAt.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });
  const notice: WithdrawalNotice = {
    reference: order.reference,
    customerName: parsed.data.name,
    customerEmail: parsed.data.email,
    items: items.map((item) => item.label),
    receivedAt,
    late: isLate(order.placedAt, saved.createdAt),
    siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
  };
  await sendWithdrawalEmails(notice);

  return { status: "done", reference: order.reference, receivedAt, items: notice.items };
}

/**
 * Accusé de réception à la cliente, alerte à la boutique. La demande est déjà
 * enregistrée : un e-mail raté est journalisé, il n'annule rien.
 */
async function sendWithdrawalEmails(notice: WithdrawalNotice) {
  if (!serverEnv.RESEND_API_KEY || !serverEnv.EMAIL_FROM) {
    console.warn(`Rétractation ${notice.reference} : e-mails NON envoyés (RESEND_API_KEY ou EMAIL_FROM absente).`);
    return;
  }
  const resend = new Resend(serverEnv.RESEND_API_KEY);
  const receipt = renderWithdrawalReceipt(notice);
  const { boutique } = await getShopSettings();

  const sends = [
    resend.emails.send({
      from: serverEnv.EMAIL_FROM,
      to: [notice.customerEmail],
      subject: receipt.subject,
      html: receipt.html,
      text: receipt.text,
    }),
  ];
  if (boutique.email) {
    const alert = renderWithdrawalAlert(notice);
    sends.push(
      resend.emails.send({
        from: serverEnv.EMAIL_FROM,
        to: [boutique.email],
        replyTo: notice.customerEmail,
        subject: alert.subject,
        html: alert.html,
        text: alert.text,
      }),
    );
  } else {
    console.warn(`Rétractation ${notice.reference} : pas d'alerte boutique (e-mail de la boutique vide dans Réglages).`);
  }

  for (const result of await Promise.allSettled(sends)) {
    if (result.status === "rejected") {
      console.error(`Rétractation ${notice.reference} : e-mail non envoyé :`, result.reason);
    } else if (result.value.error) {
      console.error(`Rétractation ${notice.reference} : e-mail refusé : ${result.value.error.message}`);
    }
  }
}
