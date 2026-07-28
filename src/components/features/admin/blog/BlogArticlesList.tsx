"use client";

// BlogArticlesList — rendu de la liste des articles, extrait de la page /admin/blog pour
// la ramener sous la limite de 250 lignes. Deux vues du même jeu de données : tableau à
// partir de `lg`, fiches verticales en dessous (voir RecordCard).
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Edit, Trash2, Star, Video, Newspaper, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecordCard, RecordCardList } from "@/components/shared/record-card";
import { StatusBadge } from "@/components/features/admin/ui/status-badge";
import {
  AdminTable,
  AdminThead,
  AdminTh,
  AdminTbody,
  AdminTr,
  AdminTd,
} from "@/components/features/admin/ui/admin-table";
import type { Article } from "@/types/article";

function Thumb({ article }: { article: Article }) {
  if (article.coverImage) {
    return (
      <Image
        src={article.coverImage}
        alt=""
        width={56}
        height={40}
        className="h-10 w-14 shrink-0 rounded-md object-cover ring-1 ring-border"
      />
    );
  }
  return (
    <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground ring-1 ring-border">
      <Newspaper className="h-4 w-4" strokeWidth={1.75} />
    </div>
  );
}

interface BlogArticlesListProps {
  articles: Article[];
  onDelete: (id: string) => void;
}

export function BlogArticlesList({ articles, onDelete }: BlogArticlesListProps) {
  const router = useRouter();
  const locale = useLocale();

  // Actions d'une ligne / d'une fiche, partagées par les deux vues.
  const rowActions = (article: Article) => (
    <>
      {article.status === "published" && (
        <a
          href={`/${locale}/blog/${article.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Voir « ${article.title} » en ligne`}
          className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:size-9"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
        </a>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Modifier ${article.title}`}
        onClick={() => router.push(`/admin/blog/${article.id}`)}
      >
        <Edit className="h-4 w-4" strokeWidth={1.75} />
      </Button>
      <Button variant="ghost" size="icon" aria-label={`Supprimer ${article.title}`} onClick={() => onDelete(article.id)}>
        <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} />
      </Button>
    </>
  );

  const titleWithFlags = (article: Article) => (
    <span className="flex items-center gap-2">
      <span className="min-w-0 truncate">{article.title}</span>
      {article.videoUrl && <Video className="size-4 shrink-0 text-primary" strokeWidth={1.75} />}
      {article.featured && <Star className="size-4 shrink-0 fill-accent text-accent" strokeWidth={1.75} />}
    </span>
  );

  const statusBadge = (article: Article) => (
    <StatusBadge status={article.status}>
      {article.status === "published" ? "Publié" : "Brouillon"}
    </StatusBadge>
  );

  return (
    <>
      <div className="hidden lg:block">
        <AdminTable>
          <AdminThead>
            <AdminTr>
              <AdminTh>Article</AdminTh>
              <AdminTh>Auteur</AdminTh>
              <AdminTh>Catégorie</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh>Vues</AdminTh>
              <AdminTh className="text-right">Actions</AdminTh>
            </AdminTr>
          </AdminThead>
          <AdminTbody>
            {articles.map((article) => (
              <AdminTr
                key={article.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/blog/${article.id}`)}
              >
                <AdminTd>
                  <div className="flex items-center gap-3">
                    <Thumb article={article} />
                    <div className="min-w-0">
                      {titleWithFlags(article)}
                      <p className="truncate text-xs text-muted-foreground">
                        {article.publishedDate || "Non publié"} · /{article.slug}
                      </p>
                    </div>
                  </div>
                </AdminTd>
                <AdminTd className="text-sm text-muted-foreground">{article.author}</AdminTd>
                <AdminTd>
                  <Badge variant="secondary">{article.category}</Badge>
                </AdminTd>
                <AdminTd>{statusBadge(article)}</AdminTd>
                <AdminTd className="text-sm tabular-nums text-muted-foreground">{article.views}</AdminTd>
                <AdminTd className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">{rowActions(article)}</div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTbody>
        </AdminTable>
      </div>

      <RecordCardList className="lg:hidden">
        {articles.map((article) => (
          <RecordCard
            key={article.id}
            onActivate={() => router.push(`/admin/blog/${article.id}`)}
            activateLabel={`Modifier ${article.title}`}
            icon={<Thumb article={article} />}
            title={titleWithFlags(article)}
            subtitle={`${article.publishedDate || "Non publié"} · /${article.slug}`}
            badges={
              <>
                {statusBadge(article)}
                <Badge variant="secondary">{article.category}</Badge>
              </>
            }
            fields={[
              { label: "Auteur", value: article.author },
              { label: "Vues", value: <span className="tabular-nums">{article.views}</span> },
            ]}
            actions={rowActions(article)}
          />
        ))}
      </RecordCardList>
    </>
  );
}
