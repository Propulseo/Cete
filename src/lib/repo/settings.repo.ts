import { createClient } from "@/lib/supabase/client";
import type { ContactInfo, BusinessHours } from "@/types/contact";
import type { Database } from "@/lib/supabase/database.types";
import { RepoError } from "@/types/repo-error";

type SettingsRow = Database["public"]["Tables"]["settings"]["Row"];
type SettingsUpdate = Database["public"]["Tables"]["settings"]["Update"];

// `company` et `business_hours` sont en jsonb {fr,en}. L'admin édite en FR ;
// à l'écriture on duplique sur fr ET en (limitation assumée).
type I18n<T> = { fr: T; en: T };
const EMPTY_HOURS: BusinessHours = {
  monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "",
};

function rowToContactInfo(r: SettingsRow): ContactInfo {
  return {
    company: (r.company as Partial<I18n<string>> | null)?.fr ?? "",
    address: r.address,
    city: r.city,
    country: r.country,
    phone: r.phone,
    email: r.email,
    website: r.website,
    businessHours: (r.business_hours as Partial<I18n<BusinessHours>> | null)?.fr ?? EMPTY_HOURS,
    maps: { latitude: r.map_latitude ?? 0, longitude: r.map_longitude ?? 0 },
  };
}

export async function getSettings(): Promise<ContactInfo> {
  const supabase = createClient();
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) throw new RepoError("Impossible de charger les paramètres", "settings", "get");
  return rowToContactInfo(data);
}

export async function updateSettings(payload: Partial<ContactInfo>): Promise<ContactInfo> {
  const supabase = createClient();
  const patch: SettingsUpdate = {};
  if (payload.company !== undefined) patch.company = { fr: payload.company, en: payload.company };
  if (payload.address !== undefined) patch.address = payload.address;
  if (payload.city !== undefined) patch.city = payload.city;
  if (payload.country !== undefined) patch.country = payload.country;
  if (payload.phone !== undefined) patch.phone = payload.phone;
  if (payload.email !== undefined) patch.email = payload.email;
  if (payload.website !== undefined) patch.website = payload.website;
  if (payload.businessHours !== undefined) {
    patch.business_hours = {
      fr: payload.businessHours,
      en: payload.businessHours,
    } as unknown as SettingsUpdate["business_hours"];
  }
  if (payload.maps !== undefined) {
    patch.map_latitude = payload.maps.latitude;
    patch.map_longitude = payload.maps.longitude;
  }
  const { data, error } = await supabase
    .from("settings")
    .update(patch)
    .eq("id", 1)
    .select("*")
    .maybeSingle();
  if (error || !data) throw new RepoError("Impossible de modifier les paramètres", "settings", "update");
  return rowToContactInfo(data);
}

// Plus de seed statique : "réinitialiser" n'a plus de cible. No-op conservé pour
// préserver l'import éventuel de la page settings.
export async function resetSettings(): Promise<void> {
  /* no-op (la source de vérité est désormais la DB) */
}
