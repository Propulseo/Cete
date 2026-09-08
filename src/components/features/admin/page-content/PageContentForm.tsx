"use client";

import { useEffect, useState } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CoverImageField } from "@/components/features/admin/blog/CoverImageField";
import {
  getPageOverrides,
  setPageOverrideText,
  clearPageOverride,
  uploadPageImage,
} from "@/lib/repo/page-content.repo";
import { getPageSchema, getPageFieldDefault } from "@/lib/page-content";
import type { PageOverridesMap } from "@/types";

export function PageContentForm({ pageKey }: { pageKey: string }) {
  const fields = getPageSchema(pageKey);
  const [overrides, setOverrides] = useState<PageOverridesMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File | null>>({});

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPageOverrides(pageKey)
      .then((data) => {
        if (active) setOverrides(data);
      })
      .catch(() => {
        if (active) {
          setOverrides({});
          toast.error("Impossible de charger le contenu personnalisé (le texte par défaut reste affiché)");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [pageKey]);

  const handleSaveText = async (fieldKey: string, value: string) => {
    setSaving(fieldKey);
    try {
      await setPageOverrideText(pageKey, fieldKey, value);
      setOverrides((prev) => ({ ...prev, [fieldKey]: { fr: value, en: prev[fieldKey]?.en ?? value } }));
      toast.success("Enregistré");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(null);
    }
  };

  const handleSaveImage = async (fieldKey: string) => {
    const file = pendingFiles[fieldKey];
    if (!file) return;
    setSaving(fieldKey);
    try {
      const url = await uploadPageImage(pageKey, file);
      await setPageOverrideText(pageKey, fieldKey, url);
      setOverrides((prev) => ({ ...prev, [fieldKey]: { fr: url, en: url } }));
      setPendingFiles((prev) => ({ ...prev, [fieldKey]: null }));
      toast.success("Image mise à jour");
    } catch {
      toast.error("Erreur lors du téléversement");
    } finally {
      setSaving(null);
    }
  };

  const handleReset = async (fieldKey: string) => {
    setSaving(fieldKey);
    try {
      await clearPageOverride(pageKey, fieldKey);
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
      toast.success("Revenu au texte par défaut");
    } catch {
      toast.error("Erreur lors de la réinitialisation");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {fields.map((field) => {
        const current = overrides[field.key]?.fr ?? "";
        const isCustomized = current.trim() !== "";
        return (
          <div key={field.key} className="space-y-2 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <Label>{field.label}</Label>
              {isCustomized && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReset(field.key)}
                  disabled={saving === field.key}
                >
                  <RotateCcw className="mr-2 h-3.5 w-3.5" strokeWidth={1.75} />
                  Revenir au texte par défaut
                </Button>
              )}
            </div>

            {field.type === "image" ? (
              <div className="space-y-2">
                <CoverImageField
                  file={pendingFiles[field.key] ?? null}
                  onFileChange={(file) => setPendingFiles((prev) => ({ ...prev, [field.key]: file }))}
                  currentUrl={current || null}
                  onClearCurrent={() => handleReset(field.key)}
                />
                {pendingFiles[field.key] && (
                  <Button size="sm" onClick={() => handleSaveImage(field.key)} disabled={saving === field.key}>
                    <Save className="mr-2 h-4 w-4" strokeWidth={1.75} />
                    Téléverser et enregistrer
                  </Button>
                )}
              </div>
            ) : field.type === "textarea" ? (
              <FieldTextarea
                value={current}
                placeholder={field.defaultValue ?? getPageFieldDefault(pageKey, field.key)}
                onSave={(v) => handleSaveText(field.key, v)}
                saving={saving === field.key}
              />
            ) : (
              <FieldInput
                value={current}
                placeholder={field.defaultValue ?? getPageFieldDefault(pageKey, field.key)}
                onSave={(v) => handleSaveText(field.key, v)}
                saving={saving === field.key}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldInput({
  value,
  placeholder,
  onSave,
  saving,
}: {
  value: string;
  placeholder: string;
  onSave: (v: string) => void;
  saving: boolean;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <div className="flex gap-2">
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder || "Texte par défaut si vide"}
      />
      <Button size="sm" onClick={() => onSave(draft)} disabled={saving || draft === value}>
        <Save className="h-4 w-4" strokeWidth={1.75} />
      </Button>
    </div>
  );
}

function FieldTextarea({
  value,
  placeholder,
  onSave,
  saving,
}: {
  value: string;
  placeholder: string;
  onSave: (v: string) => void;
  saving: boolean;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <div className="space-y-2">
      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        placeholder={placeholder || "Texte par défaut si vide"}
      />
      <Button size="sm" onClick={() => onSave(draft)} disabled={saving || draft === value}>
        <Save className="mr-2 h-4 w-4" strokeWidth={1.75} />
        Enregistrer
      </Button>
    </div>
  );
}
