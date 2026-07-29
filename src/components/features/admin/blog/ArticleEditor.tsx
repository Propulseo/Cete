"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Loader2, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/features/admin/ui/status-badge";
import type { Article } from "@/types/article";
import { getArticle, createArticle, updateArticle } from "@/lib/repo/articles.repo";
import { uploadBlogCover } from "@/lib/repo/blog-media.repo";
import { ArticleEditorFields } from "./ArticleEditorFields";
import { MarkdownEditor } from "./MarkdownEditor";
import { ArticleEnglishFields } from "./ArticleEnglishFields";
import { ArticleEditorPreview } from "./ArticleEditorPreview";
import { EMPTY_FORM, formFromArticle, formToPayload, type ArticleForm } from "./article-form";

export function ArticleEditor({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(!!articleId);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(articleId ?? null);
  const [savedStatus, setSavedStatus] = useState<"draft" | "published" | null>(null);
  const [views, setViews] = useState(0);
  const [publishedDate, setPublishedDate] = useState<string | null>(null);

  // Chargement de l'article en édition
  useEffect(() => {
    if (!articleId) return;
    let active = true;
    (async () => {
      try {
        const a = await getArticle(articleId);
        if (!active) return;
        if (a) {
          setForm(formFromArticle(a));
          setViews(a.views);
          setPublishedDate(a.publishedDate);
          setSavedStatus(a.status);
        } else {
          toast.error("Article introuvable");
        }
      } catch {
        toast.error("Erreur de chargement de l'article");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [articleId]);

  // Aperçu de la couverture nouvellement choisie (révoqué au changement)
  const coverObjectUrl = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : null),
    [coverFile],
  );
  useEffect(
    () => () => {
      if (coverObjectUrl) URL.revokeObjectURL(coverObjectUrl);
    },
    [coverObjectUrl],
  );

  const set = useCallback(
    (patch: Partial<ArticleForm>) => setForm((p) => ({ ...p, ...patch })),
    [],
  );
  const coverPreview = coverObjectUrl ?? (form.coverImage || null);

  const save = async (status: "draft" | "published") => {
    if (!form.title.trim() || !form.author.trim() || !form.excerpt.trim()) {
      toast.error("Titre, résumé et auteur sont requis");
      return;
    }
    setSaving(true);
    try {
      let coverImage = form.coverImage;
      if (coverFile) coverImage = await uploadBlogCover(coverFile);

      const payload = formToPayload({ ...form, coverImage }, { status, views, publishedDate });
      const result: Article | null = savedId
        ? await updateArticle(savedId, payload)
        : await createArticle(payload);

      if (result) {
        setForm(formFromArticle(result));
        setSavedId(result.id);
        setSavedStatus(result.status);
        setViews(result.views);
        setPublishedDate(result.publishedDate);
        setCoverFile(null);
      }
      toast.success(status === "published" ? "Article publié" : "Brouillon enregistré");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Barre d'actions */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/blog")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
            Retour
          </Button>
          <div className="hidden h-5 w-px bg-border sm:block" />
          <h1 className="hidden text-base font-semibold text-foreground sm:block">
            {savedId ? "Modifier l'article" : "Nouvel article"}
          </h1>
          {savedStatus && (
            <StatusBadge status={savedStatus}>
              {savedStatus === "published" ? "Publié" : "Brouillon"}
            </StatusBadge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {savedId && (
            <Button
              variant="outline"
              size="sm"
              disabled={saving}
              onClick={() => router.push(`/admin/blog/${savedId}/preview`)}
            >
              <Eye className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">Aperçu réel</span>
            </Button>
          )}
          <Button variant="outline" size="sm" disabled={saving} onClick={() => save("draft")}>
            <Save className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
            Brouillon
          </Button>
          <Button size="sm" disabled={saving} onClick={() => save("published")}>
            {saving ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
            )}
            {savedStatus === "published" ? "Mettre à jour" : "Publier"}
          </Button>
        </div>
      </div>

      {/* Zone d'édition : formulaire + aperçu live */}
      <div className="grid flex-1 gap-6 p-4 lg:grid-cols-2 lg:p-8">
        <div className="space-y-6">
          <ArticleEditorFields
            form={form}
            set={set}
            coverFile={coverFile}
            onCoverFileChange={setCoverFile}
          />

          <MarkdownEditor value={form.content} onChange={(content) => set({ content })} />

          <ArticleEnglishFields form={form} set={set} />
        </div>

        <div className="lg:sticky lg:top-[72px] lg:self-start">
          <ArticleEditorPreview form={form} coverPreview={coverPreview} />
        </div>
      </div>
    </div>
  );
}
