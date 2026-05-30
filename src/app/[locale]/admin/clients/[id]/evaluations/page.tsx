"use client";

import { useState, useEffect } from "react";
import { Plus, CheckCircle, Calendar, User, MapPin, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useClient } from "@/components/features/admin/clients/ClientContext";
import { listEvaluationsByClientId, createEvaluation, updateEvaluation } from "@/lib/repo/evaluations.repo";
import { createContractDocument } from "@/lib/repo/contract-documents.repo";
import { listAllFounders } from "@/lib/repo/founders.repo";
import type { Evaluation } from "@/types/client";
import type { Founder } from "@/types/founder";
import { RatingSeal, CompositeRating } from "@/components/features/admin/ui/rating-seal";
import { StatusBadge } from "@/components/features/admin/ui/status-badge";
import { CertificateFormDialog, type CertificateDefaults } from "@/components/features/admin/CertificateFormDialog";
import { CompleteEvaluationDialog, type CompleteResult } from "@/components/features/admin/clients/CompleteEvaluationDialog";

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm";

export default function ClientEvaluationsPage() {
  const client = useClient();
  const t = useTranslations("admin.clients.evaluations");
  const [evals, setEvals] = useState<Evaluation[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState<Evaluation | null>(null);

  // Schedule form
  const [siteName, setSiteName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [auditorId, setAuditorId] = useState("");
  const [schedNotes, setSchedNotes] = useState("");

  const [certTarget, setCertTarget] = useState<Evaluation | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listEvaluationsByClientId(client.id), listAllFounders()]).then(
      ([e, f]) => {
        if (!cancelled) {
          setEvals(e.sort((a, b) => b.visitDate.localeCompare(a.visitDate)));
          setFounders(f);
        }
      },
    );
    return () => { cancelled = true; };
  }, [client.id, refreshKey]);

  const reload = () => setRefreshKey((k) => k + 1);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const getAuditorName = (id: string) => founders.find((f) => f.id === id)?.name ?? id;

  const openSchedule = () => {
    setSiteName(client.companyName);
    setSiteAddress(`${client.address.street}, ${client.address.postalCode} ${client.address.city}`);
    setVisitDate(""); setAuditorId(founders[0]?.id ?? "1"); setSchedNotes("");
    setScheduleOpen(true);
  };

  const handleSchedule = async () => {
    await createEvaluation({
      clientId: client.id, siteName, siteAddress, visitDate, auditorId, status: "scheduled", notes: schedNotes || undefined,
    });
    setScheduleOpen(false);
    reload();
  };

  const openComplete = (ev: Evaluation) => setCompleteTarget(ev);

  const handleComplete = async (result: CompleteResult) => {
    if (!completeTarget) return;
    const { vigiScore, omtScore } = result;
    const compositeRating = `${omtScore.autoEvaluation[0] ?? ""}${omtScore.recommandation[0] ?? ""}${omtScore.gestesMetiers[0] ?? ""}`;

    // Emplacement de rapport (brouillon, sans fichier) : l'admin y dépose ensuite
    // le vrai PDF via l'onglet Documents. Plus de fichier fictif à taille aléatoire.
    const reportDoc = await createContractDocument({
      clientId: client.id, type: "report", title: `Rapport d'évaluation — ${completeTarget.siteName}`,
      version: 1, fileName: "", fileSize: 0,
      mimeType: "application/pdf", uploadedAt: new Date().toISOString(), uploadedBy: "", status: "draft",
      notes: `Vigi-Score: ${vigiScore} | Composite: ${compositeRating} — déposer le PDF du rapport.`,
    });

    const nextDue = new Date(completeTarget.visitDate);
    nextDue.setFullYear(nextDue.getFullYear() + 1);

    await updateEvaluation(completeTarget.id, {
      status: "completed", vigiScore, omtScore,
      compositeRating, reportDocumentId: reportDoc.id,
      nextEvaluationDue: nextDue.toISOString().split("T")[0],
      notes: result.notes || completeTarget.notes,
    });
    setCompleteTarget(null);
    reload();
  };

  const buildCertDefaults = (ev: Evaluation): CertificateDefaults => {
    const year = (ev.visitDate || "").slice(0, 4) || "";
    const validity = ev.visitDate ? new Date(ev.visitDate) : new Date();
    validity.setFullYear(validity.getFullYear() + 3);
    return {
      certificateNumber: `CETE-${year}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
      companyName: client.companyName,
      siren: client.siret.replace(/\s/g, "").slice(0, 9),
      address: `${client.address.street}, ${client.address.postalCode} ${client.address.city}`,
      compositeRating: ev.compositeRating ?? "",
      vigiScore: ev.vigiScore ?? "B",
      vigiScoreTendance: "",
      subCriteria: ev.omtScore ?? { autoEvaluation: "", recommandation: "", gestesMetiers: "" },
      evaluationDate: ev.visitDate,
      validityDate: validity.toISOString().split("T")[0],
      expertName: getAuditorName(ev.auditorId),
      status: "valide",
    };
  };

  const handleCertCreated = () => {
    // Le lien évaluation→certificat est posé côté serveur par createCertificateAction.
    setCertTarget(null);
    reload();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <Button onClick={openSchedule}><Plus className="mr-2 h-4 w-4" />{t("schedule")}</Button>
      </div>

      {evals.length === 0 ? (
        <div className="rounded-[10px] border bg-card p-12 text-center text-sm text-muted-foreground">{t("empty")}</div>
      ) : (
        <div className="space-y-4">
          {evals.map((ev) => (
            <Card key={ev.id}>
              <CardContent className="flex items-start gap-6 p-5">
                {ev.vigiScore ? (
                  <RatingSeal value={ev.vigiScore} size="hero" serif className="shrink-0" />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 text-xs text-muted-foreground">N/A</div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold">{ev.siteName}</h3>
                    <StatusBadge status={ev.status}>{t(`status.${ev.status}`)}</StatusBadge>
                    {ev.compositeRating && <CompositeRating value={ev.compositeRating} />}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{fmtDate(ev.visitDate)}</span>
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{getAuditorName(ev.auditorId)}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{ev.siteAddress}</span>
                  </div>
                  {ev.omtScore && (
                    <div className="mt-2 flex gap-3 text-xs">
                      <span>{t("autoEval")}: <strong>{ev.omtScore.autoEvaluation}</strong></span>
                      <span>{t("requirements")}: <strong>{ev.omtScore.recommandation}</strong></span>
                      <span>{t("operational")}: <strong>{ev.omtScore.gestesMetiers}</strong></span>
                    </div>
                  )}
                  {ev.nextEvaluationDue && <p className="mt-1 text-xs text-muted-foreground">{t("nextDue")}: {fmtDate(ev.nextEvaluationDue)}</p>}
                  {ev.notes && <p className="mt-2 text-sm text-muted-foreground">{ev.notes}</p>}
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  {(ev.status === "scheduled" || ev.status === "in_progress") && (
                    <Button size="sm" onClick={() => openComplete(ev)}><CheckCircle className="mr-1.5 h-3.5 w-3.5" />{t("complete")}</Button>
                  )}
                  {ev.status === "completed" && !ev.certificateId && (
                    <Button size="sm" variant="outline" onClick={() => setCertTarget(ev)}><Award className="mr-1.5 h-3.5 w-3.5" />Déposer le certificat</Button>
                  )}
                  {ev.status === "completed" && ev.certificateId && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-admin-pos"><Award className="h-3.5 w-3.5" />Certificat déposé</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{t("schedule")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("siteName")}</Label>
              <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t("siteAddress")}</Label>
                <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setSiteAddress(`${client.address.street}, ${client.address.postalCode} ${client.address.city}`)}>{t("copyAddress")}</Button>
              </div>
              <Input value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("visitDate")}</Label><Input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>{t("auditor")}</Label>
                <select className={selectClass} value={auditorId} onChange={(e) => setAuditorId(e.target.value)}>
                  {founders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2"><Label>{t("notes")}</Label><Textarea rows={2} value={schedNotes} onChange={(e) => setSchedNotes(e.target.value)} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setScheduleOpen(false)}>Annuler</Button>
              <Button onClick={handleSchedule} disabled={!siteName || !visitDate}>Planifier</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CompleteEvaluationDialog
        target={completeTarget}
        onOpenChange={(v) => { if (!v) setCompleteTarget(null); }}
        onSubmit={handleComplete}
      />

      {/* Certificate deposit */}
      {certTarget && (
        <CertificateFormDialog
          open={!!certTarget}
          onOpenChange={(v) => { if (!v) setCertTarget(null); }}
          clientId={client.id}
          evaluationId={certTarget.id}
          defaults={buildCertDefaults(certTarget)}
          onCreated={handleCertCreated}
        />
      )}
    </div>
  );
}
