"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Pencil, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FounderFormDialog } from "@/components/features/admin/FounderFormDialog";
import {
  listAllFounders,
  toggleFounderVisibility,
  updateFounder,
} from "@/lib/repo/founders.repo";
import type { Founder } from "@/types/founder";

export default function AdminTeamPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Founder | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await listAllFounders();
    setFounders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (id: string) => {
    await toggleFounderVisibility(id);
    load();
  };

  const handleSave = async (updated: Partial<Founder>) => {
    if (!editing) return;
    await updateFounder(editing.id, updated);
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Équipe</h1>
        <p className="text-muted-foreground">
          Gérez la visibilité et les informations des co-fondateurs
        </p>
      </div>

      <div className="grid gap-4">
        {founders.map((founder) => (
          <Card key={founder.id}>
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1A2940] to-[#0D5A8A] text-white font-display text-xl">
                {founder.name.split(" ").map((n) => n[0]).join("")}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-foreground text-lg">
                    {founder.name}
                  </h3>
                  {founder.visible !== false ? (
                    <Badge className="bg-green-100 text-green-700">Visible</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700">Masqué</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{founder.role}</p>
                {founder.formerOrg && (
                  <p className="text-xs text-muted-foreground">{founder.formerOrg}</p>
                )}
                {founder.currentEntity && (
                  <p className="text-xs text-muted-foreground">{founder.currentEntity}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggle(founder.id)}
                  className={
                    founder.visible !== false
                      ? "border-green-300 text-green-700 hover:bg-green-50"
                      : "border-red-300 text-red-700 hover:bg-red-50"
                  }
                >
                  {founder.visible !== false ? (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Masqué
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(founder)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editing && (
        <FounderFormDialog
          founder={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
