"use client";

import { useState, useEffect } from "react";
import { Plus, CheckCircle, Calendar, User, MapPin } from "lucide-react";
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
import type { Evaluation, VigiScoreGrade } from "@/types/client";
import type { Founder } from "@/types/founder";
import { RatingSeal, CompositeRating } from "@/components/features/admin/ui/rating-seal";
import { StatusBadge } from "@/components/features/admin/ui/status-badge";

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm";
const VIGI_VAR: Record<string, string> = { A: "--vigi-a-fill", B: "--vigi-b-fill", C: "--vigi-c-fill", D: "--vigi-d-fill" };
const GRADES: VigiScoreGrade[] = ["A", "B", "C", "D"];

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

  // Complete form
  const [vigiScore, setVigiScore] = useState<VigiScoreGrade>("B");
  const [autoEval, setAutoEval] = useState("B");
  const [reqScore, setReqScore] = useState("B");
  const [opScore, setOpScore] = useState("B");
  const [completeNotes, setCompleteNotes] = useState("");
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

  const openComplete = (ev: Evaluation) => {
    setCompleteTarget(ev); setVigiScore("B"); setAutoEval("B"); setReqScore("B"); setOpScore("B"); setCompleteNotes("");
  };

  const handleComplete = async () => {
    if (!completeTarget) return;
    const compositeRating = `${autoEval[0]}${reqScore[0]}${opScore[0]}`;

    const reportDoc = await createContractDocument({
      clientId: client.id, type: "report", title: `Rapport evaluation ${completeTarget.siteName}`,
      version: 1, fileName: `rapport-${client.slug}-${completeTarget.visitDate}.pdf`, fileSize: Math.floor(Math.random() * 1000000) + 500000,
      mimeType: "application/pdf", uploadedAt: new Date().toISOString(), uploadedBy: "adm-001", status: "signed",
      notes: `Vigi-Score: ${vigiScore} | Composite: ${compositeRating}`,
    });

    const nextDue = new Date(completeTarget.visitDate);
    nextDue.setFullYear(nextDue.getFullYear() + 1);

    await updateEvaluation(completeTarget.id, {
      status: "completed", vigiScore,
      omtScore: { autoEvaluation: autoEval, recommandation: reqScore, gestesMetiers: opScore },
      compositeRating, reportDocumentId: reportDoc.id,
      nextEvaluationDue: nextDue.toISOString().split("T")[0],
      notes: completeNotes || completeTarget.notes,
    });
    setCompleteTarget(null);
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
                <div className="shrink-0">
                  {(ev.status === "scheduled" || ev.status === "in_progress") && (
                    <Button size="sm" onClick={() => openComplete(ev)}><CheckCircle className="mr-1.5 h-3.5 w-3.5" />{t("complete")}</Button>
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

      {/* Complete Dialog */}
      <Dialog open={!!completeTarget} onOpenChange={(v) => { if (!v) setCompleteTarget(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{t("complete")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("vigiScore")}</Label>
              <div className="flex gap-2">
                {GRADES.map((g) => {
                  const selected = vigiScore === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setVigiScore(g)}
                      style={selected ? { backgroundColor: `var(${VIGI_VAR[g]})`, borderColor: `var(${VIGI_VAR[g]})`, color: "#fff" } : undefined}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold transition-all ${selected ? "ring-2 ring-primary ring-offset-1" : "border-muted text-foreground hover:bg-accent"}`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2"><Label className="text-xs">{t("autoEval")}</Label><Input value={autoEval} onChange={(e) => setAutoEval(e.target.value)} placeholder="B+" /></div>
              <div className="space-y-2"><Label className="text-xs">{t("requirements")}</Label><Input value={reqScore} onChange={(e) => setReqScore(e.target.value)} placeholder="A-" /></div>
              <div className="space-y-2"><Label className="text-xs">{t("operational")}</Label><Input value={opScore} onChange={(e) => setOpScore(e.target.value)} placeholder="B" /></div>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg bg-secondary/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">{t("compositeRating")}</p>
              <CompositeRating value={`${autoEval[0] ?? ""}${reqScore[0] ?? ""}${opScore[0] ?? ""}`} labels />
            </div>
            <div className="space-y-2"><Label>{t("notes")}</Label><Textarea rows={2} value={completeNotes} onChange={(e) => setCompleteNotes(e.target.value)} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setCompleteTarget(null)}>Annuler</Button>
              <Button onClick={handleComplete}>{t("complete")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
