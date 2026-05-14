"use client";

import { useState } from "react";
import { Building2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getOrganizations } from "@/lib/data-loader";

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<string[]>(getOrganizations());
  const [newOrg, setNewOrg] = useState("");

  const handleAdd = () => {
    const trimmed = newOrg.trim().toUpperCase();
    if (trimmed && !organizations.includes(trimmed)) {
      setOrganizations([...organizations, trimmed]);
      setNewOrg("");
    }
  };

  const handleRemove = (org: string) => {
    setOrganizations(organizations.filter((o) => o !== org));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Organisations évaluées</h1>
        <p className="text-muted-foreground">
          Gérez la liste des organisations affichées sur le site
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ajouter une organisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Nom de l'organisation..."
              value={newOrg}
              onChange={(e) => setNewOrg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="max-w-md"
            />
            <Button onClick={handleAdd} className="bg-primary">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Liste des organisations</CardTitle>
          <Badge variant="secondary">{organizations.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <div
                key={org}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">{org}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(org)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
