import { Founder } from "@/types/founder";
import { Service } from "@/types/service";
import { Pillar } from "@/types/pillar";
import { Value } from "@/types/value";
import { Navigation } from "@/types/navigation";
import { ContactInfo } from "@/types/contact";

import foundersData from "@/data/mocks/founders.json";
import servicesData from "@/data/mocks/services.json";
import pillarsData from "@/data/mocks/pillars.json";
import valuesData from "@/data/mocks/values.json";
import navigationData from "@/data/mocks/navigation.json";
import contactData from "@/data/mocks/contact_info.json";
import organizationsData from "@/data/mocks/organizations.json";

export function getFounders(): Founder[] {
  // Read from localStorage if available (allows admin edits without redeploy)
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cete_founders");
    if (stored) {
      return (JSON.parse(stored) as Founder[]).filter(
        (f) => f.visible !== false
      );
    }
  }
  return (foundersData as Founder[]).filter((f) => f.visible !== false);
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

export function getOrganizations(): string[] {
  return organizationsData as string[];
}
