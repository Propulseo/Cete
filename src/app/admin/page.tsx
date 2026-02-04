"use client";

import { Users, CheckCircle, Award, Star, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats, getAdminArticles } from "@/lib/data-loader";

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="h-5 w-5" />,
  "check-circle": <CheckCircle className="h-5 w-5" />,
  award: <Award className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
};

export default function AdminDashboardPage() {
  const adminStats = getAdminStats();
  const articles = getAdminArticles();

  const recentArticles = articles.articles.slice(0, 3);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de l&apos;activité CETé
        </p>
      </div>

      {/* Stats Grid */}
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

      {/* Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Articles récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {article.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Par {article.author} •{" "}
                      {article.publishedDate || "Brouillon"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      article.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {article.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Nouvel article</p>
                  <p className="text-sm text-muted-foreground">
                    Rédiger un article de blog
                  </p>
                </div>
                <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">
                  Créer
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Nouveau document</p>
                  <p className="text-sm text-muted-foreground">
                    Ajouter une ressource
                  </p>
                </div>
                <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">
                  Ajouter
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Nouvel utilisateur</p>
                  <p className="text-sm text-muted-foreground">
                    Inviter un client
                  </p>
                </div>
                <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">
                  Inviter
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
