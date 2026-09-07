import { createClient } from "@/lib/supabase/server";
import type { PageOverridesMap } from "@/types";

export async function loadPageOverrides(pageKey: string): Promise<PageOverridesMap> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("page_content_overrides")
      .select("field_key, value")
      .eq("page_key", pageKey);
    if (error || !data) return {};
    const result: PageOverridesMap = {};
    for (const row of data) {
      const v = row.value as { fr?: string; en?: string };
      result[row.field_key] = { fr: v.fr ?? "", en: v.en ?? v.fr ?? "" };
    }
    return result;
  } catch {
    return {};
  }
}
