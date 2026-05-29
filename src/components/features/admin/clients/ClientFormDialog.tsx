"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import type { Client, ClientLegalForm, ClientSector, ClientStatus } from "@/types/client";

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Client, "id" | "slug" | "createdAt" | "updatedAt">) => void;
}

const LEGAL_FORMS: ClientLegalForm[] = ["SAS", "SARL", "SA", "EURL", "SCI", "autre"];
const SECTORS: ClientSector[] = ["industrie", "tertiaire", "logistique", "medical", "erp_collectif", "immobilier", "autre"];
const STATUSES: ClientStatus[] = ["active", "onboarding", "paused"];

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm";

export function ClientFormDialog({ open, onOpenChange, onSubmit }: ClientFormDialogProps) {
  const t = useTranslations("admin.clients");
  const [companyName, setCompanyName] = useState("");
  const [legalForm, setLegalForm] = useState<ClientLegalForm>("SAS");
  const [siret, setSiret] = useState("");
  const [sector, setSector] = useState<ClientSector>("industrie");
  const [status, setStatus] = useState<ClientStatus>("onboarding");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [contractStart, setContractStart] = useState(new Date().toISOString().split("T")[0]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setCompanyName(""); setSiret(""); setStreet(""); setPostalCode(""); setCity("");
    setFirstName(""); setLastName(""); setRole(""); setEmail(""); setPhone("");
    setErrors({});
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!companyName.trim()) e.companyName = "Requis";
    if (!/^\d{14}$/.test(siret.replace(/\s/g, ""))) e.siret = "14 chiffres requis";
    if (!street.trim()) e.street = "Requis";
    if (!postalCode.trim()) e.postalCode = "Requis";
    if (!city.trim()) e.city = "Requis";
    if (!firstName.trim()) e.firstName = "Requis";
    if (!lastName.trim()) e.lastName = "Requis";
    if (!email.trim() || !email.includes("@")) e.email = "Email invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      companyName: companyName.trim(),
      legalForm,
      siret: siret.replace(/\s/g, ""),
      sector,
      status,
      address: { street: street.trim(), postalCode: postalCode.trim(), city: city.trim(), country: "FR" },
      contacts: [{ id: `contact-${Date.now()}`, firstName: firstName.trim(), lastName: lastName.trim(), role: role.trim(), email: email.trim(), phone: phone.trim(), isPrimary: true }],
      contractStartDate: contractStart,
      internalNotes: "",
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>{t("form.createTitle")}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("form.companyName")} *</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("form.legalForm")}</Label>
              <select className={selectClass} value={legalForm} onChange={(e) => setLegalForm(e.target.value as ClientLegalForm)}>
                {LEGAL_FORMS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{t("form.siret")} *</Label>
              <Input value={siret} onChange={(e) => setSiret(e.target.value)} placeholder="12345678901234" />
              {errors.siret && <p className="text-xs text-destructive">{errors.siret}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t("form.sector")}</Label>
              <select className={selectClass} value={sector} onChange={(e) => setSector(e.target.value as ClientSector)}>
                {SECTORS.map((s) => <option key={s} value={s}>{t(`sectors.${s}`)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{t("form.status")}</Label>
              <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value as ClientStatus)}>
                {STATUSES.map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{t("form.contractStart")}</Label>
              <Input type="date" value={contractStart} onChange={(e) => setContractStart(e.target.value)} />
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="mb-2 block font-semibold">{t("form.street")}</Label>
            <div className="space-y-2">
              <Input placeholder={t("form.street")} value={street} onChange={(e) => setStreet(e.target.value)} />
              {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input placeholder={t("form.postalCode")} value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode}</p>}
                </div>
                <div>
                  <Input placeholder={t("form.city")} value={city} onChange={(e) => setCity(e.target.value)} />
                  {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="mb-2 block font-semibold">{t("form.primaryContact")}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input placeholder={t("form.firstName")} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
              </div>
              <div className="space-y-1">
                <Input placeholder={t("form.lastName")} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
              </div>
            </div>
            <Input className="mt-2" placeholder={t("form.role")} value={role} onChange={(e) => setRole(e.target.value)} />
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input placeholder={t("form.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <Input placeholder={t("form.phone")} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false); }}>{t("form.cancel")}</Button>
            <Button type="submit">{t("form.create")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
