import Link from "next/link";
import { FileText, FolderOpen, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AdminQuickActions() {
  return (
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
  );
}
