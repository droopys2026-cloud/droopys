import { LEGAL, MISSING } from "@/lib/legal";
import { formatDate } from "@/lib/format";

/**
 * Tableau d'identité des mentions légales.
 *
 * C'est le seul endroit du site où une valeur manquante s'affiche telle
 * quelle. Le reste du code masquerait le champ ; ici, le masquer reviendrait
 * à omettre une mention obligatoire sans que personne ne s'en aperçoive.
 */
export function LegalIdentity() {
  return (
    <>
      <dl className="content-definitions">
        <Row label="Dénomination sociale" value={LEGAL.companyName} />
        <Row label="Enseigne" value={LEGAL.tradeName} />
        <Row label="Forme juridique" value={LEGAL.legalForm} />
        <Row label="Capital social" value={LEGAL.capital} />
        <Row
          label="Siège social"
          value={[
            LEGAL.address.line1,
            LEGAL.address.line2,
            `${LEGAL.address.postalCode} ${LEGAL.address.city}`,
            LEGAL.address.country,
          ].join(" — ")}
        />
        <Row label="SIREN" value={LEGAL.siren} />
        <Row label="SIRET (siège)" value={LEGAL.siret} />
        <Row label="RCS" value={LEGAL.rcs} />
        <Row label="TVA intracommunautaire" value={LEGAL.vat} />
        <Row
          label="Activité principale"
          value={`${LEGAL.apeCode} — ${LEGAL.apeLabel}`}
        />
        <Row label="Immatriculation" value={formatDate(LEGAL.createdAt)} />
        <Row label="Téléphone" value={LEGAL.phone} />
        <Row label="Adresse e-mail" value={LEGAL.email} />
        <Row
          label="Directeur de la publication"
          value={LEGAL.publicationDirector}
        />
      </dl>

      <h2 className="content-h2" id="hebergeur">
        Hébergeur
      </h2>
      {LEGAL.host ? (
        <dl className="content-definitions">
          <Row label="Raison sociale" value={LEGAL.host.name} />
          <Row label="Adresse" value={LEGAL.host.address} />
          <Row label="Téléphone" value={LEGAL.host.phone} />
        </dl>
      ) : (
        <p className="content-p">
          Raison sociale, adresse et téléphone de l&apos;hébergeur{" "}
          <span className="content-missing">{MISSING}</span>. Ces trois
          mentions sont obligatoires et seront renseignées dès le choix de
          l&apos;hébergement de production.
        </p>
      )}

      <h2 className="content-h2" id="propriete-intellectuelle">
        Propriété intellectuelle
      </h2>
      <p className="content-p">
        L&apos;ensemble du site — structure, textes, photographies, mise en
        page — est protégé par le droit d&apos;auteur. Toute reproduction ou
        représentation, totale ou partielle, sans autorisation écrite
        préalable, est interdite. Les marques et logos des maisons distribuées
        appartiennent à leurs titulaires respectifs et sont reproduits avec
        leur accord, dans le seul cadre de la présentation des articles.
      </p>

      <h2 className="content-h2" id="signalement">
        Signaler un contenu
      </h2>
      <p className="content-p">
        Tout contenu illicite peut nous être signalé depuis la page Nous
        contacter. Le signalement doit décrire précisément le contenu visé et
        sa localisation sur le site.
      </p>
    </>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>
        {value ?? <span className="content-missing">{MISSING}</span>}
      </dd>
    </>
  );
}
