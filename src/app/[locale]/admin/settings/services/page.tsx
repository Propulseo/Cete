"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Pencil, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { StatusBadge } from "@/components/features/admin/ui/status-badge";
import { ServiceFormDialog } from "@/components/features/admin/ServiceFormDialog";
import {
  listAllServices,
  toggleServiceVisibility,
  updateService,
  type ServiceItem,
} from "@/lib/repo/services.repo";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setServices(await listAllServices());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (id: string) => {
    await toggleServiceVisibility(id);
    load();
  };

  const handleSave = async (updated: Partial<ServiceItem>) => {
    if (!editing) return;
    await updateService(editing.id, updated);
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
        title="Services"
        subtitle="Gérez le catalogue Expertise et Conseil"
      />

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-foreground text-lg">{service.title}</h3>
                  <StatusBadge tone="neutral">{service.category}</StatusBadge>
                  {service.isPillar && <StatusBadge tone="pos">Pilier</StatusBadge>}
                  {service.visible !== false ? (
                    <StatusBadge tone="pos">Visible</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">Masqué</StatusBadge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{service.shortDescription}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggle(service.id)}
                  className={
                    service.visible !== false
                      ? "text-admin-pos hover:bg-muted"
                      : "text-muted-foreground hover:bg-muted"
                  }
                >
                  {service.visible !== false ? (
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
                <Button variant="outline" size="sm" onClick={() => setEditing(service)}>
                  <Pencil className="mr-2 h-4 w-4" strokeWidth={1.75} />
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editing && (
        <ServiceFormDialog service={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      )}
    </div>
  );
}
