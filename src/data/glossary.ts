import type { Locale } from "@/i18n/routing";

// Glossaire public TST / risque électrique — levier GEO n°1 : chaque entrée est
// une définition autonome citable par les moteurs génératifs (format
// « terme développé + définition de 2-4 phrases »), balisée en DefinedTermSet.

export type GlossaryEntry = {
  id: string;
  term: string;
  /** Développé de l'acronyme, affiché à côté du terme. */
  expansion?: string;
  definition: string;
};

const GLOSSARY_FR: GlossaryEntry[] = [
  {
    id: "tst",
    term: "TST",
    expansion: "Travaux Sous Tension",
    definition:
      "Interventions réalisées sur des ouvrages ou installations électriques maintenus sous tension, sans coupure de l'alimentation. Les TST sont encadrés par des référentiels dédiés (Conditions d'Exécution du Travail) et réservés à des opérateurs formés et habilités. Ils permettent d'assurer la continuité de service du réseau électrique tout en maîtrisant le risque électrique.",
  },
  {
    id: "bt",
    term: "BT",
    expansion: "Basse Tension",
    definition:
      "Domaine de tension compris entre 50 et 1 000 volts en courant alternatif (en dessous de 50 V : très basse tension, TBT). La majorité des interventions sous tension du quotidien (branchements, réseaux de distribution, comptage) relèvent des TST BT.",
  },
  {
    id: "hta",
    term: "HTA",
    expansion: "Haute Tension A",
    definition:
      "Domaine de tension compris entre 1 000 volts et 50 000 volts en courant alternatif, typiquement les réseaux de distribution moyenne tension (20 kV en France). Les TST HTA exigent des méthodes spécifiques : travail à distance, au contact ou au potentiel.",
  },
  {
    id: "cet",
    term: "CET",
    expansion: "Conditions d'Exécution du Travail",
    definition:
      "Référentiels publiés par le Comité des Travaux Sous Tension qui décrivent les méthodes, prescriptions et limites pour réaliser des travaux sous tension en sécurité. On distingue notamment les CET BT et les CET HTA.",
  },
  {
    id: "ft-bt",
    term: "FT BT",
    expansion: "Fiches Techniques Basse Tension",
    definition:
      "Fiches du Comité des Travaux Sous Tension qui précisent les modalités pratiques des TST BT : outils, matériels, contrôles périodiques, gestes techniques. Une nouvelle édition entre en application le 1er septembre 2026.",
  },
  {
    id: "ctst",
    term: "CTST",
    expansion: "Comité des Travaux Sous Tension",
    definition:
      "Instance nationale française qui élabore et maintient les référentiels des travaux sous tension (CET, fiches techniques) et délivre les approbations associées.",
  },
  {
    id: "serect",
    term: "SERECT",
    definition:
      "Organisme historique français de référence pour les travaux sous tension, adossé à EDF, chargé des essais, de la recherche et de la qualification des matériels et méthodes TST. Les quatre fondateurs de CETé sont d'anciens experts du SERECT.",
  },
  {
    id: "nfc18510",
    term: "NF C 18-510",
    definition:
      "Norme française de référence pour la prévention du risque électrique : elle définit les opérations sur les ouvrages et installations électriques et les habilitations requises pour les réaliser (recueil UTE C 18-510 devenu norme).",
  },
  {
    id: "habilitation",
    term: "Habilitation électrique",
    definition:
      "Reconnaissance, par l'employeur, de la capacité d'une personne à accomplir en sécurité les tâches électriques qui lui sont confiées. Les symboles B1T, B2T (basse tension) et H1T, H2T (haute tension) désignent les habilitations propres aux travaux sous tension.",
  },
  {
    id: "vigi-score",
    term: "Vigi-Score®",
    definition:
      "Notation composite développée par CETé pour objectiver la maîtrise du risque électrique d'une organisation. Elle assemble trois lettres (de AAA à DDD), une par critère de la Règle des 3C, chaque critère étant noté de A (conforme) à D (critique).",
  },
  {
    id: "regle-3c",
    term: "Règle des 3C",
    definition:
      "Socle méthodologique du Vigi-Score® : trois critères indépendants évalués de A à D — la capacité d'auto-évaluation de l'organisation, la conformité à la Recommandation du Métier, et la maîtrise opérationnelle des gestes métiers observée sur le terrain.",
  },
  {
    id: "vigilance",
    term: "Vigilance / Vulnérabilité",
    definition:
      "Concepts fondateurs de la méthode CETé : la vigilance est la capacité proactive d'une organisation à anticiper, détecter et maîtriser les risques électriques ; la vulnérabilité est l'exposition résiduelle au risque lorsque la vigilance est insuffisante.",
  },
  {
    id: "dps",
    term: "DPS",
    expansion: "Diagnostic Performance Sécurité",
    definition:
      "Audit terrain structuré du système de maîtrise du risque électrique d'une organisation : analyse de l'auto-évaluation, de l'organisation et des pratiques sur chantier représentatif. Le DPS est le socle de la notation CETé et donne lieu à un certificat.",
  },
  {
    id: "save",
    term: "SAVE",
    expansion: "Scan d'Analyse de Vulnérabilité des Événements",
    definition:
      "Expertise d'appui à l'analyse d'événements : accidents, presqu'accidents, chaudes alertes et situations dangereuses. Un regard indépendant pour comprendre les causes profondes et prévenir leur répétition.",
  },
  {
    id: "omt",
    term: "O-M-T",
    expansion: "Observatoire de la Maîtrise des Travaux Sous Tension",
    definition:
      "Base de connaissances terrain constituée par CETé : 133 DPS réalisés, 43 entreprises auditées et plus de 10 000 exigences observées entre 2022 et 2025. L'observatoire objective les écarts récurrents et situe chaque organisation par rapport à son secteur.",
  },
  {
    id: "audimat",
    term: "AudiMaT",
    definition:
      "Outil CETé d'auto-évaluation : il mesure la capacité d'une organisation à connaître et évaluer elle-même sa conformité au prescrit réglementaire. Le retour AudiMaT alimente le premier critère de la Règle des 3C.",
  },
  {
    id: "vat-malt",
    term: "VAT / MALT CC",
    expansion: "Vérification d'Absence de Tension / Mise À La Terre et en Court-Circuit",
    definition:
      "Opérations fondamentales de sécurité électrique hors tension : vérifier l'absence de tension avant intervention, puis mettre à la terre et en court-circuit l'ouvrage. Leur absence constitue une non-conformité majeure.",
  },
  {
    id: "duerp",
    term: "DUERP",
    expansion: "Document Unique d'Évaluation des Risques Professionnels",
    definition:
      "Document obligatoire pour tout employeur, qui recense et hiérarchise les risques professionnels de l'entreprise — dont le risque électrique — et fonde le plan d'actions de prévention.",
  },
  {
    id: "iprp",
    term: "IPRP",
    expansion: "Intervenant en Prévention des Risques Professionnels",
    definition:
      "Statut enregistré auprès de l'administration attestant des compétences d'un intervenant en prévention (technique, organisationnelle ou médicale) au service des entreprises.",
  },
];

const GLOSSARY_EN: GlossaryEntry[] = [
  {
    id: "tst",
    term: "TST",
    expansion: "Live Working (Travaux Sous Tension)",
    definition:
      "Work performed on electrical networks or installations that remain energised, without cutting the power supply. Live working is governed by dedicated reference frameworks (working conditions specifications) and restricted to trained, authorised operators. It keeps the grid running while controlling electrical risk.",
  },
  {
    id: "bt",
    term: "BT",
    expansion: "Low Voltage (Basse Tension)",
    definition:
      "Voltage domain between 50 and 1,000 volts AC (below 50 V: extra-low voltage). Most day-to-day live working operations (connections, distribution networks, metering) fall under LV live working (TST BT).",
  },
  {
    id: "hta",
    term: "HTA",
    expansion: "High Voltage A (Haute Tension A)",
    definition:
      "Voltage domain between 1,000 and 50,000 volts AC — typically medium-voltage distribution networks (20 kV in France). HV live working (TST HTA) requires specific methods: at distance, in contact, or at potential.",
  },
  {
    id: "cet",
    term: "CET",
    expansion: "Working Conditions Specifications",
    definition:
      "Reference documents published by the French Live Working Committee describing the methods, requirements and limits for performing live work safely. They include the LV (CET BT) and HV (CET HTA) specifications.",
  },
  {
    id: "ft-bt",
    term: "FT BT",
    expansion: "Low Voltage Technical Sheets",
    definition:
      "Sheets from the French Live Working Committee detailing the practical arrangements for LV live working: tools, equipment, periodic checks, technical gestures. A new edition applies from 1 September 2026.",
  },
  {
    id: "ctst",
    term: "CTST",
    expansion: "French Live Working Committee",
    definition:
      "The French national body that develops and maintains live working reference frameworks (specifications and technical sheets) and issues the related approvals.",
  },
  {
    id: "serect",
    term: "SERECT",
    definition:
      "The historic French reference body for live working, linked to EDF, in charge of testing, research and qualification of live working equipment and methods. CETé's four founders are former SERECT experts.",
  },
  {
    id: "nfc18510",
    term: "NF C 18-510",
    definition:
      "The French standard of reference for electrical risk prevention: it defines operations on electrical networks and installations and the authorisations required to perform them.",
  },
  {
    id: "habilitation",
    term: "Electrical authorisation",
    definition:
      "The employer's formal recognition that a person can safely carry out the electrical tasks assigned to them. The symbols B1T, B2T (low voltage) and H1T, H2T (high voltage) designate live working authorisations.",
  },
  {
    id: "vigi-score",
    term: "Vigi-Score®",
    definition:
      "The composite rating developed by CETé to objectively measure an organisation's electrical risk management. It assembles three letters (from AAA to DDD), one per criterion of the 3C Rule, each rated from A (compliant) to D (critical).",
  },
  {
    id: "regle-3c",
    term: "3C Rule",
    definition:
      "The methodological backbone of the Vigi-Score®: three independent criteria rated A to D — the organisation's self-assessment capability, compliance with the professional recommendation, and operational control of technical gestures observed in the field.",
  },
  {
    id: "vigilance",
    term: "Vigilance / Vulnerability",
    definition:
      "Founding concepts of the CETé method: vigilance is an organisation's proactive capability to anticipate, detect and control electrical risks; vulnerability is the residual exposure to risk when vigilance is insufficient.",
  },
  {
    id: "dps",
    term: "DPS",
    expansion: "Safety Performance Diagnosis",
    definition:
      "A structured field audit of an organisation's electrical risk management system: analysis of the self-assessment, of the organisation and of practices on a representative worksite. The DPS is the foundation of the CETé rating and leads to a certificate.",
  },
  {
    id: "save",
    term: "SAVE",
    expansion: "Event Vulnerability Analysis Scan",
    definition:
      "Expert support for event analysis: accidents, near-misses, close calls and hazardous situations. An independent perspective to understand root causes and prevent recurrence.",
  },
  {
    id: "omt",
    term: "O-M-T",
    expansion: "Live Working Mastery Observatory",
    definition:
      "The field knowledge base built by CETé: 133 DPS audits, 43 companies assessed and more than 10,000 requirements observed between 2022 and 2025. The observatory objectifies recurring gaps and benchmarks each organisation against its sector.",
  },
  {
    id: "audimat",
    term: "AudiMaT",
    definition:
      "CETé's self-assessment tool: it measures an organisation's ability to know and assess its own regulatory compliance. The AudiMaT feedback feeds the first criterion of the 3C Rule.",
  },
  {
    id: "vat-malt",
    term: "VAT / MALT CC",
    expansion: "Absence of Voltage Verification / Earthing and Short-Circuiting",
    definition:
      "Fundamental de-energised safety operations: verifying the absence of voltage before working, then earthing and short-circuiting the installation. Their absence is a major non-conformity.",
  },
  {
    id: "duerp",
    term: "DUERP",
    expansion: "Single Occupational Risk Assessment Document",
    definition:
      "A mandatory document for every French employer, listing and ranking the company's occupational risks — including electrical risk — and underpinning the prevention action plan.",
  },
  {
    id: "iprp",
    term: "IPRP",
    expansion: "Occupational Risk Prevention Practitioner",
    definition:
      "A status registered with the French administration attesting to a practitioner's prevention skills (technical, organisational or medical) in support of companies.",
  },
];

export function getGlossary(locale: Locale): GlossaryEntry[] {
  return locale === "en" ? GLOSSARY_EN : GLOSSARY_FR;
}
