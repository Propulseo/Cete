// ── Contrats partagés admin ↔ client ────────────────────────────────
// Types transverses utilisés par plusieurs entités métier. Centralisés ici
// pour qu'une seule définition serve les espaces admin ET client, et pour
// préparer la bascule Supabase (visibility enum + assigned_client_ids uuid[]).

/**
 * Visibilité d'un contenu publié au portail client.
 * - `global`  : visible par tous les clients.
 * - `assigned`: visible uniquement par les clients listés dans `assignedClientIds`.
 */
export type Visibility = "global" | "assigned";

/** Mode d'accès à un fichier côté client. */
export type AccessType = "view-only" | "download";

/**
 * Contrat d'assignation partagé par tout contenu publié au portail client
 * (documents, ressources, notifications).
 *
 * Règle de visibilité côté client :
 *   `visibility === "global" || assignedClientIds.includes(clientId)`
 *
 * Cible Supabase : colonne `visibility` enum + `assigned_client_ids uuid[]`
 * (ou table de jointure), avec une RLS policy équivalente.
 */
export interface ClientScoped {
  visibility: Visibility;
  /** Ids de `Client` ciblés. `[]` lorsque `visibility === "global"`. */
  assignedClientIds: string[];
}

/**
 * Notation par la Règle des 3C — clés alignées sur `THREE_C_CRITERIA`
 * (src/lib/constants.ts). Valeurs au format lettre + modificateur (ex. "A-", "B+").
 * Remplace les anciens `OmtScore` (évaluations) et `CertificateSubCriteria` (certificats).
 */
export interface ThreeCScore {
  /** Capacité d'auto-évaluation. */
  autoEvaluation: string;
  /** Maîtrise des exigences de la Recommandation du Métier. */
  recommandation: string;
  /** Maîtrise des gestes métiers. */
  gestesMetiers: string;
}
