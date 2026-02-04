"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Video,
  BookOpen,
  ClipboardList,
  Bell,
  LogOut,
  Download,
  Play,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function ClientDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const clientData = getClientDocuments();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return null;
  }

  const unreadNotifications = clientData.notifications.filter((n) => !n.read);

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

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Bell className="h-3 w-3" />
                {unreadNotifications.length}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {unreadNotifications.length > 0 && (
        <div className="border-b bg-accent/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Bell className="h-4 w-4 text-accent" />
              <span className="font-medium">Nouvelle notification :</span>
              <span className="text-muted-foreground">
                {unreadNotifications[0].message}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">
          Mes Ressources
        </h1>

        <div className="grid gap-8">
          {Object.entries(documentsByCategory).map(([category, docs]) => (
            <div key={category}>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
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
                        <CardTitle className="text-base">{doc.title}</CardTitle>
                        <Badge
                          variant={doc.type === "video" ? "default" : "outline"}
                        >
                          {doc.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {doc.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {doc.type === "PDF"
                            ? doc.fileSize
                            : `Durée : ${doc.duration}`}
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
    </div>
  );
}
