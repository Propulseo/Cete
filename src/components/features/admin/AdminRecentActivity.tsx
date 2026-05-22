"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ClientDocument } from "@/types/document";
import type { Article } from "@/types/article";

interface AdminRecentActivityProps {
  documents: ClientDocument[];
  articles: Article[];
}

export function AdminRecentActivity({ documents, articles }: AdminRecentActivityProps) {
  const recentDocs = documents.slice(0, 4);
  const recentArticles = articles.slice(0, 3);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Derniers documents</CardTitle>
          <Badge variant="secondary">{documents.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-foreground line-clamp-1">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.category} · {doc.uploadDate}</p>
                </div>
                <Badge variant={doc.visibility === "global" ? "default" : "outline"}>
                  {doc.visibility}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Articles récents</CardTitle>
          <Badge variant="secondary">{articles.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentArticles.map((article) => (
              <div key={article.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-foreground">{article.title}</p>
                  <p className="text-xs text-muted-foreground">Par {article.author}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs ${article.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {article.status === "published" ? "Publié" : "Brouillon"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
