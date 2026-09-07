import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import { RepoError } from "@/types/repo-error";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

export interface ServiceItem {
  id: string;
  category: string;
  type: string;
  isPillar: boolean;
  title: string;
  description: string;
  shortDescription: string;
  features: string[];
  icon: string;
  imageUrl: string;
  sortOrder: number;
  visible: boolean;
}

type I18nStr = { fr: string; en: string };
type I18nArr = { fr: string[]; en: string[] };
const pickStr = (j: unknown): string => (j as Partial<I18nStr> | null)?.fr ?? "";
const pickArr = (j: unknown): string[] => (j as Partial<I18nArr> | null)?.fr ?? [];
const enStr = (j: unknown): string | undefined => (j as Partial<I18nStr> | null)?.en;
const enArr = (j: unknown): string[] | undefined => (j as Partial<I18nArr> | null)?.en;
const mergeStr = (current: unknown, fr: string): I18nStr => ({ fr, en: enStr(current) ?? fr });
const mergeArr = (current: unknown, fr: string[]): I18nArr => ({ fr, en: enArr(current) ?? fr });

function rowToService(r: ServiceRow): ServiceItem {
  return {
    id: r.id,
    category: r.category,
    type: r.type,
    isPillar: r.is_pillar,
    title: pickStr(r.title),
    description: pickStr(r.description),
    shortDescription: pickStr(r.short_description),
    features: pickArr(r.features),
    icon: r.icon,
    imageUrl: r.image_url,
    sortOrder: r.sort_order,
    visible: r.visible,
  };
}

export async function listAllServices(): Promise<ServiceItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("services").select("*").order("sort_order", { ascending: true });
  if (error) throw new RepoError("Impossible de charger les services", "services", "list");
  return (data ?? []).map(rowToService);
}

export async function updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem | null> {
  const supabase = createClient();
  const { data: cur } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  const patch: ServiceUpdate = {};
  if (updates.category !== undefined) patch.category = updates.category;
  if (updates.type !== undefined) patch.type = updates.type;
  if (updates.isPillar !== undefined) patch.is_pillar = updates.isPillar;
  if (updates.title !== undefined) patch.title = mergeStr(cur?.title, updates.title);
  if (updates.description !== undefined) patch.description = mergeStr(cur?.description, updates.description);
  if (updates.shortDescription !== undefined) patch.short_description = mergeStr(cur?.short_description, updates.shortDescription);
  if (updates.features !== undefined) patch.features = mergeArr(cur?.features, updates.features);
  if (updates.icon !== undefined) patch.icon = updates.icon;
  if (updates.imageUrl !== undefined) patch.image_url = updates.imageUrl;
  if (updates.visible !== undefined) patch.visible = updates.visible;
  const { data, error } = await supabase.from("services").update(patch).eq("id", id).select("*").maybeSingle();
  if (error) throw new RepoError("Impossible de modifier le service", "services", "update");
  return data ? rowToService(data) : null;
}

export async function toggleServiceVisibility(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: current, error: readErr } = await supabase
    .from("services")
    .select("visible")
    .eq("id", id)
    .maybeSingle();
  if (readErr || !current) return false;
  const next = !current.visible;
  const { error } = await supabase.from("services").update({ visible: next }).eq("id", id);
  if (error) throw new RepoError("Impossible de modifier la visibilité", "services", "update");
  return next;
}
