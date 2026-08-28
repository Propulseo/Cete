// Site Constants
export const SITE_NAME = "CETé";
export const SITE_FULL_NAME = "Consortium Experts Techniques Électricité";
export const SITE_TAGLINE = "Classer. Évaluer. Éclairer.";
export const SITE_DESCRIPTION =
  "CETé - Agence de Notation indépendante du risque électrique. Expertise, conseil et formation en sécurité électrique et Travaux Sous Tension (TST).";

// Contact
export const CONTACT_EMAIL = "contact@cet-notation.com";
export const CONTACT_PHONE = "+33 (0)1 XX XX XX XX";
export const CONTACT_ADDRESS = "SERCE - 9 rue de Berri, 75008 Paris";

// Stats
export const YEARS_EXPERIENCE = "20+";
export const CLIENTS_ACCOMPANIED = "200+";
export const FOUNDERS_COUNT = 4;

// Vigi-Score - 4 niveaux individuels (source: Annexe Certificat V3)
export const VIGI_SCORE_LEVELS = {
  A: { label: "Conforme - vigilance forte", color: "var(--color-vigi-a)" },
  B: { label: "Des progrès sont attendus", color: "var(--color-vigi-b)" },
  C: { label: "Alerte", color: "var(--color-vigi-c)" },
  D: { label: "Non conforme - risque critique", color: "var(--color-vigi-d)" },
};

// Règle des 3C - les 3 critères de la vigilance
export const THREE_C_CRITERIA = [
  { id: "autoEvaluation", short: "Auto-évaluation", full: "Capacité d'auto-évaluation" },
  { id: "recommandation", short: "Recommandation & Amélioration", full: "Capacité à maîtriser les exigences de la Recommandation du Métier" },
  { id: "gestesMetiers", short: "Gestes Métiers", full: "Capacité à maîtriser les gestes métiers" },
];

/** @deprecated Use VIGI_SCORE_LEVELS - l'échelle 9 niveaux intermédiaires n'existe pas dans la V3 */
export const ADN_LEVELS = {
  AAA: { label: "Maîtrise optimale", color: "green" },
  A: { label: "Bonne maîtrise", color: "green" },
  BBB: { label: "Maîtrise satisfaisante", color: "yellow" },
  B: { label: "Maîtrise suffisante", color: "yellow" },
  CCC: { label: "Risque modéré", color: "orange" },
  C: { label: "Risque très élevé", color: "red" },
  DDD: { label: "Risque critique", color: "red" },
};
