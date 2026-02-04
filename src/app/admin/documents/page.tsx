"use client";

import { Plus, Upload, Download, Trash2, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getClientDocuments } from "@/lib/data-loader";

export default function AdminDocumentsPage() {
  const { documents } = getClientDocuments();

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">
            Bibliothèque de ressources clients
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Uploader un document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">
                    Document
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Catégorie
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Taille/Durée
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            doc.type === "PDF"
                              ? "bg-red-100 text-red-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {doc.type === "PDF" ? (
                            <FileText className="h-5 w-5" />
                          ) : (
                            <Video className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {doc.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {doc.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="secondary">{doc.category}</Badge>
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={doc.type === "PDF" ? "outline" : "default"}
                      >
                        {doc.type}
                      </Badge>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {doc.type === "PDF" ? doc.fileSize : doc.duration}
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {doc.uploadDate}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
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
