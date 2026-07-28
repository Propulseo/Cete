"use client";

import { useState, useEffect } from "react";
import { Loader2, Award } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { FileUploadField } from "@/components/features/admin/ui/FileUploadField";
import { createCertificateAction } from "@/app/actions/certificates";
import { CertificateCard } from "@/components/features/client/CertificateCard";
import type { CertificateData, CertificateStatus } from "@/types/certificate";
import type { VigiScoreGrade } from "@/types/client";

export interface CertificateDefaults {
  certificateNumber: string;
  companyName: string;
  siren: string;
  address: string;
  compositeRating: string;
  vigiScore: VigiScoreGrade;
  vigiScoreTendance: "+" | "-" | "";
  subCriteria: { autoEvaluation: string; recommandation: string; gestesMetiers: string };
  evaluationDate: string;
  validityDate: string;
  expertName: string;
  status: CertificateStatus;
}

interface CertificateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  /** Évaluation à rattacher au certificat (evaluations.certificate_id), le cas échéant. */
  evaluationId?: string;
  defaults: CertificateDefaults;
  onCreated: (certId: string) => void;
}

const VIGI: VigiScoreGrade[] = ["A", "B", "C", "D"];
const STATUSES: CertificateStatus[] = ["valide", "expire", "revoque"];

export function CertificateFormDialog({
  open,
  onOpenChange,
  clientId,
  evaluationId,
  defaults,
  onCreated,
}: CertificateFormDialogProps) {
  const [form, setForm] = useState<CertificateDefaults>(defaults);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(defaults);
      setFile(null);
    }
  }, [open, defaults]);

  const set = <K extends keyof CertificateDefaults>(key: K, value: CertificateDefaults[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // La note composite EST, par définition, les 3 premières lettres des notes 3C → dérivée
  // automatiquement (jamais saisie à la main) pour qu'elle ne puisse pas diverger du détail.
  const composite = `${(form.subCriteria.autoEvaluation[0] ?? "").toUpperCase()}${(form.subCriteria.recommandation[0] ?? "").toUpperCase()}${(form.subCriteria.gestesMetiers[0] ?? "").toUpperCase()}`;
  const compositeValid = /^[A-D]{3}$/.test(composite);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compositeValid) {
      toast.error("Chaque note 3C doit commencer par une lettre A–D (ex. B, A-, C+).");
      return;
    }
    setSaving(true);
    try {
      // Le fichier (optionnel) part en FormData ; les métadonnées en objet. L'écriture
      // privilégiée (upload + insert + lien évaluation) se fait côté serveur en service-role
      // après assertAdmin → robuste à l'état de session, erreur claire si non-admin.
      let formData: FormData | null = null;
      if (file) {
        formData = new FormData();
        formData.append("file", file);
      }
      const { id } = await createCertificateAction(
        {
          clientId,
          evaluationId,
          certificateNumber: form.certificateNumber,
          companyName: form.companyName,
          siren: form.siren,
          address: form.address,
          compositeRating: composite,
          vigiScore: form.vigiScore,
          vigiScoreTendance: form.vigiScoreTendance,
          subCriteria: form.subCriteria,
          evaluationDate: form.evaluationDate,
          validityDate: form.validityDate,
          expertName: form.expertName,
          status: form.status,
        },
        formData,
      );
      onCreated(id);
      onOpenChange(false);
      toast.success("Certificat déposé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec du dépôt du certificat");
    } finally {
      setSaving(false);
    }
  };

  // Aperçu live : la fiche EXACTE que le client verra dans « Ma notation », alimentée par le
  // formulaire en temps réel. L'admin remplit tout à gauche et voit le rendu client à droite.
  const draft: CertificateData = {
    id: "preview",
    certificateNumber: form.certificateNumber || "—",
    clientId,
    companyName: form.companyName,
    siren: form.siren,
    address: form.address,
    compositeRating: compositeValid ? composite : "—",
    vigiScore: form.vigiScore,
    vigiScoreTendance: form.vigiScoreTendance,
    subCriteria: form.subCriteria,
    evaluationDate: form.evaluationDate,
    validityDate: form.validityDate,
    expertName: form.expertName,
    status: form.status,
    createdAt: new Date().toISOString(),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" strokeWidth={1.75} />
            Déposer le certificat
          </DialogTitle>
          <DialogDescription>
            Vous remplissez chaque champ à gauche ; l&apos;aperçu de droite est la fiche exacte que le client verra dans « Ma notation ».
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Raison sociale (telle qu&apos;affichée au client)</Label>
            <Input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>N° de certificat</Label>
              <Input value={form.certificateNumber} onChange={(e) => set("certificateNumber", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Expert / auditeur</Label>
              <Input value={form.expertName} onChange={(e) => set("expertName", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>SIREN</Label>
              <Input value={form.siren} onChange={(e) => set("siren", e.target.value)} inputMode="numeric" />
            </div>
            <div className="space-y-2">
              <Label>Adresse (snapshot)</Label>
              <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
            </div>
          </div>

          {/* Vigi-Score / Tendance / Composite : trois champs très courts, ils tiennent
              côte à côte dès 480px (grid-cols-3 direct, sans passer par une colonne). */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="space-y-2">
              <Label>Vigi-Score</Label>
              <NativeSelect value={form.vigiScore} onChange={(e) => set("vigiScore", e.target.value as VigiScoreGrade)}>
                {VIGI.map((v) => <option key={v} value={v}>{v}</option>)}
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label>Tendance</Label>
              <NativeSelect value={form.vigiScoreTendance} onChange={(e) => set("vigiScoreTendance", e.target.value as "+" | "-" | "")}>
                <option value="">=</option>
                <option value="+">+</option>
                <option value="-">−</option>
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label>Composite</Label>
              <div className="flex h-11 items-center rounded-md border border-dashed border-input px-3 text-sm font-semibold tabular-nums text-foreground sm:h-9">
                {compositeValid ? composite : "—"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs">Auto-évaluation</Label>
              <Input value={form.subCriteria.autoEvaluation} onChange={(e) => set("subCriteria", { ...form.subCriteria, autoEvaluation: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Recommandation</Label>
              <Input value={form.subCriteria.recommandation} onChange={(e) => set("subCriteria", { ...form.subCriteria, recommandation: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Gestes métiers</Label>
              <Input value={form.subCriteria.gestesMetiers} onChange={(e) => set("subCriteria", { ...form.subCriteria, gestesMetiers: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Date d&apos;évaluation</Label>
              <Input type="date" value={form.evaluationDate} onChange={(e) => set("evaluationDate", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Validité</Label>
              <Input type="date" value={form.validityDate} onChange={(e) => set("validityDate", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <NativeSelect value={form.status} onChange={(e) => set("status", e.target.value as CertificateStatus)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </NativeSelect>
            </div>
          </div>

          <div className="space-y-2">
            <Label>PDF du certificat (optionnel)</Label>
            <FileUploadField file={file} onFileChange={setFile} accept="application/pdf" label="Déposer le PDF signé" disabled={saving} />
            <p className="text-xs text-muted-foreground">
              Sans PDF, le client télécharge un certificat généré automatiquement.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Annuler</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.75} />}
              Déposer
            </Button>
          </div>
        </form>

        {/* Aperçu client (lecture seule) — exactement la fiche « Ma notation ». */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            Aperçu côté client
          </p>
          <CertificateCard certificates={[draft]} preview />
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
