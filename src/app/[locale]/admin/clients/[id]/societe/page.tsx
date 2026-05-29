"use client";

import { useState, useEffect } from "react";
import { Edit, Plus, Trash2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useClient } from "@/components/features/admin/clients/ClientContext";
import { updateClient } from "@/lib/repo/clients.repo";
import type { Client, ClientContact, ClientLegalForm, ClientSector } from "@/types/client";

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm";
const LEGAL_FORMS: ClientLegalForm[] = ["SAS", "SARL", "SA", "EURL", "SCI", "autre"];
const SECTORS: ClientSector[] = ["industrie", "tertiaire", "logistique", "medical", "erp_collectif", "immobilier", "autre"];

export default function ClientCompanyPage() {
  const client = useClient();
  const t = useTranslations("admin.clients");
  const [editOpen, setEditOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ClientContact | null>(null);
  const [notes, setNotes] = useState(client.internalNotes);
  const [localClient, setLocalClient] = useState<Client>(client);

  // Company edit state
  const [companyName, setCompanyName] = useState(client.companyName);
  const [legalForm, setLegalForm] = useState(client.legalForm);
  const [siret, setSiret] = useState(client.siret);
  const [vatNumber, setVatNumber] = useState(client.vatNumber ?? "");
  const [sector, setSector] = useState(client.sector);
  const [headcount, setHeadcount] = useState(client.headcount ?? "");
  const [street, setStreet] = useState(client.address.street);
  const [postalCode, setPostalCode] = useState(client.address.postalCode);
  const [city, setCity] = useState(client.address.city);

  // Contact form state
  const [cFirst, setCFirst] = useState("");
  const [cLast, setCLast] = useState("");
  const [cRole, setCRole] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPhone, setCPhone] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    import("@/lib/repo/clients.repo").then(({ getClientById }) =>
      getClientById(client.id).then((updated) => {
        if (!cancelled && updated) setLocalClient(updated);
      })
    );
    return () => { cancelled = true; };
  }, [client.id, refreshKey]);

  const reload = () => setRefreshKey((k) => k + 1);

  const saveCompany = async () => {
    await updateClient(client.id, {
      companyName, legalForm, siret, vatNumber: vatNumber || undefined, sector, headcount: headcount || undefined,
      address: { street, postalCode, city, country: "FR" },
    });
    setEditOpen(false);
    reload();
  };

  const saveNotes = async () => {
    await updateClient(client.id, { internalNotes: notes });
    reload();
  };

  const openContactForm = (contact?: ClientContact) => {
    if (contact) {
      setEditingContact(contact);
      setCFirst(contact.firstName); setCLast(contact.lastName); setCRole(contact.role); setCEmail(contact.email); setCPhone(contact.phone);
    } else {
      setEditingContact(null);
      setCFirst(""); setCLast(""); setCRole(""); setCEmail(""); setCPhone("");
    }
    setContactOpen(true);
  };

  const saveContact = async () => {
    const contacts = [...localClient.contacts];
    if (editingContact) {
      const idx = contacts.findIndex((c) => c.id === editingContact.id);
      if (idx !== -1) contacts[idx] = { ...contacts[idx], firstName: cFirst, lastName: cLast, role: cRole, email: cEmail, phone: cPhone };
    } else {
      contacts.push({ id: `contact-${Date.now()}`, firstName: cFirst, lastName: cLast, role: cRole, email: cEmail, phone: cPhone, isPrimary: false });
    }
    await updateClient(client.id, { contacts });
    setContactOpen(false);
    reload();
  };

  const deleteContact = async (contactId: string) => {
    const contacts = localClient.contacts.filter((c) => c.id !== contactId);
    await updateClient(client.id, { contacts });
    reload();
  };

  const setPrimary = async (contactId: string) => {
    const contacts = localClient.contacts.map((c) => ({ ...c, isPrimary: c.id === contactId }));
    await updateClient(client.id, { contacts });
    reload();
  };

  return (
    <div className="space-y-6">
      {/* Company Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif-display">{t("company.legalInfo")}</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}><Edit className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.75} />{t("company.edit")}</Button>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm lg:grid-cols-3">
            <div><dt className="text-muted-foreground">{t("form.companyName")}</dt><dd className="font-medium">{localClient.companyName}</dd></div>
            <div><dt className="text-muted-foreground">{t("form.legalForm")}</dt><dd className="font-medium">{localClient.legalForm}</dd></div>
            <div><dt className="text-muted-foreground">SIRET</dt><dd className="font-mono">{localClient.siret}</dd></div>
            {localClient.vatNumber && <div><dt className="text-muted-foreground">{t("form.vatNumber")}</dt><dd className="font-mono">{localClient.vatNumber}</dd></div>}
            <div><dt className="text-muted-foreground">{t("form.sector")}</dt><dd><Badge variant="secondary">{t(`sectors.${localClient.sector}`)}</Badge></dd></div>
            {localClient.headcount && <div><dt className="text-muted-foreground">{t("form.headcount")}</dt><dd>{localClient.headcount}</dd></div>}
          </dl>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader><CardTitle className="font-serif-display">{t("company.address")}</CardTitle></CardHeader>
        <CardContent className="text-sm">
          <p>{localClient.address.street}</p>
          <p>{localClient.address.postalCode} {localClient.address.city}</p>
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif-display">{t("company.contacts")} ({localClient.contacts.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={() => openContactForm()}><Plus className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.75} />{t("company.addContact")}</Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {localClient.contacts.map((c) => (
              <div key={c.id} className="relative rounded-lg border p-4">
                {c.isPrimary && <Badge className="absolute -top-2 right-2 bg-primary text-xs">{t("company.setPrimary")}</Badge>}
                <p className="font-medium">{c.firstName} {c.lastName}</p>
                <p className="text-sm text-muted-foreground">{c.role}</p>
                <p className="mt-1 text-sm">{c.email}</p>
                <p className="text-sm text-muted-foreground">{c.phone}</p>
                <div className="mt-3 flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openContactForm(c)}><Edit className="h-3.5 w-3.5" strokeWidth={1.75} /></Button>
                  {!c.isPrimary && <Button variant="ghost" size="icon" onClick={() => setPrimary(c.id)}><Star className="h-3.5 w-3.5" strokeWidth={1.75} /></Button>}
                  {!c.isPrimary && <Button variant="ghost" size="icon" onClick={() => deleteContact(c.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" strokeWidth={1.75} /></Button>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader><CardTitle className="font-serif-display">{t("company.notes")}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button size="sm" onClick={saveNotes}>{t("company.saveNotes")}</Button>
        </CardContent>
      </Card>

      {/* Edit Company Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{t("form.editTitle")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>{t("form.companyName")}</Label><Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("form.legalForm")}</Label><select className={selectClass} value={legalForm} onChange={(e) => setLegalForm(e.target.value as ClientLegalForm)}>{LEGAL_FORMS.map((f) => <option key={f}>{f}</option>)}</select></div>
              <div className="space-y-2"><Label>SIRET</Label><Input value={siret} onChange={(e) => setSiret(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("form.vatNumber")}</Label><Input value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} /></div>
              <div className="space-y-2"><Label>{t("form.sector")}</Label><select className={selectClass} value={sector} onChange={(e) => setSector(e.target.value as ClientSector)}>{SECTORS.map((s) => <option key={s} value={s}>{t(`sectors.${s}`)}</option>)}</select></div>
            </div>
            <div className="space-y-2"><Label>{t("form.headcount")}</Label><Input value={headcount} onChange={(e) => setHeadcount(e.target.value)} placeholder="ex: 51-200" /></div>
            <div className="border-t pt-4 space-y-2">
              <Label>{t("company.address")}</Label>
              <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder={t("form.street")} />
              <div className="grid grid-cols-2 gap-4">
                <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder={t("form.postalCode")} />
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("form.city")} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>{t("form.cancel")}</Button>
              <Button onClick={saveCompany}>{t("form.save")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Form Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingContact ? t("company.editContact") : t("company.newContact")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("form.firstName")}</Label><Input value={cFirst} onChange={(e) => setCFirst(e.target.value)} /></div>
              <div className="space-y-2"><Label>{t("form.lastName")}</Label><Input value={cLast} onChange={(e) => setCLast(e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>{t("form.role")}</Label><Input value={cRole} onChange={(e) => setCRole(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("form.email")}</Label><Input type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} /></div>
              <div className="space-y-2"><Label>{t("form.phone")}</Label><Input value={cPhone} onChange={(e) => setCPhone(e.target.value)} /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setContactOpen(false)}>{t("form.cancel")}</Button>
              <Button onClick={saveContact}>{t("form.save")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
