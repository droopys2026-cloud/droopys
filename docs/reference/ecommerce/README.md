# Logique e-commerce — modules de référence

Documentation des « commerce modules » de Medusa (moteur e-commerce open source,
licence MIT), téléchargée le 2026-10-07. On ne s'en sert pas comme dépendance :
c'est un **modèle de domaine** éprouvé, pour savoir quelles entités et quelles
règles un site marchand doit gérer avant de les inventer.

À lire pour les concepts, pas pour l'API — les exemples de code sont propres à
Medusa.

| Fichier | À consulter pour |
|---|---|
| `customer.md` | client invité vs client inscrit, groupes, adresses |
| `auth.md` | identités, fournisseurs (e-mail, Google), réinitialisation de mot de passe |
| `cart.md` | panier, lignes, totaux, promotions et taxes appliquées au panier |
| `order.md` | commande, versions, modifications, retours, échanges, avoirs |
| `payment.md` | collecte, sessions, autorisation, capture, remboursement |
| `fulfillment.md` | expédition, options de livraison, zones |
| `inventory.md` | stock, réservations, niveaux par emplacement |
| `promotion.md` | codes promo, règles, campagnes |
| `tax.md` | régions fiscales, taux, lignes de taxe |
| `product.md` | produits, variantes, options |
