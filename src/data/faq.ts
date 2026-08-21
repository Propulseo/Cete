import type { Locale } from "@/i18n/routing";

// FAQ publiques par page — format question→réponse autonome (40-90 mots),
// pensé pour l'extraction par les moteurs génératifs et balisé en FAQPage.
// Le JSON-LD est généré depuis ces mêmes données : le schéma reflète toujours
// exactement le contenu affiché (exigence Google pour FAQPage).

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqPage = "expertise" | "services" | "contact";

const FAQ_FR: Record<FaqPage, FaqItem[]> = {
  expertise: [
    {
      id: "vigi-score",
      question: "Qu'est-ce que le Vigi-Score® ?",
      answer:
        "Le Vigi-Score® est la notation composite développée par CETé pour mesurer la maîtrise du risque électrique d'une organisation. Elle assemble trois lettres, une par critère de la Règle des 3C, chacune allant de A (conforme) à D (critique). AAA traduit l'excellence, DDD un risque critique. La note est attribuée en comité de suivi après un diagnostic terrain.",
    },
    {
      id: "regle-3c",
      question: "Comment la note est-elle calculée (Règle des 3C) ?",
      answer:
        "Trois critères indépendants sont évalués : la capacité d'auto-évaluation de l'organisation (outil AudiMaT), la conformité à la Recommandation du Métier, et la maîtrise des gestes métiers observée sur un chantier représentatif. Chaque critère reçoit une lettre de A à D ; leur assemblage forme la notation composite, assortie d'un indicateur de tendance.",
    },
    {
      id: "tst",
      question: "Qu'est-ce que les travaux sous tension (TST) ?",
      answer:
        "Les travaux sous tension désignent les interventions réalisées sur des ouvrages électriques maintenus sous tension, sans interruption de l'alimentation. Ils sont encadrés par des référentiels dédiés (Conditions d'Exécution du Travail) et réservés à des opérateurs formés et habilités. CETé évalue la maîtrise de ces pratiques en basse tension (BT) et haute tension (HTA).",
    },
    {
      id: "bt-vs-hta",
      question: "Quelle différence entre TST BT et TST HTA ?",
      answer:
        "Les TST BT concernent le domaine basse tension (50 à 1 000 volts) : branchements, réseaux de distribution, comptage. Les TST HTA concernent la haute tension A (1 000 à 50 000 volts) et mobilisent des méthodes spécifiques : travail à distance, au contact ou au potentiel. Les habilitations et les référentiels diffèrent pour chaque domaine.",
    },
    {
      id: "note-d",
      question: "Que déclenche une note D ?",
      answer:
        "Une note D signale une non-conformité majeure : par exemple l'absence de vérification d'absence de tension (VAT) et de mise à la terre, un opérateur non habilité, ou un chantier commencé sans autorisation. Elle traduit une vulnérabilité élevée et appelle un plan d'actions de progrès prioritaire, accompagné par CETé.",
    },
    {
      id: "certificat",
      question: "Un certificat est-il délivré ?",
      answer:
        "Oui. À l'issue du diagnostic et de la notation en comité de suivi, CETé remet un certificat mentionnant le Vigi-Score® obtenu. Chaque certificat est vérifiable en ligne grâce à un QR code unique, ce qui permet à vos clients, donneurs d'ordre et assureurs d'en contrôler l'authenticité.",
    },
  ],
  services: [
    {
      id: "dps",
      question: "Qu'est-ce qu'un DPS (Diagnostic Performance Sécurité) ?",
      answer:
        "Le DPS est l'audit terrain du risque électrique qui fonde la démarche CETé : analyse de votre auto-évaluation réglementaire, observation de l'organisation et des pratiques sur un chantier représentatif, rapport à quatre niveaux de lecture, notation en comité de suivi, certificat et accompagnement au plan d'actions de progrès.",
    },
    {
      id: "deroulement",
      question: "Comment se déroule un audit CETé ?",
      answer:
        "L'évaluation croise trois regards : votre auto-évaluation (AudiMaT), l'analyse de la conformité à la Recommandation du Métier, et l'observation des gestes métiers en situation réelle de travaux sous tension. Les constats sont restitués dans un rapport structuré, puis convertis en notation Vigi-Score® par le comité de suivi.",
    },
    {
      id: "cibles",
      question: "À qui s'adressent les offres CETé ?",
      answer:
        "Aux organisations exposées au risque électrique : exploitants et prestataires des réseaux, entreprises réalisant des travaux sous tension (BT ou HTA), services QSE et directions souhaitant objectiver leur prévention. Les donneurs d'ordre et les assureurs utilisent la notation comme référence indépendante.",
    },
    {
      id: "formation",
      question: "CETé est-elle un organisme de formation ?",
      answer:
        "Non. CETé est une agence de notation indépendante : elle évalue et note la maîtrise du risque électrique. Le Campus CPF propose du coaching et de la professionnalisation, et CETé accompagne les organismes de formation qui souhaitent intégrer son référentiel — en complément, jamais en remplacement, des formations habilitantes.",
    },
    {
      id: "save",
      question: "Qu'est-ce que le SAVE ?",
      answer:
        "Le SAVE (Scan d'Analyse de Vulnérabilité des Événements) est une expertise d'appui à l'analyse d'événements : accidents, presqu'accidents, chaudes alertes ou situations dangereuses. Un regard indépendant pour identifier les causes profondes, formuler des recommandations ciblées et prévenir la répétition.",
    },
    {
      id: "pass-vip",
      question: "Que comprend le PASS-Sérénité VIP ?",
      answer:
        "Un accès privilégié à l'écosystème CETé ADN : veille réglementaire, base Questions/Réponses, synthèse annuelle des DPS, animation des encadrants et formateurs référents, et éligibilité aux outils partenaires comme VIZ-ACT. C'est le volet continuité de la démarche, entre deux évaluations.",
    },
  ],
  contact: [
    {
      id: "demande",
      question: "Comment demander une évaluation ?",
      answer:
        "Remplissez le formulaire de contact en décrivant votre activité (TST BT, TST HTA, exploitation, prestation) et votre besoin. Un expert CETé vous recontacte pour un entretien dans les meilleurs délais, afin de cadrer le périmètre de l'évaluation.",
    },
    {
      id: "zone",
      question: "Intervenez-vous partout en France ?",
      answer:
        "Oui. CETé intervient sur l'ensemble du territoire français, sur les sites et chantiers de ses clients. Les diagnostics terrain (DPS) se déroulent sur un chantier représentatif de votre activité.",
    },
    {
      id: "confidentialite",
      question: "La notation est-elle confidentielle ?",
      answer:
        "Les résultats détaillés vous sont restitués et le benchmark sectoriel est anonymisé. Le certificat délivré est vérifiable en ligne via son QR code : c'est vous qui décidez de le partager avec vos clients, donneurs d'ordre ou assureurs.",
    },
    {
      id: "vs-bureau-controle",
      question: "Quelle différence avec un bureau de contrôle ?",
      answer:
        "Un bureau de contrôle vérifie la conformité réglementaire des installations. CETé évalue la maîtrise réelle des pratiques : organisation, compétences et gestes métiers observés sur le terrain, convertis en une notation comparable (Vigi-Score®). Les deux approches sont complémentaires.",
    },
  ],
};

const FAQ_EN: Record<FaqPage, FaqItem[]> = {
  expertise: [
    {
      id: "vigi-score",
      question: "What is the Vigi-Score®?",
      answer:
        "The Vigi-Score® is the composite rating developed by CETé to measure how well an organisation controls electrical risk. It assembles three letters, one per criterion of the 3C Rule, each from A (compliant) to D (critical). AAA reflects excellence, DDD a critical risk. The rating is issued by the monitoring committee after a field diagnosis.",
    },
    {
      id: "regle-3c",
      question: "How is the rating calculated (3C Rule)?",
      answer:
        "Three independent criteria are assessed: the organisation's self-assessment capability (AudiMaT tool), compliance with the professional recommendation, and control of technical gestures observed on a representative worksite. Each criterion receives a letter from A to D; together they form the composite rating, with a trend indicator.",
    },
    {
      id: "tst",
      question: "What is live working (TST)?",
      answer:
        "Live working refers to work performed on electrical installations that remain energised, without interrupting the power supply. It is governed by dedicated reference frameworks and restricted to trained, authorised operators. CETé assesses these practices in both low voltage (LV) and high voltage (HV).",
    },
    {
      id: "bt-vs-hta",
      question: "What is the difference between LV and HV live working?",
      answer:
        "LV live working covers the low-voltage domain (50 to 1,000 volts): connections, distribution networks, metering. HV live working covers high voltage A (1,000 to 50,000 volts) and involves specific methods: at distance, in contact, or at potential. Authorisations and reference frameworks differ for each domain.",
    },
    {
      id: "note-d",
      question: "What triggers a D rating?",
      answer:
        "A D rating flags a major non-conformity: for instance the absence of voltage verification and earthing, an unauthorised operator, or a worksite started without authorisation. It reflects high vulnerability and calls for a priority improvement action plan, supported by CETé.",
    },
    {
      id: "certificat",
      question: "Is a certificate issued?",
      answer:
        "Yes. After the diagnosis and the rating issued by the monitoring committee, CETé delivers a certificate stating the Vigi-Score® obtained. Each certificate can be verified online through a unique QR code, allowing your clients, principals and insurers to check its authenticity.",
    },
  ],
  services: [
    {
      id: "dps",
      question: "What is a DPS (Safety Performance Diagnosis)?",
      answer:
        "The DPS is the electrical risk field audit at the heart of the CETé approach: analysis of your regulatory self-assessment, observation of the organisation and practices on a representative worksite, a report with four reading levels, a rating issued by the monitoring committee, a certificate and support for the action plan.",
    },
    {
      id: "deroulement",
      question: "How does a CETé audit unfold?",
      answer:
        "The assessment crosses three perspectives: your self-assessment (AudiMaT), compliance with the professional recommendation, and the observation of technical gestures in real live working situations. Findings are delivered in a structured report, then converted into a Vigi-Score® rating by the monitoring committee.",
    },
    {
      id: "cibles",
      question: "Who are CETé's services for?",
      answer:
        "Organisations exposed to electrical risk: network operators and contractors, companies performing live working (LV or HV), QSE departments and executives who want to objectify their prevention. Principals and insurers use the rating as an independent reference.",
    },
    {
      id: "formation",
      question: "Is CETé a training organisation?",
      answer:
        "No. CETé is an independent rating agency: it assesses and rates electrical risk management. Campus CPF offers coaching and professional development, and CETé supports training organisations wishing to adopt its framework — as a complement to, never a replacement for, qualifying training.",
    },
    {
      id: "save",
      question: "What is SAVE?",
      answer:
        "SAVE (Event Vulnerability Analysis Scan) is expert support for event analysis: accidents, near-misses, close calls or hazardous situations. An independent perspective to identify root causes, issue targeted recommendations and prevent recurrence.",
    },
    {
      id: "pass-vip",
      question: "What does PASS-Sérénité VIP include?",
      answer:
        "Privileged access to the CETé ADN ecosystem: regulatory watch, Questions & Answers base, annual DPS synthesis, coordination of supervisors and referent trainers, and eligibility for partner tools such as VIZ-ACT. It is the continuity component of the approach, between two assessments.",
    },
  ],
  contact: [
    {
      id: "demande",
      question: "How do I request an assessment?",
      answer:
        "Fill in the contact form describing your activity (LV live working, HV live working, operations, contracting) and your needs. A CETé expert will get back to you promptly to scope the assessment.",
    },
    {
      id: "zone",
      question: "Do you operate throughout France?",
      answer:
        "Yes. CETé operates across the whole French territory, on its clients' sites and worksites. Field diagnoses (DPS) take place on a worksite representative of your activity.",
    },
    {
      id: "confidentialite",
      question: "Is the rating confidential?",
      answer:
        "Detailed results are delivered to you and the sector benchmark is anonymised. The certificate can be verified online through its QR code: you decide whether to share it with your clients, principals or insurers.",
    },
    {
      id: "vs-bureau-controle",
      question: "How is this different from an inspection body?",
      answer:
        "An inspection body checks the regulatory compliance of installations. CETé assesses the actual control of practices: organisation, skills and technical gestures observed in the field, converted into a comparable rating (Vigi-Score®). The two approaches are complementary.",
    },
  ],
};

export function getFaq(page: FaqPage, locale: Locale): FaqItem[] {
  return (locale === "en" ? FAQ_EN : FAQ_FR)[page];
}
