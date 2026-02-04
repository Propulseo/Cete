"use client";

import { FileText, Video, BookOpen, ClipboardList, Download, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { getClientDocuments } from "@/lib/data-loader";

const categoryIcons: Record<string, React.ReactNode> = {
  newsletters: <FileText className="h-5 w-5" />,
  capsules: <Video className="h-5 w-5" />,
  guides: <BookOpen className="h-5 w-5" />,
  carnets: <ClipboardList className="h-5 w-5" />,
};

const categoryLabels: Record<string, string> = {
  newsletters: "Newsletters",
  capsules: "Capsules vidéo",
  guides: "Guides opératoires",
  carnets: "Carnets d'appui",
};

const categoryColors: Record<string, string> = {
  newsletters: "bg-blue-100 text-blue-600",
  capsules: "bg-purple-100 text-purple-600",
  guides: "bg-green-100 text-green-600",
  carnets: "bg-orange-100 text-orange-600",
};

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const clientData = getClientDocuments();

  if (!user) {
    return null;
  }

  // Group documents by category
  const documentsByCategory = clientData.documents.reduce(
    (acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }
      acc[doc.category].push(doc);
      return acc;
    },
    {} as Record<string, typeof clientData.documents>
  );

  // Stats
  const totalDocs = clientData.documents.length;
  const categories = Object.keys(documentsByCategory);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenue, {user.name}
        </h1>
        <p className="text-muted-foreground">
          Accédez à vos ressources et documents CETé
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">{totalDocs}</div>
            <p className="text-sm text-muted-foreground">Documents disponibles</p>
          </CardContent>
        </Card>
        {categories.slice(0, 3).map((category) => (
          <Card key={category}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${categoryColors[category]}`}>
                  {categoryIcons[category]}
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {documentsByCategory[category].length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {categoryLabels[category]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documents by Category */}
      <div className="space-y-8">
        {Object.entries(documentsByCategory).map(([category, docs]) => (
          <div key={category}>
            <div className="mb-4 flex items-center gap-2">
              <div className={`rounded-lg p-2 ${categoryColors[category]}`}>
                {categoryIcons[category]}
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {categoryLabels[category]}
              </h2>
              <Badge variant="secondary">{docs.length}</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {docs.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-2">
                        {doc.title}
                      </CardTitle>
                      <Badge
                        variant={doc.type === "video" ? "default" : "outline"}
                        className="ml-2 flex-shrink-0"
                      >
                        {doc.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {doc.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {doc.type === "PDF" ? doc.fileSize : `Durée : ${doc.duration}`}
                      </span>
                      <Button size="sm" variant="outline">
                        {doc.type === "video" ? (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Regarder
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
