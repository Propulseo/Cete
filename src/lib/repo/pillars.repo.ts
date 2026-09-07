import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import { RepoError } from "@/types/repo-error";

type PillarRow = Database["public"]["Tables"]["pillars"]["Row"];
type PillarUpdate = Database["public"]["Tables"]["pillars"]["Update"];

export interface PillarItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  visible: boolean;
}

type I18nStr = { fr: string; en: string };
const pickStr = (j: unknown): string => (j as Partial<I18nStr> | null)?.fr ?? "";
const enStr = (j: unknown): string | undefined => (j as Partial<I18nStr> | null)?.en;
const mergeStr = (current: unknown, fr: string): I18nStr => ({ fr, en: enStr(current) ?? fr });

function rowToPillar(r: PillarRow): PillarItem {
  return {
    id: r.id,
    title: pickStr(r.title),
    description: pickStr(r.description),
    icon: r.icon,
    color: r.color,
    sortOrder: r.sort_order,
    visible: r.visible,
  };
}

export async function listAllPillars(): Promise<PillarItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("pillars").select("*").order("sort_order", { ascending: true });
  if (error) throw new RepoError("Impossible de charger les piliers", "pillars", "list");
  return (data ?? []).map(rowToPillar);
}

export async function updatePillar(id: string, updates: Partial<PillarItem>): Promise<PillarItem | null> {
  const supabase = createClient();
  const { data: cur } = await supabase.from("pillars").select("*").eq("id", id).maybeSingle();
  const patch: PillarUpdate = {};
  if (updates.title !== undefined) patch.title = mergeStr(cur?.title, updates.title);
  if (updates.description !== undefined) patch.description = mergeStr(cur?.description, updates.description);
  if (updates.icon !== undefined) patch.icon = updates.icon;
  if (updates.color !== undefined) patch.color = updates.color;
  if (updates.visible !== undefined) patch.visible = updates.visible;
  const { data, error } = await supabase.from("pillars").update(patch).eq("id", id).select("*").maybeSingle();
  if (error) throw new RepoError("Impossible de modifier le pilier", "pillars", "update");
  return data ? rowToPillar(data) : null;
}

export async function togglePillarVisibility(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: current, error: readErr } = await supabase
    .from("pillars")
    .select("visible")
    .eq("id", id)
    .maybeSingle();
  if (readErr || !current) return false;
  const next = !current.visible;
  const { error } = await supabase.from("pillars").update({ visible: next }).eq("id", id);
  if (error) throw new RepoError("Impossible de modifier la visibilité", "pillars", "update");
  return next;
}
