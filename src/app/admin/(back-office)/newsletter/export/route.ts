import { requireAdmin } from "@/lib/auth";
import { csvCell, listSubscribers } from "@/lib/queries/newsletter";

/**
 * Export CSV des inscrits **actifs**, à importer dans l'outil d'envoi
 * (Resend, Brevo…). Les désinscrits n'y figurent pas : les réimporter, ce
 * serait leur écrire malgré leur refus.
 */
export async function GET() {
  await requireAdmin();

  const rows = (await listSubscribers()).filter((row) => !row.unsubscribedAt);
  const lines = [
    "email,inscrit_le",
    ...rows.map((row) =>
      [csvCell(row.email), csvCell(row.subscribedAt.toISOString())].join(","),
    ),
  ];
  const date = new Date().toISOString().slice(0, 10);

  // BOM UTF-8 en tête : sans lui, Excel ouvre le fichier en Latin-1 et
  // abîme les adresses accentuées.
  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-droopys-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
