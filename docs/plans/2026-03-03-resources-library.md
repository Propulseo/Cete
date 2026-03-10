# Bibliothèque de Ressources Techniques et Réglementaires — Plan d'implémentation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter une bibliothèque de ressources techniques et réglementaires avec gestion admin (CRUD) et consultation client (lecture seule, téléchargement).

**Architecture:** Nouveau modèle `Resource` avec repository localStorage (pattern identique à `documents.repo.ts`). Page admin en tableau avec filtres. Page client en grille de cartes. Navigation mise à jour dans les deux layouts.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui (Dialog, Badge, Button, Input), Lucide icons, sonner (toast), localStorage.

---

### Task 1: Type Resource + export

**Files:**
- Create: `src/types/resource.ts`
- Modify: `src/types/index.ts`

**Step 1: Create the Resource interface**

Create `src/types/resource.ts`:

```typescript
export type ResourceCategory = "normes" | "reglementation" | "guides" | "rapports" | "veille";

export type ResourceType = "pdf" | "lien" | "video";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  url: string;
  youtubeId?: string;
  fileSize?: string;
  source?: string;
  publishedDate: string;
  createdAt: string;
}
```

**Step 2: Add barrel export**

In `src/types/index.ts`, add at the end:

```typescript
export * from "./resource";
```

**Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 4: Commit**

```bash
git add src/types/resource.ts src/types/index.ts
git commit -m "feat: add Resource type for technical library"
```

---

### Task 2: Mock data

**Files:**
- Create: `src/data/mocks/resources.json`

**Step 1: Create mock resources**

Create `src/data/mocks/resources.json` with ~10 realistic entries covering all 5 categories and all 3 types. Follow the exact JSON structure from `client_documents.json` as pattern reference.

```json
{
  "resources": [
    {
      "id": "res-001",
      "title": "NF C 15-100 — Installations électriques à basse tension",
      "description": "Norme fondamentale pour la conception, la réalisation et la vérification des installations électriques basse tension en France.",
      "category": "normes",
      "type": "pdf",
      "url": "/resources/nf-c-15-100.pdf",
      "fileSize": "4.8 MB",
      "source": "AFNOR",
      "publishedDate": "2025-06-15",
      "createdAt": "2026-01-10"
    },
    {
      "id": "res-002",
      "title": "NF C 18-510 — Opérations sur les ouvrages et installations électriques",
      "description": "Prescriptions de sécurité pour les opérations sur ou au voisinage des ouvrages et installations électriques.",
      "category": "normes",
      "type": "pdf",
      "url": "/resources/nf-c-18-510.pdf",
      "fileSize": "3.2 MB",
      "source": "AFNOR",
      "publishedDate": "2024-11-01",
      "createdAt": "2026-01-10"
    },
    {
      "id": "res-003",
      "title": "Décret n° 2010-1016 — Obligations des maîtres d'ouvrage",
      "description": "Décret relatif aux obligations des maîtres d'ouvrage entreprenant la construction ou l'aménagement de bâtiments destinés à recevoir des travailleurs.",
      "category": "reglementation",
      "type": "lien",
      "url": "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000022840784",
      "source": "Légifrance",
      "publishedDate": "2010-08-30",
      "createdAt": "2026-01-15"
    },
    {
      "id": "res-004",
      "title": "Directive 2014/35/UE — Matériel électrique basse tension",
      "description": "Directive européenne relative à l'harmonisation des législations concernant la mise à disposition sur le marché du matériel électrique.",
      "category": "reglementation",
      "type": "lien",
      "url": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32014L0035",
      "source": "EUR-Lex",
      "publishedDate": "2014-02-26",
      "createdAt": "2026-01-15"
    },
    {
      "id": "res-005",
      "title": "Guide pratique — Vérifications des installations électriques",
      "description": "Méthodologie complète pour la vérification initiale et périodique des installations électriques conformément à la réglementation.",
      "category": "guides",
      "type": "pdf",
      "url": "/resources/guide-verifications.pdf",
      "fileSize": "2.9 MB",
      "source": "CETé",
      "publishedDate": "2026-01-20",
      "createdAt": "2026-01-22"
    },
    {
      "id": "res-006",
      "title": "Fiche technique — Protection contre les surtensions",
      "description": "Dimensionnement et choix des dispositifs de protection contre les surtensions d'origine atmosphérique et industrielle.",
      "category": "guides",
      "type": "pdf",
      "url": "/resources/fiche-surtensions.pdf",
      "fileSize": "1.4 MB",
      "source": "CETé",
      "publishedDate": "2025-11-05",
      "createdAt": "2025-11-10"
    },
    {
      "id": "res-007",
      "title": "Rapport — Sinistralité électrique en France 2025",
      "description": "Analyse statistique des accidents d'origine électrique en milieu professionnel pour l'année 2025.",
      "category": "rapports",
      "type": "pdf",
      "url": "/resources/rapport-sinistralite-2025.pdf",
      "fileSize": "5.1 MB",
      "source": "CETé",
      "publishedDate": "2026-02-10",
      "createdAt": "2026-02-12"
    },
    {
      "id": "res-008",
      "title": "Retour d'expérience — Incendie d'origine électrique",
      "description": "Analyse d'un cas d'incendie lié à un défaut d'isolement sur installation industrielle haute tension.",
      "category": "rapports",
      "type": "video",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "youtubeId": "dQw4w9WgXcQ",
      "source": "CETé",
      "publishedDate": "2026-01-18",
      "createdAt": "2026-01-20"
    },
    {
      "id": "res-009",
      "title": "Veille — Évolutions NF C 15-100 amendement A6",
      "description": "Synthèse des modifications apportées par l'amendement A6 à la norme NF C 15-100, applicable à compter de juin 2026.",
      "category": "veille",
      "type": "pdf",
      "url": "/resources/veille-nfc15100-a6.pdf",
      "fileSize": "890 KB",
      "source": "AFNOR",
      "publishedDate": "2026-02-25",
      "createdAt": "2026-02-26"
    },
    {
      "id": "res-010",
      "title": "Veille — Nouveau décret contrôles périodiques 2026",
      "description": "Décryptage du décret 2026-XXX modifiant les modalités de contrôle périodique des installations électriques.",
      "category": "veille",
      "type": "lien",
      "url": "https://www.legifrance.gouv.fr",
      "source": "Légifrance",
      "publishedDate": "2026-02-20",
      "createdAt": "2026-02-21"
    }
  ]
}
```

**Step 2: Commit**

```bash
git add src/data/mocks/resources.json
git commit -m "feat: add mock data for technical resources library"
```

---

### Task 3: Data loader + repository

**Files:**
- Create: `src/lib/repo/resources.repo.ts`
- Modify: `src/lib/data-loader.ts`

**Step 1: Create the resources repository**

Create `src/lib/repo/resources.repo.ts` following the exact pattern of `src/lib/repo/documents.repo.ts`:

```typescript
import { getItem, setItem } from "@/lib/store/storage";
import type { Resource } from "@/types/resource";
import seedData from "@/data/mocks/resources.json";

const KEY = "cete_resources";

function seedIfEmpty(): void {
  if (!getItem<Resource[]>(KEY)) {
    setItem(KEY, seedData.resources);
  }
}

export function listResources(): Resource[] {
  seedIfEmpty();
  return getItem<Resource[]>(KEY) ?? [];
}

export function getResource(id: string): Resource | undefined {
  return listResources().find((r) => r.id === id);
}

export function createResource(
  payload: Omit<Resource, "id">
): Resource {
  const resources = listResources();
  const newResource: Resource = {
    ...payload,
    id: `res-${Date.now()}`,
  };
  resources.unshift(newResource);
  setItem(KEY, resources);
  return newResource;
}

export function updateResource(
  id: string,
  payload: Partial<Omit<Resource, "id">>
): Resource | null {
  const resources = listResources();
  const idx = resources.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  resources[idx] = { ...resources[idx], ...payload };
  setItem(KEY, resources);
  return resources[idx];
}

export function deleteResource(id: string): boolean {
  const resources = listResources();
  const filtered = resources.filter((r) => r.id !== id);
  if (filtered.length === resources.length) return false;
  setItem(KEY, filtered);
  return true;
}

export function resetResources(): void {
  setItem(KEY, seedData.resources);
}
```

**Step 2: Add getter to data-loader.ts**

In `src/lib/data-loader.ts`, add the import and getter:

Import at top:
```typescript
import { Resource } from "@/types/resource";
import resourcesData from "@/data/mocks/resources.json";
```

Add getter at bottom:
```typescript
export function getResources(): Resource[] {
  return resourcesData.resources as Resource[];
}
```

**Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 4: Commit**

```bash
git add src/lib/repo/resources.repo.ts src/lib/data-loader.ts
git commit -m "feat: add resources repository and data loader"
```

---

### Task 4: ResourceFormDialog component

**Files:**
- Create: `src/components/features/admin/ResourceFormDialog.tsx`

**Step 1: Create the form dialog**

Create `src/components/features/admin/ResourceFormDialog.tsx` following the exact pattern of `DocumentFormDialog.tsx`. Key differences:
- Uses `Resource` type instead of `ClientDocument`
- Category options: normes, reglementation, guides, rapports, veille
- Type options: pdf, lien, video (3 types instead of 2)
- Conditional fields: pdf → fileSize + url, lien → url, video → url + youtubeId
- Additional field: `source` (text input, optional)
- Two date fields: `publishedDate` and `createdAt` (auto-set to today on create)

```typescript
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";

interface ResourceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Resource, "id">) => void;
  initialData?: Resource | null;
}

const EMPTY: Omit<Resource, "id"> = {
  title: "",
  description: "",
  category: "normes",
  type: "pdf",
  url: "",
  source: "",
  publishedDate: new Date().toISOString().split("T")[0],
  createdAt: new Date().toISOString().split("T")[0],
};

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  normes: "Normes",
  reglementation: "Réglementation",
  guides: "Guides techniques",
  rapports: "Rapports",
  veille: "Veille réglementaire",
};

const TYPE_LABELS: Record<ResourceType, string> = {
  pdf: "PDF",
  lien: "Lien externe",
  video: "Vidéo",
};

export function ResourceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ResourceFormDialogProps) {
  const [form, setForm] = useState<Omit<Resource, "id">>(EMPTY);

  useEffect(() => {
    if (open) {
      if (initialData) {
        const { id: _, ...rest } = initialData;
        setForm(rest);
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, initialData]);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier la ressource" : "Nouvelle ressource"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={form.type}
                onChange={(e) => {
                  const t = e.target.value as ResourceType;
                  setForm((prev) => ({
                    ...prev,
                    type: t,
                    fileSize: t === "pdf" ? prev.fileSize : undefined,
                    youtubeId: t === "video" ? prev.youtubeId : undefined,
                  }));
                }}
              >
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>URL{form.type === "lien" ? " du site" : form.type === "pdf" ? " du fichier" : " de la vidéo"}</Label>
            <Input
              placeholder={form.type === "lien" ? "https://..." : form.type === "pdf" ? "/resources/fichier.pdf" : "https://youtube.com/..."}
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              required
            />
          </div>

          {form.type === "pdf" && (
            <div className="space-y-2">
              <Label>Taille du fichier</Label>
              <Input
                placeholder="ex: 2.5 MB"
                value={form.fileSize ?? ""}
                onChange={(e) => set("fileSize", e.target.value)}
              />
            </div>
          )}

          {form.type === "video" && (
            <div className="space-y-2">
              <Label>YouTube ID</Label>
              <Input
                placeholder="ex: dQw4w9WgXcQ"
                value={form.youtubeId ?? ""}
                onChange={(e) => set("youtubeId", e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Source</Label>
            <Input
              placeholder="ex: AFNOR, Légifrance, CETé"
              value={form.source ?? ""}
              onChange={(e) => set("source", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de publication</Label>
              <Input
                type="date"
                value={form.publishedDate}
                onChange={(e) => set("publishedDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Date d&apos;ajout</Label>
              <Input
                type="date"
                value={form.createdAt}
                onChange={(e) => set("createdAt", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {initialData ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/components/features/admin/ResourceFormDialog.tsx
git commit -m "feat: add ResourceFormDialog component"
```

---

### Task 5: Admin resources page

**Files:**
- Create: `src/app/admin/ressources/page.tsx`

**Step 1: Create the admin page**

Create `src/app/admin/ressources/page.tsx` following the exact pattern of `src/app/admin/documents/page.tsx`. Key differences:
- Uses `Resource` type and `resources.repo` functions
- Category labels: normes→Normes, reglementation→Réglementation, guides→Guides techniques, rapports→Rapports, veille→Veille réglementaire
- Type badges: pdf (red, FileText icon), lien (blue, ExternalLink icon), video (purple, Video icon)
- Shows `source` in the resource column
- Filter dropdowns: search + category + type (no visibility filter)

```typescript
"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Video,
  ExternalLink,
  Search,
  Library,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";
import {
  listResources,
  createResource,
  updateResource,
  deleteResource,
} from "@/lib/repo/resources.repo";
import { ResourceFormDialog } from "@/components/features/admin/ResourceFormDialog";

const categoryLabels: Record<ResourceCategory, string> = {
  normes: "Normes",
  reglementation: "Réglementation",
  guides: "Guides techniques",
  rapports: "Rapports",
  veille: "Veille réglementaire",
};

const typeLabels: Record<ResourceType, string> = {
  pdf: "PDF",
  lien: "Lien",
  video: "Vidéo",
};

const typeConfig: Record<ResourceType, { icon: typeof FileText; color: string }> = {
  pdf: { icon: FileText, color: "bg-red-100 text-red-600" },
  lien: { icon: ExternalLink, color: "bg-blue-100 text-blue-600" },
  video: { icon: Video, color: "bg-purple-100 text-purple-600" },
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState(listResources);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterType, setFilterType] = useState("");

  const refresh = useCallback(() => setResources(listResources()), []);

  const handleCreate = (data: Omit<Resource, "id">) => {
    createResource(data);
    refresh();
    toast.success("Ressource créée");
  };

  const handleUpdate = (data: Omit<Resource, "id">) => {
    if (editing) {
      updateResource(editing.id, data);
      refresh();
      toast.success("Ressource modifiée");
    }
  };

  const handleDelete = (id: string) => {
    deleteResource(id);
    refresh();
    toast.success("Ressource supprimée");
  };

  const filtered = resources.filter((r) => {
    if (
      search &&
      !r.title.toLowerCase().includes(search.toLowerCase()) &&
      !r.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterCat && r.category !== filterCat) return false;
    if (filterType && r.type !== filterType) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ressources</h1>
          <p className="text-muted-foreground">
            Bibliothèque technique et réglementaire
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une ressource
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Rechercher par titre ou description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="">Toutes catégories</option>
          {Object.entries(categoryLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Tous types</option>
          {Object.entries(typeLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Library className="h-4 w-4" />
        {filtered.length} ressource{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Ressource
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Catégorie
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((res) => {
              const tc = typeConfig[res.type];
              const Icon = tc.icon;
              return (
                <tr key={res.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${tc.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground line-clamp-1">
                          {res.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {res.description}
                          {res.source && (
                            <span className="ml-1 text-foreground/60">
                              — {res.source}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">
                      {categoryLabels[res.category]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        res.type === "pdf"
                          ? "outline"
                          : res.type === "lien"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {typeLabels[res.type]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {res.publishedDate}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(res);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(res.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Aucune ressource trouvée
          </div>
        )}
      </div>

      <ResourceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
      />
    </div>
  );
}
```

**Step 2: Verify the page renders**

Run: `npm run dev` and navigate to `/admin/ressources`
Expected: page loads with table of 10 mock resources

**Step 3: Commit**

```bash
git add src/app/admin/ressources/page.tsx
git commit -m "feat: add admin resources page with CRUD"
```

---

### Task 6: Client resources page

**Files:**
- Create: `src/app/client/ressources/page.tsx`

**Step 1: Create the client page**

Create `src/app/client/ressources/page.tsx`. This is a read-only page with card grid layout, search, and category/type filters. Actions: "Télécharger" for PDF, "Ouvrir" for links, embedded YouTube player for videos.

```typescript
"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  ExternalLink,
  Video,
  Download,
  Library,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";
import { listResources } from "@/lib/repo/resources.repo";

const categoryLabels: Record<ResourceCategory, string> = {
  normes: "Normes",
  reglementation: "Réglementation",
  guides: "Guides techniques",
  rapports: "Rapports",
  veille: "Veille réglementaire",
};

const typeLabels: Record<ResourceType, string> = {
  pdf: "PDF",
  lien: "Lien",
  video: "Vidéo",
};

const typeConfig: Record<ResourceType, { icon: typeof FileText; color: string }> = {
  pdf: { icon: FileText, color: "bg-red-100 text-red-600" },
  lien: { icon: ExternalLink, color: "bg-blue-100 text-blue-600" },
  video: { icon: Video, color: "bg-purple-100 text-purple-600" },
};

export default function ClientResourcesPage() {
  const [resources] = useState(listResources);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterType, setFilterType] = useState("");

  const filtered = resources.filter((r) => {
    if (
      search &&
      !r.title.toLowerCase().includes(search.toLowerCase()) &&
      !r.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterCat && r.category !== filterCat) return false;
    if (filterType && r.type !== filterType) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Library className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bibliothèque technique et réglementaire
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} ressource{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Rechercher par titre ou description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="">Toutes catégories</option>
          {Object.entries(categoryLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Tous types</option>
          {Object.entries(typeLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white p-12 text-center">
          <Library className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Aucune ressource trouvée
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const tc = typeConfig[resource.type];
  const Icon = tc.icon;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white">
      {/* Video embed */}
      {resource.type === "video" && resource.youtubeId && (
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${resource.youtubeId}`}
            title={resource.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        {/* Header */}
        <div className="mb-2 flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tc.color}`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-medium text-foreground line-clamp-2">
              {resource.title}
            </p>
            {resource.source && (
              <p className="text-xs text-muted-foreground">{resource.source}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mb-3 flex-1 text-sm text-muted-foreground line-clamp-3">
          {resource.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {categoryLabels[resource.category]}
            </Badge>
            {resource.fileSize && (
              <span className="text-xs text-muted-foreground">
                {resource.fileSize}
              </span>
            )}
          </div>

          {resource.type === "pdf" && (
            <Button size="sm" variant="outline" asChild>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <Download className="mr-1 h-3 w-3" />
                Télécharger
              </a>
            </Button>
          )}
          {resource.type === "lien" && (
            <Button size="sm" variant="outline" asChild>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" />
                Ouvrir
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify the page renders**

Run: `npm run dev` and navigate to `/client/ressources`
Expected: card grid showing resources with search and filters working

**Step 3: Commit**

```bash
git add src/app/client/ressources/page.tsx
git commit -m "feat: add client resources page with card grid"
```

---

### Task 7: Update navigation (admin + client layouts)

**Files:**
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/components/features/client/ClientSidebar.tsx`

**Step 1: Add "Ressources" to admin sidebar**

In `src/app/admin/layout.tsx`:

1. Add `Library` to the Lucide imports (line 7 area)
2. Add new entry to `sidebarItems` array after "Documents":

```typescript
{ label: "Ressources", href: "/admin/ressources", icon: Library },
```

The full array should be:
```typescript
const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Documents", href: "/admin/documents", icon: FolderOpen },
  { label: "Ressources", href: "/admin/ressources", icon: Library },
  { label: "Utilisateurs", href: "/admin/users", icon: Users },
  { label: "Paramètres", href: "/admin/settings", icon: Settings },
];
```

**Step 2: Add "Ressources" to client sidebar**

In `src/components/features/client/ClientSidebar.tsx`:

1. Add `Library` to the Lucide imports
2. Add new entry to `navItems` array at the end:

```typescript
{ label: "Ressources", href: "/client/ressources", icon: Library },
```

**Step 3: Verify navigation works**

Run: `npm run dev`
- Navigate to admin → verify "Ressources" appears in sidebar and links to `/admin/ressources`
- Navigate to client → verify "Ressources" appears in sidebar and links to `/client/ressources`

**Step 4: Commit**

```bash
git add src/app/admin/layout.tsx src/components/features/client/ClientSidebar.tsx
git commit -m "feat: add Ressources link to admin and client navigation"
```

---

### Task 8: Final verification

**Step 1: Run linter**

Run: `npm run lint`
Expected: no errors

**Step 2: Run line limit check**

Run: `npm run lint:lines`
Expected: all new files under 250 lines

**Step 3: Run build**

Run: `npm run build`
Expected: successful build with no errors

**Step 4: Manual smoke test**

1. Login as admin (`admin@cete.fr` / `Admin2026`)
2. Click "Ressources" in sidebar → verify table with 10 resources
3. Test search filter → type "NF C" → verify only matching resources shown
4. Test category filter → select "Normes" → verify filtering works
5. Test type filter → select "Lien" → verify only links shown
6. Click "Ajouter une ressource" → fill form → submit → verify toast + row added
7. Click edit on a resource → modify title → save → verify toast + change visible
8. Click delete → verify toast + row removed
9. Login as client (`demo@cete.fr` / `Cete2026`)
10. Click "Ressources" in sidebar → verify card grid
11. Test search and filters work
12. Verify "Télécharger" button on PDF cards
13. Verify "Ouvrir" button on link cards
14. Verify YouTube embed on video cards

**Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address lint/build issues in resources library"
```
