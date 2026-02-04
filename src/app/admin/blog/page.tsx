"use client";

import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminArticles } from "@/lib/data-loader";

export default function AdminBlogPage() {
  const { articles } = getAdminArticles();

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground">
            Gérez vos articles et publications
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">
                    Titre
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Auteur
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Catégorie
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Statut
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Vues
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {article.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {article.publishedDate || "Non publié"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {article.author}
                    </td>
                    <td className="py-4">
                      <Badge variant="secondary">{article.category}</Badge>
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          article.status === "published"
                            ? "default"
                            : "outline"
                        }
                      >
                        {article.status === "published" ? "Publié" : "Brouillon"}
                      </Badge>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {article.views}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
