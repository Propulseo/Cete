import type { ReactNode } from "react";

/** Textes FR/EN de l'article éditorial VIZ-ACT (balisage dans VizActContent). */
export interface VizActCopy {
  intro: ReactNode;
  statText: ReactNode;
  statSource: string;
  afterStat: ReactNode;
  ideaTitle: string;
  ideaIntro: string;
  steps: [ReactNode, ReactNode, ReactNode];
  noRetype: string;
  viewsTitle: string;
  viewsIntro: string;
  mapTitle: string;
  mapDesc: string;
  listTitle: string;
  listDesc: string;
  transparency: string;
  whyTitle: string;
  advantages: { title: string; description: string }[];
  pilotTitle: string;
  pilotText: ReactNode;
  summaryTitle: string;
  summaryText: ReactNode;
}

const fr: VizActCopy = {
  intro: (
    <>
      Dans le monde exigeant des travaux sous tension (TST BT), la fiabilité et la
      maîtrise des compétences ne sont pas une option - ce sont des{" "}
      <strong>impératifs de sécurité</strong>. Pourtant, selon l&apos;Observatoire de la
      Maîtrise des TST (OMT) :
    </>
  ),
  statText: (
    <>
      des employeurs rencontrent des difficultés à assurer la{" "}
      <strong className="text-white">traçabilité des actes T</strong> et à suivre la
      pratique réelle de leurs opérateurs.
    </>
  ),
  statSource: "Source : Observatoire de la Maîtrise des TST (OMT)",
  afterStat: (
    <>
      Face à ce constat, CETé innove avec <strong className="text-[#1A2940]">VIZ-ACT</strong>,
      la solution digitale qui transforme la gestion des Ordres de Travail Sous Tension (OTST).
    </>
  ),
  ideaTitle: "Une idée simple, un impact fort",
  ideaIntro: "L'innovation VIZ-ACT repose sur une démarche terrain très concrète :",
  steps: [
    "Le chargé de travaux prend en photo son OTST directement sur le chantier.",
    "La photo est téléchargée sur le site partenaire CETé.",
    "L'intelligence artificielle identifie automatiquement les informations clés (localisation, date, type d'ouvrage, opérateurs, documents associés) et met à jour la base de suivi des actes T.",
  ],
  noRetype: "Plus besoin de ressaisir, ni de jongler entre fiches papier et tableurs.",
  viewsTitle: "Deux vues pour une vision complète",
  viewsIntro: "VIZ-ACT offre deux niveaux de lecture pour un suivi optimal des interventions :",
  mapTitle: "Vue Carte",
  mapDesc:
    "Visualisez en un clin d'oeil tous les actes T passés, en cours ou à venir, géolocalisés sur le territoire.",
  listTitle: "Vue Liste",
  listDesc:
    "Retrouvez, filtrez et consultez les OTST avec leur historique et leurs documents associés.",
  transparency:
    "Transparence, clarté et accessibilité : tout est pensé pour simplifier la vie des managers et encadrants TST.",
  whyTitle: "Pourquoi VIZ-ACT change la donne",
  advantages: [
    {
      title: "Traçabilité automatique des actes T",
      description: "Chaque OTST est enregistré et archivé sans effort.",
    },
    {
      title: "Suivi des compétences simplifié",
      description: "Appui direct aux exigences du CTST et à la NF C 18-510-1.",
    },
    {
      title: "Gain de temps administratif",
      description: "Laissez l'IA gérer la saisie, et concentrez-vous sur le terrain.",
    },
    {
      title: "Outil d'aide au management",
      description:
        "Catégorisation des opérateurs, suivi du recyclage et préparation des renouvellements d'habilitation.",
    },
  ],
  pilotTitle: "Une expérimentation en cours",
  pilotText: (
    <>
      L&apos;expérimentation débute en <strong>mai 2025</strong> avec les entreprises{" "}
      <strong>SMEE</strong> et <strong>SERPOLLET</strong>. Objectif : faciliter le quotidien
      des équipes TST, renforcer la culture sécurité et garantir le respect des exigences du
      Comité des Travaux Sous Tension.
    </>
  ),
  summaryTitle: "En résumé",
  summaryText: (
    <>
      VIZ-ACT, c&apos;est : <strong>moins d&apos;administratif</strong>, plus de fiabilité,
      une <strong>vision claire des pratiques terrain</strong>, et une{" "}
      <strong>sécurité renforcée</strong> pour tous. Une innovation signée CETé, au service
      du professionnalisme TST.
    </>
  ),
};

const en: VizActCopy = {
  intro: (
    <>
      In the demanding world of live working (low-voltage TST), reliability and skills
      mastery are not optional - they are <strong>safety imperatives</strong>. Yet
      according to the Live Working Competency Observatory (OMT):
    </>
  ),
  statText: (
    <>
      of employers struggle to ensure the{" "}
      <strong className="text-white">traceability of live working operations</strong> and
      to monitor their operators&apos; actual field practice.
    </>
  ),
  statSource: "Source: Live Working Competency Observatory (OMT)",
  afterStat: (
    <>
      To address this, CETé is innovating with{" "}
      <strong className="text-[#1A2940]">VIZ-ACT</strong>, the digital solution that
      transforms the management of Live Working Orders (OTST).
    </>
  ),
  ideaTitle: "A simple idea, a strong impact",
  ideaIntro: "The VIZ-ACT innovation is built on a very practical field-driven approach:",
  steps: [
    "The work supervisor photographs the work order directly on site.",
    "The photo is uploaded to the CETé partner platform.",
    "Artificial intelligence automatically identifies the key information (location, date, type of installation, operators, related documents) and updates the live working tracking database.",
  ],
  noRetype: "No more re-typing, no more juggling paper forms and spreadsheets.",
  viewsTitle: "Two views for a complete picture",
  viewsIntro: "VIZ-ACT offers two levels of insight for optimal monitoring of operations:",
  mapTitle: "Map view",
  mapDesc:
    "See at a glance all past, ongoing and upcoming live working operations, geolocated across the territory.",
  listTitle: "List view",
  listDesc:
    "Find, filter and browse work orders with their history and related documents.",
  transparency:
    "Transparency, clarity and accessibility: everything is designed to make life easier for live working managers and supervisors.",
  whyTitle: "Why VIZ-ACT is a game changer",
  advantages: [
    {
      title: "Automatic traceability of live working operations",
      description: "Every work order is recorded and archived effortlessly.",
    },
    {
      title: "Simplified skills monitoring",
      description: "Direct support for CTST requirements and the NF C 18-510-1 standard.",
    },
    {
      title: "Less time on paperwork",
      description: "Let AI handle data entry so you can focus on the field.",
    },
    {
      title: "A management support tool",
      description:
        "Operator categorisation, refresher-training follow-up and preparation of authorisation renewals.",
    },
  ],
  pilotTitle: "A pilot programme underway",
  pilotText: (
    <>
      The pilot starts in <strong>May 2025</strong> with the companies <strong>SMEE</strong>{" "}
      and <strong>SERPOLLET</strong>. The goal: make daily work easier for live working
      teams, strengthen the safety culture and guarantee compliance with the requirements of
      the Live Working Committee.
    </>
  ),
  summaryTitle: "In short",
  summaryText: (
    <>
      VIZ-ACT means: <strong>less paperwork</strong>, more reliability, a{" "}
      <strong>clear view of field practices</strong>, and{" "}
      <strong>stronger safety</strong> for everyone. A CETé innovation, serving live working
      professionalism.
    </>
  ),
};

export const VIZ_ACT_COPY: Record<"fr" | "en", VizActCopy> = { fr, en };
