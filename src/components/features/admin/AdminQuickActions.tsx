import { FileText, FolderPlus, UserPlus } from "lucide-react";
import { AdminQuickAction } from "./ui/admin-quick-action";

export function AdminQuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <AdminQuickAction
        href="/admin/blog"
        icon={FileText}
        title="Nouvel article"
        description="Rédiger un article de veille"
      />
      <AdminQuickAction
        href="/admin/documents"
        icon={FolderPlus}
        title="Nouveau document"
        description="Publier une ressource client"
      />
      <AdminQuickAction
        href="/admin/users"
        icon={UserPlus}
        title="Nouvel utilisateur"
        description="Inviter une organisation"
      />
    </div>
  );
}
