import {
  contactSchema,
  deliverySchema,
  type CheckoutDetails,
} from "@/lib/checkout/details";

/**
 * Le tunnel tel que le client le remplit : des chaînes, éventuellement vides.
 * Il ne devient un `CheckoutDetails` qu'une fois validé — le type validé n'a
 * pas de champ vide, le brouillon en a forcément pendant la saisie.
 */
export type CheckoutDraft = {
  contact: { email: string; firstName: string; lastName: string; phone: string };
  /** Vide tant que le client n'a pas choisi. */
  method: "domicile" | "relais" | "retrait" | "";
  /** Clé du service Sendcloud choisi (`mondial-relay-relais`…), vide sinon. */
  service: string;
  address: {
    line1: string;
    line2: string;
    postalCode: string;
    city: string;
    country: string;
  };
  /**
   * Point relais choisi sur la carte. Seul `id` part au serveur ; le libellé
   * ne sert qu'à l'affichage, l'adresse étant relue chez Sendcloud.
   */
  servicePoint: { id: number; label: string; carrier: string } | null;
};

export const EMPTY_DRAFT: CheckoutDraft = {
  contact: { email: "", firstName: "", lastName: "", phone: "" },
  method: "",
  service: "",
  address: { line1: "", line2: "", postalCode: "", city: "", country: "FR" },
  servicePoint: null,
};

/** Messages d'erreur par champ, clés `contact.email`, `address.city`… */
export type FieldErrors = Record<string, string>;

function toErrors(
  issues: { path: PropertyKey[]; message: string }[],
  prefix: string,
): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = [prefix, ...issue.path.map(String)].filter(Boolean).join(".");
    errors[key] ??= issue.message;
  }
  return errors;
}

export function validateContact(draft: CheckoutDraft): FieldErrors {
  const result = contactSchema.safeParse(draft.contact);
  return result.success ? {} : toErrors(result.error.issues, "contact");
}

/** La livraison du brouillon, sous la forme que valide `deliverySchema`. */
function deliveryInput(draft: CheckoutDraft): unknown {
  if (draft.method === "retrait") return { method: "retrait" };
  if (draft.method === "relais") {
    return { method: "relais", service: draft.service, servicePointId: draft.servicePoint?.id };
  }
  return { method: "domicile", service: draft.service, address: draft.address };
}

export function validateDelivery(draft: CheckoutDraft): FieldErrors {
  if (draft.method === "") return { method: "Choisissez un mode de livraison." };
  // Un point relais choisi pour un autre transporteur ne vaut plus : il faut
  // le choisir à nouveau sur la carte du transporteur retenu.
  if (draft.method === "relais" && draft.servicePoint && !draft.service.startsWith(carrierSlug(draft.servicePoint.carrier))) {
    return { servicePointId: "Choisissez un point relais de ce transporteur." };
  }
  const result = deliverySchema.safeParse(deliveryInput(draft));
  return result.success ? {} : toErrors(result.error.issues, "");
}

/** `mondial_relay` → `mondial-relay`, préfixe des clés de service. */
function carrierSlug(carrier: string): string {
  return carrier.replaceAll("_", "-");
}

/** Le brouillon validé, prêt pour la Server Action, ou `null`. */
export function toDetails(draft: CheckoutDraft): CheckoutDetails | null {
  const contact = contactSchema.safeParse(draft.contact);
  if (!contact.success || Object.keys(validateDelivery(draft)).length > 0) return null;
  const delivery = deliverySchema.safeParse(deliveryInput(draft));
  if (!delivery.success) return null;
  return { contact: contact.data, delivery: delivery.data };
}

/**
 * Relit un brouillon gardé en `sessionStorage`. Tout ce qui ne colle pas à la
 * forme attendue est remplacé par la valeur vide : une ancienne version du
 * site ne doit pas casser le tunnel.
 */
export function parseStoredDraft(raw: string | null): CheckoutDraft {
  if (!raw) return EMPTY_DRAFT;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return EMPTY_DRAFT;
  }
  const field = (source: unknown, key: string): unknown =>
    typeof source === "object" && source !== null ? Reflect.get(source, key) : undefined;
  const text = (source: unknown, key: string, fallback: string): string => {
    const found = field(source, key);
    return typeof found === "string" ? found : fallback;
  };

  const contact = field(value, "contact");
  const address = field(value, "address");
  const point = field(value, "servicePoint");
  const method = text(value, "method", "");
  const pointId = field(point, "id");

  return {
    contact: {
      email: text(contact, "email", ""),
      firstName: text(contact, "firstName", ""),
      lastName: text(contact, "lastName", ""),
      phone: text(contact, "phone", ""),
    },
    method: method === "domicile" || method === "relais" || method === "retrait" ? method : "",
    service: text(value, "service", ""),
    address: {
      line1: text(address, "line1", ""),
      line2: text(address, "line2", ""),
      postalCode: text(address, "postalCode", ""),
      city: text(address, "city", ""),
      country: text(address, "country", "FR"),
    },
    servicePoint:
      typeof pointId === "number"
        ? { id: pointId, label: text(point, "label", ""), carrier: text(point, "carrier", "") }
        : null,
  };
}
