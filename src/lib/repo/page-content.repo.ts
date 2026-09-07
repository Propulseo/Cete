import { createClient } from "@/lib/supabase/client";
import { RepoError } from "@/types/repo-error";
import type { PageOverridesMap } from "@/types";

const BUCKET = "site-images";

export async function getPageOverrides(pageKey: string): Promise<PageOverridesMap> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("page_content_overrides")
    .select("field_key, value")
    .eq("page_key", pageKey);
  if (error) throw new RepoError("Impossible de charger le contenu de la page", "page_content_overrides", "list");
  const result: PageOverridesMap = {};
  for (const row of data ?? []) {
    const v = row.value as { fr?: string; en?: string };
    result[row.field_key] = { fr: v.fr ?? "", en: v.en ?? v.fr ?? "" };
  }
  return result;
}

export async function setPageOverrideText(pageKey: string, fieldKey: string, fr: string): Promise<void> {
  const supabase = createClient();
  const { data: cur } = await supabase
    .from("page_content_overrides")
    .select("value")
    .eq("page_key", pageKey)
    .eq("field_key", fieldKey)
    .maybeSingle();
  const en = (cur?.value as { en?: string } | null)?.en ?? fr;
  const { error } = await supabase
    .from("page_content_overrides")
    .upsert({ page_key: pageKey, field_key: fieldKey, value: { fr, en } });
  if (error) throw new RepoError("Impossible d'enregistrer ce champ", "page_content_overrides", "update");
}

export async function clearPageOverride(pageKey: string, fieldKey: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("page_content_overrides")
    .delete()
    .eq("page_key", pageKey)
    .eq("field_key", fieldKey);
  if (error) throw new RepoError("Impossible de réinitialiser ce champ", "page_content_overrides", "delete");
}

function safeName(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return `${base || "image"}${ext}`;
}

export async function uploadPageImage(pageKey: string, file: File): Promise<string> {
  const supabase = createClient();
  const path = `${pageKey}/${crypto.randomUUID()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new RepoError("Impossible de téléverser l'image", "site-images", "upload");
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
