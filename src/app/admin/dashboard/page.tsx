"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  FileText,
  FolderOpen,
  UserPlus,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listDocuments } from "@/lib/repo/documents.repo";
import { listArticles } from "@/lib/repo/articles.repo";
import { getAdminStats } from "@/lib/repo/stats.repo";
import type { AdminStats } from "@/types/stats";
import type { ClientDocument } from "@/types/document";
import type { Article } from "@/types/article";

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="h-5 w-5" />,
  "check-circle": <CheckCircle className="h-5 w-5" />,
  award: <Award className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
};

export default function AdminDashboardPage() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [stats, docs, arts] = await Promise.all([
        getAdminStats(),
        listDocuments(),
        listArticles(),
      ]);
      setAdminStats(stats);
      setDocuments(docs);
      setArticles(arts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={loadData} variant="outline">Réessayer</Button>
      </div>
    );
  }

  const recentDocs = documents.slice(0, 4);
  const recentArticles = articles.slice(0, 3);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Pilotage de l&apos;agence de notation CETé
        </p>
      </div>

      {/* Stats */}
      {adminStats && (
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {adminStats.stats.map((stat) => (
            <Card key={stat.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {iconMap[stat.icon]}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trend.startsWith("+") ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : stat.trend === "stable" ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      stat.trend.startsWith("+")
                        ? "text-green-500"
                        : stat.trend === "stable"
                          ? "text-muted-foreground"
                          : "text-red-500"
                    }
                  >
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Documents */}
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

        {/* Recent Articles */}
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

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/blog">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Nouvel article</p>
                <p className="text-sm text-muted-foreground">Rédiger un article de veille</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/documents">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Nouveau document</p>
                <p className="text-sm text-muted-foreground">Publier une ressource client</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Nouvel utilisateur</p>
                <p className="text-sm text-muted-foreground">Inviter une organisation</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
