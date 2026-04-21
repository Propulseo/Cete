import type { Founder } from "@/types/founder";
import foundersData from "@/data/mocks/founders.json";

const KEY = "cete_founders";

function getAll(): Founder[] {
  if (typeof window === "undefined") return foundersData as Founder[];
  const stored = localStorage.getItem(KEY);
  if (!stored) {
    localStorage.setItem(KEY, JSON.stringify(foundersData));
    return foundersData as Founder[];
  }
  return JSON.parse(stored) as Founder[];
}

function save(founders: Founder[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(founders));
  }
}

export async function listAllFounders(): Promise<Founder[]> {
  return getAll();
}

export async function listVisibleFounders(): Promise<Founder[]> {
  return getAll().filter((f) => f.visible !== false);
}

export async function updateFounder(
  id: string,
  updates: Partial<Founder>
): Promise<Founder | null> {
  const founders = getAll();
  const idx = founders.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  founders[idx] = { ...founders[idx], ...updates };
  save(founders);
  return founders[idx];
}

export async function toggleFounderVisibility(
  id: string
): Promise<boolean> {
  const founders = getAll();
  const idx = founders.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  founders[idx].visible = founders[idx].visible === false ? true : false;
  save(founders);
  return founders[idx].visible !== false;
}
