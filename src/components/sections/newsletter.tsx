import { NEWSLETTER } from "@/lib/newsletter";

/**
 * Bandeau d'inscription à la newsletter — la seule bande sombre du corps de
 * page, donc le seul endroit où l'encre inversée est lisible.
 *
 * Le contenu vient de `@/lib/newsletter`, modifiable depuis Admin › Réglages.
 * Tant qu'aucun prestataire d'emailing n'y est déclaré, le bouton reste
 * inactif et le dit : un formulaire qui semble partir sans rien envoyer laisse
 * le visiteur attendre une confirmation qui ne viendra jamais.
 */
export function Newsletter() {
  const ready = NEWSLETTER.provider !== null;

  return (
    <section className="section-newsletter">
      <div className="container-page flex flex-col items-center gap-9 py-14 text-center">
        <h2 className="heading-h2 py-0 text-[var(--color-ink-inverse)]">
          {NEWSLETTER.title}
        </h2>
        <p className="text-paragraph max-w-lg">{NEWSLETTER.text}</p>

        <form className="flex w-full max-w-md flex-col items-center gap-6 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Adresse e-mail
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={NEWSLETTER.placeholder}
            className="input--newsletter flex-1"
          />
          <button
            type="submit"
            className="button--cta-dark border px-9 py-4"
            disabled={!ready}
          >
            {NEWSLETTER.buttonLabel}
          </button>
        </form>

        {!ready && (
          <p className="text-caption-muted m-0 text-[var(--color-ink-muted)]">
            Les inscriptions ouvriront avec le choix du prestataire d&apos;envoi.
          </p>
        )}
      </div>
    </section>
  );
}
