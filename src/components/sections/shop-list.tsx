import { SHOPS, mapUrl } from "@/lib/shops";

/**
 * Liste des boutiques. Un champ non communiqué n'affiche pas une ligne vide :
 * il dit qu'il n'est pas communiqué, sinon on croit à un défaut d'affichage.
 */
export function ShopList() {
  return (
    <div className="content-cards">
      {SHOPS.map((shop) => (
        <section key={shop.id} className="content-shop">
          <h2 className="content-shop__name">{shop.name}</h2>

          <address className="content-shop__address">
            {shop.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>

          <div>
            <h3 className="content-card__title">Horaires</h3>
            {shop.hours.length > 0 ? (
              <ul className="content-card__text">
                {shop.hours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="content-card__text">
                Non communiqués. Le centre commercial ouvre en semaine ; nous
                afficherons ici les horaires propres à la boutique dès
                qu&apos;ils seront confirmés.
              </p>
            )}
          </div>

          <div>
            <h3 className="content-card__title">Services sur place</h3>
            <ul className="content-list">
              {shop.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="content-card__title">Téléphone</h3>
            <p className="content-card__text">
              {shop.phone ?? (
                <span className="content-missing">à compléter</span>
              )}
            </p>
          </div>

          <a
            href={mapUrl(shop)}
            target="_blank"
            rel="noreferrer noopener"
            className="link-cta-block mt-0 self-start"
          >
            Ouvrir dans un plan
          </a>
        </section>
      ))}
    </div>
  );
}
