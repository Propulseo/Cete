import { createClient } from "@/lib/supabase/client";
import { RepoError } from "@/types/repo-error";

const BUCKET = "blog-images";

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

async function uploadTo(folder: string, file: File): Promise<string> {
  const supabase = createClient();
  const path = `${folder}/${crypto.randomUUID()}-${safeName(file.name)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) {
    throw new RepoError("Impossible de téléverser l'image", "blog-images", "upload");
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Téléverse une image de couverture dans le bucket public `blog-images` et
 * renvoie son URL publique (utilisable directement dans next/image).
 */
export function uploadBlogCover(file: File): Promise<string> {
  return uploadTo("covers", file);
}

/**
 * Idem pour une image insérée dans le corps de l'article. Rangée à part des
 * couvertures : ce sont deux cycles de vie différents (une couverture est
 * remplacée, une image de corps est ajoutée au fil du texte).
 */
export function uploadBlogImage(file: File): Promise<string> {
  return uploadTo("body", file);
}
