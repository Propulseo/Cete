import { Founder } from "@/types/founder";
import { Service } from "@/types/service";
import { Pillar } from "@/types/pillar";
import { Value } from "@/types/value";
import { Navigation } from "@/types/navigation";
import { ContactInfo } from "@/types/contact";
import { ClientData } from "@/types/document";
import { ArticlesData } from "@/types/article";
import { AdminStats } from "@/types/stats";

import foundersData from "@/data/mocks/founders.json";
import servicesData from "@/data/mocks/services.json";
import pillarsData from "@/data/mocks/pillars.json";
import valuesData from "@/data/mocks/values.json";
import navigationData from "@/data/mocks/navigation.json";
import contactData from "@/data/mocks/contact_info.json";
import clientDocumentsData from "@/data/mocks/client_documents.json";
import adminArticlesData from "@/data/mocks/admin_articles.json";
import adminStatsData from "@/data/mocks/admin_stats.json";

export function getFounders(): Founder[] {
  return foundersData as Founder[];
}

export function getServices(): Service[] {
  return servicesData as Service[];
}

export function getExpertiseServices(): Service[] {
  return getServices().filter((s) => s.category === "Expertise");
}

export function getConseilServices(): Service[] {
  return getServices().filter((s) => s.category === "Conseil");
}

export function getPillars(): Pillar[] {
  return pillarsData as Pillar[];
}

export function getValues(): Value[] {
  return valuesData as Value[];
}

export function getNavigation(): Navigation {
  return navigationData as Navigation;
}

export function getContactInfo(): ContactInfo {
  return contactData as ContactInfo;
}

export function getClientDocuments(): ClientData {
  return clientDocumentsData as ClientData;
}

export function getAdminArticles(): ArticlesData {
  return adminArticlesData as ArticlesData;
}

export function getAdminStats(): AdminStats {
  return adminStatsData as AdminStats;
}
