import { createClient } from "@/lib/supabase/server";
import {
  getFounders as getFoundersStatic,
  getContactInfo as getContactInfoStatic,
  getOrganizations as getOrganizationsStatic,
} from "@/lib/data-loader";
import type { Founder } from "@/types/founder";
import type { ContactInfo, BusinessHours } from "@/types/contact";
import type { Article } from "@/types/article";
import type { BlogPost } from "@/types/blog";
import type { Database } from "@/lib/supabase/database.types";

// Lectures vitrine côté SERVEUR de la source de vérité DB (founders/settings que
// l'admin édite), traduites selon la locale. Frontière §6 de la migration : la
// vitrine publique reflète désormais les éditions admin.
//
// Garde-fou « la vitrine ne casse jamais » : toute erreur (DB injoignable, RLS,
// settings manquants) bascule sur le JSON statique via data-loader. Ce module est
// server-only de facto — il importe le client Supabase serveur (next/headers).

type Locale = "fr" | "en";
type I18n<T> = { fr: T; en: T };

function pick<T>(value: unknown, locale: Locale, fallback: T): T {
  const o = value as Partial<I18n<T>> | null | undefined;
  if (!o) return fallback;
  return (o[locale] ?? o.fr ?? fallback) as T;
}

const EMPTY_HOURS: BusinessHours = {
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
  saturday: "",
  sunday: "",
};

/**
 * Fondateurs visibles de la vitrine, lus depuis la DB et traduits selon `locale`.
 * La RLS `founders_public_select (visible = true)` ne renvoie déjà que les
 * fondateurs visibles ; on re-filtre par sécurité. Fallback JSON sur erreur ou
 * jeu vide (la section ne s'affiche jamais vide à cause d'un incident DB).
 */
export async function loadFounders(locale: Locale): Promise<Founder[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("founders")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return getFoundersStatic(locale);
    return data
      .filter((r) => r.visible !== false)
      .map((r) => ({
        id: r.id,
        name: r.name,
        role: pick(r.role, locale, ""),
        bio: pick(r.bio, locale, ""),
        imageUrl: r.image_url,
        imagePosition: r.image_position ?? undefined,
        specialties: pick<string[]>(r.specialties, locale, []),
        visible: r.visible,
        formerOrg: r.former_org ? pick(r.former_org, locale, "") : undefined,
        currentEntity: r.current_entity ? pick(r.current_entity, locale, "") : undefined,
      }));
  } catch {
    return getFoundersStatic(locale);
  }
}

/**
 * Coordonnées / réglages de l'agence, lus depuis la DB et traduits selon `locale`.
 * La RLS `settings_public_select (true)` autorise la lecture anon. Fallback JSON
 * sur erreur ou ligne settings absente.
 */
export async function loadContactInfo(locale: Locale): Promise<ContactInfo> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) throw error ?? new Error("settings introuvables");
    return {
      company: pick(data.company, locale, ""),
      address: data.address,
      city: data.city,
      country: data.country,
      phone: data.phone,
      email: data.email,
      website: data.website,
      businessHours: pick<BusinessHours>(data.business_hours, locale, EMPTY_HOURS),
      maps: { latitude: data.map_latitude ?? 0, longitude: data.map_longitude ?? 0 },
    };
  } catch {
    return getContactInfoStatic(locale);
  }
}

// ── Blog (articles publiés, lus depuis la DB — RLS articles_public_select) ──────

export function articleSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const CATEGORY_COLOR: Record<string, string> = {
  Expertise: "bg-[#4DA6D9]",
  Formation: "bg-[#1A7AB5]",
  Réglementation: "bg-[#1A2940]",
  Sécurité: "bg-[#0D5A8A]",
  Innovation: "bg-[#E8630A]",
  Engagement: "bg-[#16a34a]",
};

const CATEGORY_IMG: Record<string, string> = {
  Expertise: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
  Formation: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
  Réglementation: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
  Sécurité: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop",
  Innovation: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  Engagement: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop",
};

/** Libellé de catégorie affiché sur la vitrine EN (la valeur stockée reste FR). */
const CATEGORY_LABEL_EN: Record<string, string> = {
  Expertise: "Expertise",
  Formation: "Training",
  Réglementation: "Regulation",
  Sécurité: "Safety",
  Innovation: "Innovation",
};

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(2, Math.ceil(words / 180))} min`;
}

/**
 * Projette un article DB en BlogPost déjà résolu dans la langue demandée :
 * champs *_en si renseignés, sinon fallback français. La catégorie stockée
 * (FR) reste la clé pour couleur/visuel ; seul son libellé est traduit.
 */
function articleToBlogPost(a: Article, locale: Locale = "fr"): BlogPost {
  const en = locale === "en";
  const title = (en && a.titleEn) || a.title;
  const excerpt = (en && a.excerptEn) || a.excerpt;
  const content = (en && a.contentEn) || a.content;
  return {
    slug: a.slug || articleSlug(a.title),
    title,
    excerpt,
    content,
    author: a.author,
    authorRole: a.authorRole,
    category: en ? CATEGORY_LABEL_EN[a.category] ?? a.category : a.category,
    categoryColor: CATEGORY_COLOR[a.category] ?? "bg-[#4DA6D9]",
    publishedDate: a.publishedDate ?? a.created_at ?? "",
    readTime: a.readMinutes
      ? `${a.readMinutes} min`
      : estimateReadTime(content || excerpt),
    imageUrl: a.coverImage || CATEGORY_IMG[a.category] || CATEGORY_IMG.Expertise,
    imageAlt: (en && a.coverAltEn) || a.coverAlt,
    metaDescription: (en && (a.metaDescriptionEn || a.excerptEn)) || a.metaDescription,
    featured: a.featured,
    videoUrl: a.videoUrl,
    hasEnglish: Boolean(a.titleEn && (a.contentEn || a.excerptEn)),
  };
}

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

function rowToArticle(r: ArticleRow): Article {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug || articleSlug(r.title),
    excerpt: r.excerpt,
    content: r.content ?? undefined,
    titleEn: r.title_en ?? undefined,
    excerptEn: r.excerpt_en ?? undefined,
    contentEn: r.content_en ?? undefined,
    metaDescriptionEn: r.meta_description_en ?? undefined,
    coverAltEn: r.cover_alt_en ?? undefined,
    author: r.author,
    authorRole: r.author_role ?? undefined,
    category: r.category as Article["category"],
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
  };
}

/** Articles publiés pour la vitrine (par date desc), résolus dans la locale. */
export async function loadPublishedArticles(locale: Locale = "fr"): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_date", { ascending: false, nullsFirst: false });
    if (error || !data) throw error ?? new Error("no articles");
    return data.map((r) => articleToBlogPost(rowToArticle(r), locale));
  } catch {
    return [];
  }
}

/** Noms des organisations visibles pour la vitrine (DB ; fallback JSON statique). */
export async function loadOrganizations(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("organizations")
      .select("name")
      .eq("visible", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error || !data || data.length === 0) return getOrganizationsStatic();
    return data.map((r) => r.name);
  } catch {
    return getOrganizationsStatic();
  }
}

/** Article publié correspondant à un slug (stocké, fallback slugify du titre). */
export async function loadArticleBySlug(
  slug: string,
  locale: Locale = "fr",
): Promise<BlogPost | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published");
    if (error || !data) return null;
    const row =
      data.find((r) => r.slug === slug) ??
      data.find((r) => articleSlug(r.title) === slug);
    if (!row) return null;
    return articleToBlogPost(rowToArticle(row), locale);
  } catch {
    return null;
  }
}
