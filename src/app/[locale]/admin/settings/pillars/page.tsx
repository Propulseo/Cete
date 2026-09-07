"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Pencil, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { StatusBadge } from "@/components/features/admin/ui/status-badge";
import { PillarFormDialog } from "@/components/features/admin/PillarFormDialog";
import {
  listAllPillars,
  togglePillarVisibility,
  updatePillar,
  type PillarItem,
} from "@/lib/repo/pillars.repo";

export default function AdminPillarsPage() {
  const [pillars, setPillars] = useState<PillarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PillarItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPillars(await listAllPillars());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (id: string) => {
    await togglePillarVisibility(id);
    load();
  };

  const handleSave = async (updated: Partial<PillarItem>) => {
    if (!editing) return;
    await updatePillar(editing.id, updated);
    setEditing(null);
    load();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title="Piliers"
        subtitle="Gérez les trois piliers de la méthode (Évaluer, Noter, Accompagner)"
      />

      <div className="grid gap-4">
        {pillars.map((pillar) => (
          <Card key={pillar.id}>
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-foreground text-lg">{pillar.title}</h3>
                  {pillar.visible !== false ? (
                    <StatusBadge tone="pos">Visible</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">Masqué</StatusBadge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggle(pillar.id)}
                  className={
                    pillar.visible !== false
                      ? "text-admin-pos hover:bg-muted"
                      : "text-muted-foreground hover:bg-muted"
                  }
                >
                  {pillar.visible !== false ? (
                    <>
                      <Eye className="mr-2 h-4 w-4" strokeWidth={1.75} />
                      Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" strokeWidth={1.75} />
                      Masqué
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditing(pillar)}>
                  <Pencil className="mr-2 h-4 w-4" strokeWidth={1.75} />
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editing && (
        <PillarFormDialog pillar={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      )}
    </div>
  );
}
