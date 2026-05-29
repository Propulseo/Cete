import { Founder } from "@/types/founder";
import { Service } from "@/types/service";
import { Pillar } from "@/types/pillar";
import { Value } from "@/types/value";
import { Navigation } from "@/types/navigation";
import { ContactInfo } from "@/types/contact";

import foundersDataFr from "@/data/mocks/fr/founders.json";
import servicesDataFr from "@/data/mocks/fr/services.json";
import pillarsDataFr from "@/data/mocks/fr/pillars.json";
import valuesDataFr from "@/data/mocks/fr/values.json";
import navigationDataFr from "@/data/mocks/fr/navigation.json";
import contactDataFr from "@/data/mocks/fr/contact_info.json";
import organizationsDataFr from "@/data/mocks/fr/organizations.json";

import foundersDataEn from "@/data/mocks/en/founders.json";
import servicesDataEn from "@/data/mocks/en/services.json";
import pillarsDataEn from "@/data/mocks/en/pillars.json";
import valuesDataEn from "@/data/mocks/en/values.json";
import navigationDataEn from "@/data/mocks/en/navigation.json";
import contactDataEn from "@/data/mocks/en/contact_info.json";
import organizationsDataEn from "@/data/mocks/en/organizations.json";

type Locale = "fr" | "en";

const data = {
  fr: {
    founders: foundersDataFr,
    services: servicesDataFr,
    pillars: pillarsDataFr,
    values: valuesDataFr,
    navigation: navigationDataFr,
    contact: contactDataFr,
    organizations: organizationsDataFr,
  },
  en: {
    founders: foundersDataEn,
    services: servicesDataEn,
    pillars: pillarsDataEn,
    values: valuesDataEn,
    navigation: navigationDataEn,
    contact: contactDataEn,
    organizations: organizationsDataEn,
  },
};

function resolve(locale?: Locale) {
  return data[locale ?? "fr"];
}

// Contenu vitrine statique (par locale). Plus de lecture localStorage publique
// (anti-pattern supprimé). NB: l'admin édite les founders en DB (founders.repo) ;
// l'unification DB↔vitrine (lecture serveur) reste un polish ultérieur.
export function getFounders(locale?: Locale): Founder[] {
  return (resolve(locale).founders as Founder[]).filter((f) => f.visible !== false);
}

export function getServices(locale?: Locale): Service[] {
  return resolve(locale).services as Service[];
}

export function getExpertiseServices(locale?: Locale): Service[] {
  return getServices(locale).filter((s) => s.category === "Expertise");
}

export function getConseilServices(locale?: Locale): Service[] {
  return getServices(locale).filter((s) => s.category === "Conseil");
}

export function getPillarServices(locale?: Locale): Service[] {
  return getServices(locale).filter((s) => s.pillar === true);
}

export function getPillars(locale?: Locale): Pillar[] {
  return resolve(locale).pillars as Pillar[];
}

export function getValues(locale?: Locale): Value[] {
  return resolve(locale).values as Value[];
}

export function getNavigation(locale?: Locale): Navigation {
  return resolve(locale).navigation as Navigation;
}

export function getContactInfo(locale?: Locale): ContactInfo {
  return resolve(locale).contact as ContactInfo;
}

export function getOrganizations(locale?: Locale): string[] {
  return resolve(locale).organizations as string[];
}
