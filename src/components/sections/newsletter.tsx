import { NewsletterForm } from "@/components/sections/newsletter-form";
import { getShopSettings } from "@/lib/queries/settings";

/**
 * Bandeau d'inscription à la newsletter — la seule bande sombre du corps de
 * page, donc le seul endroit où l'encre inversée est lisible.
 *
 * Le contenu vient des réglages, modifiable depuis Admin › Réglages. Sans
 * prestataire d'emailing déclaré, le formulaire fonctionne quand même :
 * l'adresse est enregistrée en base. C'est le seul comportement honnête —
 * refuser une inscription parce qu'on n'a pas encore choisi son outil, c'est
 * perdre des adresses qu'on ne retrouvera pas.
 */
export async function Newsletter() {
  const { newsletter } = await getShopSettings();

  return (
    <section className="section-newsletter">
      <div className="container-page flex flex-col items-center gap-9 py-14 text-center">
        <h2 className="heading-h2 py-0 text-[var(--color-ink-inverse)]">
          {newsletter.title}
        </h2>
        <p className="text-paragraph max-w-lg">{newsletter.text}</p>

        <NewsletterForm
          placeholder={newsletter.placeholder}
          buttonLabel={newsletter.buttonLabel}
          provider={newsletter.provider}
        />
      </div>
    </section>
  );
}
