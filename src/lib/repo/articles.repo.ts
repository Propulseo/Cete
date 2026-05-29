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
    excerpt: r.excerpt,
    author: r.author,
    category: r.category as ArticleCategory,
    status: r.status as Article["status"],
    publishedDate: r.published_date,
    views: r.views,
    featured: r.featured,
    videoUrl: r.video_url ?? undefined,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

function articleToInsert(payload: Omit<Article, "id">): ArticleInsert {
  return {
    title: payload.title,
    excerpt: payload.excerpt,
    author: payload.author,
    category: payload.category,
    status: payload.status,
    published_date: payload.publishedDate,
    views: payload.views,
    featured: payload.featured,
    video_url: payload.videoUrl ?? null,
  };
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
  if (payload.excerpt !== undefined) patch.excerpt = payload.excerpt;
  if (payload.author !== undefined) patch.author = payload.author;
  if (payload.category !== undefined) patch.category = payload.category;
  if (payload.status !== undefined) patch.status = payload.status;
  if (payload.publishedDate !== undefined) patch.published_date = payload.publishedDate;
  if (payload.views !== undefined) patch.views = payload.views;
  if (payload.featured !== undefined) patch.featured = payload.featured;
  if (payload.videoUrl !== undefined) patch.video_url = payload.videoUrl ?? null;

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
