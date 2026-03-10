import { getItem, setItem } from "@/lib/store/storage";
import type { Article } from "@/types/article";
import { RepoError } from "@/types/repo-error";
import seedData from "@/data/mocks/admin_articles.json";

const KEY = "cete_articles";

function seedIfEmpty(): void {
  if (!getItem<Article[]>(KEY)) {
    setItem(KEY, seedData.articles);
  }
}

// TODO Supabase: supabase.from('articles').select('*').order('created_at', { ascending: false })
export async function listArticles(): Promise<Article[]> {
  try {
    seedIfEmpty();
    return getItem<Article[]>(KEY) ?? [];
  } catch (error) {
    console.error("[articles.repo] listArticles failed:", error);
    throw new RepoError("Impossible de charger les articles", "articles", "list");
  }
}

// TODO Supabase: supabase.from('articles').select('*').eq('id', id).single()
export async function getArticle(id: string): Promise<Article | null> {
  try {
    const articles = await listArticles();
    return articles.find((a) => a.id === id) ?? null;
  } catch (error) {
    console.error("[articles.repo] getArticle failed:", error);
    throw new RepoError("Impossible de charger l'article", "articles", "get");
  }
}

// TODO Supabase: supabase.from('articles').insert(payload).select().single()
export async function createArticle(payload: Omit<Article, "id">): Promise<Article> {
  try {
    const articles = await listArticles();
    const newArticle: Article = {
      ...payload,
      id: `art-${Date.now()}`, // TODO Supabase: UUID auto-généré
    };
    articles.unshift(newArticle);
    setItem(KEY, articles);
    return newArticle;
  } catch (error) {
    console.error("[articles.repo] createArticle failed:", error);
    throw new RepoError("Impossible de créer l'article", "articles", "create");
  }
}

// TODO Supabase: supabase.from('articles').update(payload).eq('id', id).select().single()
export async function updateArticle(
  id: string,
  payload: Partial<Omit<Article, "id">>
): Promise<Article | null> {
  try {
    const articles = await listArticles();
    const idx = articles.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    articles[idx] = { ...articles[idx], ...payload };
    setItem(KEY, articles);
    return articles[idx];
  } catch (error) {
    console.error("[articles.repo] updateArticle failed:", error);
    throw new RepoError("Impossible de modifier l'article", "articles", "update");
  }
}

// TODO Supabase: supabase.from('articles').delete().eq('id', id)
export async function deleteArticle(id: string): Promise<boolean> {
  try {
    const articles = await listArticles();
    const filtered = articles.filter((a) => a.id !== id);
    if (filtered.length === articles.length) return false;
    setItem(KEY, filtered);
    return true;
  } catch (error) {
    console.error("[articles.repo] deleteArticle failed:", error);
    throw new RepoError("Impossible de supprimer l'article", "articles", "delete");
  }
}

export async function resetArticles(): Promise<void> {
  setItem(KEY, seedData.articles);
}
