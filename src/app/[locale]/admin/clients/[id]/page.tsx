"use client";

import { useState, useEffect } from "react";
import { CalendarClock, Shield, Building2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useClient } from "@/components/features/admin/clients/ClientContext";
import { listEvaluationsByClientId } from "@/lib/repo/evaluations.repo";
import { listContractDocumentsByClientId } from "@/lib/repo/contract-documents.repo";
import type { Evaluation, ContractDocument } from "@/types/client";
import { RatingSeal, CompositeRating } from "@/components/features/admin/ui/rating-seal";
import { ClientAccessCard } from "@/components/features/admin/clients/ClientAccessCard";

export default function ClientOverviewPage() {
  const client = useClient();
  const t = useTranslations("admin.clients.overview");
  const tStatus = useTranslations("admin.clients.status");
  const tDoc = useTranslations("admin.clients.documents");
  const [evals, setEvals] = useState<Evaluation[]>([]);
  const [docs, setDocs] = useState<ContractDocument[]>([]);

  useEffect(() => {
    listEvaluationsByClientId(client.id).then(setEvals);
    listContractDocumentsByClientId(client.id).then(setDocs);
  }, [client.id]);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const lastCompleted = evals.filter((e) => e.status === "completed").sort((a, b) => b.visitDate.localeCompare(a.visitDate))[0];
  const nextScheduled = evals.filter((e) => e.status === "scheduled").sort((a, b) => a.visitDate.localeCompare(b.visitDate))[0];
  const recentDocs = [...docs].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)).slice(0, 3);
  const primary = client.contacts.find((c) => c.isPrimary);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><CalendarClock className="h-4 w-4" />{t("contractStatus")}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">{t("start")}</span><span className="font-medium">{fmtDate(client.contractStartDate)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t("end")}</span><span className="font-medium">{client.contractEndDate ? fmtDate(client.contractEndDate) : t("tacitRenewal")}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Statut</span><span className="font-medium">{tStatus(client.status)}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Shield className="h-4 w-4" />{t("lastEval")}</CardTitle></CardHeader>
        <CardContent>
          {lastCompleted ? (
            <div className="flex items-center gap-4">
              {lastCompleted.vigiScore && <RatingSeal value={lastCompleted.vigiScore} size="hero" serif />}
              <div className="text-sm">
                <p className="font-medium">{lastCompleted.siteName}</p>
                <p className="text-muted-foreground">{fmtDate(lastCompleted.visitDate)}</p>
                {lastCompleted.compositeRating && <CompositeRating value={lastCompleted.compositeRating} className="mt-1.5" />}
              </div>
            </div>
          ) : <p className="text-sm text-muted-foreground">{t("noEvalCompleted")}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><CalendarClock className="h-4 w-4" />{t("nextEval")}</CardTitle></CardHeader>
        <CardContent>
          {nextScheduled ? (
            <div className="text-sm">
              <p className="font-medium">{nextScheduled.siteName}</p>
              <p className="text-muted-foreground">{fmtDate(nextScheduled.visitDate)}</p>
            </div>
          ) : <p className="text-sm text-muted-foreground">{t("noEvalScheduled")}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-4 w-4" />{t("companyInfo")}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">SIRET</span><span className="font-mono">{client.siret}</span></div>
          {client.headcount && <div className="flex justify-between"><span className="text-muted-foreground">Effectif</span><span>{client.headcount}</span></div>}
          {primary && <div className="flex justify-between"><span className="text-muted-foreground">{t("primaryContact")}</span><span>{primary.firstName} {primary.lastName}</span></div>}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4" />{t("recentDocs")}</CardTitle></CardHeader>
        <CardContent>
          {recentDocs.length > 0 ? (
            <div className="divide-y">
              {recentDocs.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-2">
                  <div><p className="text-sm font-medium">{d.title}</p><p className="text-xs text-muted-foreground">{fmtDate(d.uploadedAt)}</p></div>
                  <Badge variant="outline">{tDoc(`types.${d.type}`)}</Badge>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground">{t("noDocs")}</p>}
        </CardContent>
      </Card>

      <ClientAccessCard clientId={client.id} companyName={client.companyName} />
    </div>
  );
}
