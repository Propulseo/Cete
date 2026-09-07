import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import { RepoError } from "@/types/repo-error";

type ValueRow = Database["public"]["Tables"]["values"]["Row"];
type ValueUpdate = Database["public"]["Tables"]["values"]["Update"];

export interface ValueItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  visible: boolean;
}

type I18nStr = { fr: string; en: string };
const pickStr = (j: unknown): string => (j as Partial<I18nStr> | null)?.fr ?? "";
const enStr = (j: unknown): string | undefined => (j as Partial<I18nStr> | null)?.en;
const mergeStr = (current: unknown, fr: string): I18nStr => ({ fr, en: enStr(current) ?? fr });

function rowToValue(r: ValueRow): ValueItem {
  return {
    id: r.id,
    title: pickStr(r.title),
    description: pickStr(r.description),
    icon: r.icon,
    sortOrder: r.sort_order,
    visible: r.visible,
  };
}

export async function listAllValues(): Promise<ValueItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("values").select("*").order("sort_order", { ascending: true });
  if (error) throw new RepoError("Impossible de charger les valeurs", "values", "list");
  return (data ?? []).map(rowToValue);
}

export async function updateValue(id: string, updates: Partial<ValueItem>): Promise<ValueItem | null> {
  const supabase = createClient();
  const { data: cur } = await supabase.from("values").select("*").eq("id", id).maybeSingle();
  const patch: ValueUpdate = {};
  if (updates.title !== undefined) patch.title = mergeStr(cur?.title, updates.title);
  if (updates.description !== undefined) patch.description = mergeStr(cur?.description, updates.description);
  if (updates.icon !== undefined) patch.icon = updates.icon;
  if (updates.visible !== undefined) patch.visible = updates.visible;
  const { data, error } = await supabase.from("values").update(patch).eq("id", id).select("*").maybeSingle();
  if (error) throw new RepoError("Impossible de modifier la valeur", "values", "update");
  return data ? rowToValue(data) : null;
}

export async function toggleValueVisibility(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: current, error: readErr } = await supabase
    .from("values")
    .select("visible")
    .eq("id", id)
    .maybeSingle();
  if (readErr || !current) return false;
  const next = !current.visible;
  const { error } = await supabase.from("values").update({ visible: next }).eq("id", id);
  if (error) throw new RepoError("Impossible de modifier la visibilité", "values", "update");
  return next;
}
