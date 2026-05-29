import { createClient } from "@/lib/supabase/client";
import type { Founder } from "@/types/founder";
import type { Database } from "@/lib/supabase/database.types";
import { RepoError } from "@/types/repo-error";

type FounderRow = Database["public"]["Tables"]["founders"]["Row"];
type FounderUpdate = Database["public"]["Tables"]["founders"]["Update"];

// Champs traduits stockés en jsonb {fr,en}. L'admin édite en une seule langue
// (affichage FR) ; à l'écriture on duplique la valeur sur fr ET en (limitation
// assumée tant que le FounderFormDialog n'a pas d'édition bilingue).
type I18nStr = { fr: string; en: string };
type I18nArr = { fr: string[]; en: string[] };
const pickStr = (j: unknown): string => (j as Partial<I18nStr> | null)?.fr ?? "";
const pickArr = (j: unknown): string[] => (j as Partial<I18nArr> | null)?.fr ?? [];
const both = (v: string): I18nStr => ({ fr: v, en: v });
const bothArr = (v: string[]): I18nArr => ({ fr: v, en: v });

function rowToFounder(r: FounderRow): Founder {
  return {
    id: r.id,
    name: r.name,
    role: pickStr(r.role),
    bio: pickStr(r.bio),
    imageUrl: r.image_url,
    imagePosition: r.image_position ?? undefined,
    specialties: pickArr(r.specialties),
    visible: r.visible,
    formerOrg: r.former_org ? pickStr(r.former_org) : undefined,
    currentEntity: r.current_entity ? pickStr(r.current_entity) : undefined,
  };
}

export async function listAllFounders(): Promise<Founder[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("founders")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new RepoError("Impossible de charger les fondateurs", "founders", "list");
  return (data ?? []).map(rowToFounder);
}

export async function listVisibleFounders(): Promise<Founder[]> {
  return (await listAllFounders()).filter((f) => f.visible !== false);
}

export async function updateFounder(
  id: string,
  updates: Partial<Founder>,
): Promise<Founder | null> {
  const supabase = createClient();
  const patch: FounderUpdate = {};
  if (updates.name !== undefined) patch.name = updates.name;
  if (updates.role !== undefined) patch.role = both(updates.role);
  if (updates.bio !== undefined) patch.bio = both(updates.bio);
  if (updates.specialties !== undefined) patch.specialties = bothArr(updates.specialties);
  if (updates.imageUrl !== undefined) patch.image_url = updates.imageUrl;
  if (updates.imagePosition !== undefined) patch.image_position = updates.imagePosition ?? null;
  if (updates.visible !== undefined) patch.visible = updates.visible;
  if (updates.formerOrg !== undefined) patch.former_org = updates.formerOrg ? both(updates.formerOrg) : null;
  if (updates.currentEntity !== undefined) patch.current_entity = updates.currentEntity ? both(updates.currentEntity) : null;
  const { data, error } = await supabase
    .from("founders")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new RepoError("Impossible de modifier le fondateur", "founders", "update");
  return data ? rowToFounder(data) : null;
}

export async function toggleFounderVisibility(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: current, error: readErr } = await supabase
    .from("founders")
    .select("visible")
    .eq("id", id)
    .maybeSingle();
  if (readErr || !current) return false;
  const next = !current.visible;
  const { error } = await supabase.from("founders").update({ visible: next }).eq("id", id);
  if (error) throw new RepoError("Impossible de modifier la visibilité", "founders", "update");
  return next;
}
