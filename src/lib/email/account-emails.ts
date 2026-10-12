/**
 * E-mails du compte client : confirmation d'inscription et nouveau mot de
 * passe. Module pur, comme les autres e-mails : il rend le contenu, l'envoi
 * est ailleurs (`@/lib/account/auth-emails`).
 *
 * Envoyés par la boutique via Resend, et non par Supabase : son envoi par
 * défaut plafonne à deux e-mails par heure et parle anglais.
 */

export type AccountEmail =
  | { kind: "confirm"; firstName: string; link: string }
  | { kind: "reset"; link: string };

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

export function renderAccountEmail(email: AccountEmail) {
  const content =
    email.kind === "confirm"
      ? {
          subject: "Confirmez votre adresse e-mail — Droopy's",
          title: `Bienvenue${email.firstName ? `, ${email.firstName}` : ""}`,
          body: "Un dernier clic pour activer votre compte Droopy's : vos commandes, vos adresses et vos favoris vous attendent.",
          button: "Confirmer mon adresse",
          footer: "Vous n'avez pas créé de compte ? Ignorez simplement cet e-mail.",
        }
      : {
          subject: "Choisissez un nouveau mot de passe — Droopy's",
          title: "Nouveau mot de passe",
          body: "Vous avez demandé à changer le mot de passe de votre compte Droopy's. Le lien ci-dessous est valable une heure.",
          button: "Choisir un nouveau mot de passe",
          footer: "Vous n'avez rien demandé ? Ignorez cet e-mail : votre mot de passe reste inchangé.",
        };

  const text = [content.title, "", content.body, "", `${content.button} : ${email.link}`, "", content.footer, "", "L'équipe Droopy's"].join("\n");

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:${SURFACE_ALT};font-family:Poppins,Helvetica,Arial,sans-serif;color:${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE_ALT};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${SURFACE};padding:32px;">
          <tr><td style="font-size:24px;font-weight:700;letter-spacing:2px;">DROOPY'S</td></tr>
          <tr><td style="padding-top:24px;font-size:20px;font-weight:600;">${escapeHtml(content.title)}</td></tr>
          <tr><td style="padding-top:8px;font-size:14px;color:${INK_SECONDARY};line-height:1.6;">${escapeHtml(content.body)}</td></tr>
          <tr><td style="padding-top:24px;"><a href="${escapeHtml(email.link)}" style="display:inline-block;background:${INK};color:${SURFACE};text-decoration:none;font-size:12px;text-transform:uppercase;padding:12px 32px;">${escapeHtml(content.button)}</a></td></tr>
          <tr><td style="padding-top:28px;font-size:12px;color:${INK_SECONDARY};line-height:1.6;">${escapeHtml(content.footer)}</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return { subject: content.subject, html, text };
}
