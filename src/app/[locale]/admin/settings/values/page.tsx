"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Pencil, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { StatusBadge } from "@/components/features/admin/ui/status-badge";
import { ValueFormDialog } from "@/components/features/admin/ValueFormDialog";
import {
  listAllValues,
  toggleValueVisibility,
  updateValue,
  type ValueItem,
} from "@/lib/repo/values.repo";

export default function AdminValuesPage() {
  const [values, setValues] = useState<ValueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ValueItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setValues(await listAllValues());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (id: string) => {
    await toggleValueVisibility(id);
    load();
  };

  const handleSave = async (updated: Partial<ValueItem>) => {
    if (!editing) return;
    await updateValue(editing.id, updated);
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
        title="Valeurs"
        subtitle="Gérez les valeurs affichées sur la page À propos"
      />

      <div className="grid gap-4">
        {values.map((value) => (
          <Card key={value.id}>
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-foreground text-lg">{value.title}</h3>
                  {value.visible !== false ? (
                    <StatusBadge tone="pos">Visible</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">Masqué</StatusBadge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggle(value.id)}
                  className={
                    value.visible !== false
                      ? "text-admin-pos hover:bg-muted"
                      : "text-muted-foreground hover:bg-muted"
                  }
                >
                  {value.visible !== false ? (
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
                <Button variant="outline" size="sm" onClick={() => setEditing(value)}>
                  <Pencil className="mr-2 h-4 w-4" strokeWidth={1.75} />
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editing && (
        <ValueFormDialog value={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      )}
    </div>
  );
}
