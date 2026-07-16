import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import type { Article, ArticleCategory } from "@/types/article";
import { RepoError } from "@/types/repo-error";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];

function rowToArticle(r: ArticleRow): Article {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug ?? slugify(r.title),
    excerpt: r.excerpt,
    content: r.content ?? undefined,
    titleEn: r.title_en ?? undefined,
    excerptEn: r.excerpt_en ?? undefined,
    contentEn: r.content_en ?? undefined,
    metaDescriptionEn: r.meta_description_en ?? undefined,
    coverAltEn: r.cover_alt_en ?? undefined,
    author: r.author,
    authorRole: r.author_role ?? undefined,
    category: r.category as ArticleCategory,
    status: r.status as Article["status"],
    publishedDate: r.published_date,
    views: r.views,
    featured: r.featured,
    videoUrl: r.video_url ?? undefined,
    coverImage: r.cover_image ?? undefined,
    coverAlt: r.cover_alt ?? undefined,
    metaDescription: r.meta_description ?? undefined,
    readMinutes: r.read_minutes ?? undefined,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

function articleToInsert(payload: Omit<Article, "id">): ArticleInsert {
  return {
    title: payload.title,
    slug: payload.slug || slugify(payload.title),
    excerpt: payload.excerpt,
    content: payload.content ?? null,
    author: payload.author,
    author_role: payload.authorRole ?? null,
    category: payload.category,
    status: payload.status,
    published_date: payload.publishedDate,
    views: payload.views,
    featured: payload.featured,
    video_url: payload.videoUrl ?? null,
    cover_image: payload.coverImage ?? null,
    cover_alt: payload.coverAlt ?? null,
    meta_description: payload.metaDescription ?? null,
    read_minutes: payload.readMinutes ?? null,
    title_en: payload.titleEn ?? null,
    excerpt_en: payload.excerptEn ?? null,
    content_en: payload.contentEn ?? null,
    meta_description_en: payload.metaDescriptionEn ?? null,
    cover_alt_en: payload.coverAltEn ?? null,
  };
}

/** Slugify identique à articleSlug() de vitrine-data (désaccentué). */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function listArticles(): Promise<Article[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw new RepoError("Impossible de charger les articles", "articles", "list");
  }
  return (data ?? []).map(rowToArticle);
}

export async function getArticle(id: string): Promise<Article | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new RepoError("Impossible de charger l'article", "articles", "get");
  }
  return data ? rowToArticle(data) : null;
}

export async function createArticle(payload: Omit<Article, "id">): Promise<Article> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .insert(articleToInsert(payload))
    .select("*")
    .single();
  if (error || !data) {
    throw new RepoError("Impossible de créer l'article", "articles", "create");
  }
  return rowToArticle(data);
}

export async function updateArticle(
  id: string,
  payload: Partial<Omit<Article, "id">>
): Promise<Article | null> {
  const supabase = createClient();
  const patch: Database["public"]["Tables"]["articles"]["Update"] = {};
  if (payload.title !== undefined) patch.title = payload.title;
  if (payload.slug !== undefined) patch.slug = payload.slug || slugify(payload.title ?? "");
  if (payload.excerpt !== undefined) patch.excerpt = payload.excerpt;
  if (payload.author !== undefined) patch.author = payload.author;
  if (payload.category !== undefined) patch.category = payload.category;
  if (payload.status !== undefined) patch.status = payload.status;
  if (payload.publishedDate !== undefined) patch.published_date = payload.publishedDate;
  if (payload.views !== undefined) patch.views = payload.views;
  if (payload.featured !== undefined) patch.featured = payload.featured;
  // Champs optionnels : la présence de la clé suffit (une valeur vidée dans le
  // formulaire arrive en `undefined` et doit bien effacer la colonne en base).
  if ("content" in payload) patch.content = payload.content ?? null;
  if ("authorRole" in payload) patch.author_role = payload.authorRole ?? null;
  if ("videoUrl" in payload) patch.video_url = payload.videoUrl ?? null;
  if ("coverImage" in payload) patch.cover_image = payload.coverImage ?? null;
  if ("coverAlt" in payload) patch.cover_alt = payload.coverAlt ?? null;
  if ("metaDescription" in payload) patch.meta_description = payload.metaDescription ?? null;
  if ("readMinutes" in payload) patch.read_minutes = payload.readMinutes ?? null;
  if ("titleEn" in payload) patch.title_en = payload.titleEn ?? null;
  if ("excerptEn" in payload) patch.excerpt_en = payload.excerptEn ?? null;
  if ("contentEn" in payload) patch.content_en = payload.contentEn ?? null;
  if ("metaDescriptionEn" in payload) patch.meta_description_en = payload.metaDescriptionEn ?? null;
  if ("coverAltEn" in payload) patch.cover_alt_en = payload.coverAltEn ?? null;

  const { data, error } = await supabase
    .from("articles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) {
    throw new RepoError("Impossible de modifier l'article", "articles", "update");
  }
  return data ? rowToArticle(data) : null;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) {
    throw new RepoError("Impossible de supprimer l'article", "articles", "delete");
  }
  return (data ?? []).length > 0;
}
