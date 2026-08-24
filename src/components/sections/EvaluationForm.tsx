"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectField, TextField, TextareaField } from "./EvaluationFormFields";
import type { EvaluationFormData, SelectOption } from "./EvaluationFormFields";
import { submitContactRequestAction } from "@/app/actions/contact";

export function EvaluationForm() {
  const t = useTranslations("contact.evaluationForm");
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectorOpts: SelectOption[] = [
    { value: "", label: `${t("sectorLabel")}…` },
    { value: "energie", label: t("sectorOptions.energy") },
    { value: "btp", label: t("sectorOptions.construction") },
    { value: "industrie", label: t("sectorOptions.industry") },
    { value: "transport", label: t("sectorOptions.transport") },
    { value: "tertiaire", label: t("sectorOptions.tertiary") },
    { value: "collectivite", label: t("sectorOptions.collectivities") },
    { value: "autre", label: t("sectorOptions.other") },
  ];

  const evalOpts: SelectOption[] = [
    { value: "", label: `${t("evaluationTypeLabel")}…` },
    { value: "dps", label: t("evaluationOptions.dps") },
    { value: "save", label: t("evaluationOptions.save") },
    { value: "campus", label: t("evaluationOptions.campus") },
    { value: "pass-vip", label: t("evaluationOptions.pass") },
    { value: "vigi-score", label: t("evaluationOptions.vigiScore") },
    { value: "multiple", label: t("evaluationOptions.multiple") },
  ];

  const empOpts: SelectOption[] = [
    { value: "", label: `${t("employeesLabel")}…` },
    { value: "1-10", label: t("employeeOptions.xs") },
    { value: "11-50", label: t("employeeOptions.sm") },
    { value: "51-250", label: t("employeeOptions.md") },
    { value: "251-1000", label: t("employeeOptions.lg") },
    { value: "1000+", label: t("employeeOptions.xl") },
  ];

  const schema = z.object({
    contactName: z.string().min(2, t("validation.nameMin")),
    contactRole: z.string().min(2, t("validation.roleMin")),
    company: z.string().min(2, t("validation.companyMin")),
    siren: z.string().optional(),
    sector: z.string().min(1, t("validation.sectorRequired")),
    employees: z.string().min(1, t("validation.employeesRequired")),
    email: z.string().email(t("validation.emailInvalid")),
    phone: z.string().optional(),
    evaluationType: z.string().min(1, t("validation.evaluationRequired")),
    sites: z.string().optional(),
    details: z.string().optional(),
    acceptCgu: z.boolean().refine((v) => v, { message: t("validation.cguRequired") }),
    // Pot de miel : jamais affiché, donc jamais rempli par un humain.
    website: z.string().optional(),
  });

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      contactName: "", contactRole: "", company: "", siren: "",
      sector: "", employees: "", email: "", phone: "",
      evaluationType: "", sites: "", details: "", acceptCgu: false, website: "",
    },
  });

  const onSubmit = async (data: EvaluationFormData) => {
    setIsSubmitting(true);
    // Correspondance explicite, pas un spread : le formulaire dit `contactName`
    // là où la table et l'action disent `name`.
    const result = await submitContactRequestAction({
      kind: "evaluation",
      locale,
      name: data.contactName,
      contactRole: data.contactRole,
      company: data.company,
      siren: data.siren,
      sector: data.sector,
      employees: data.employees,
      email: data.email,
      phone: data.phone,
      evaluationType: data.evaluationType,
      sites: data.sites,
      details: data.details,
      acceptCgu: data.acceptCgu,
      website: data.website,
    });
    setIsSubmitting(false);

    // Le succès n'est plus affiché que si la demande est réellement enregistrée.
    if (!result.ok) {
      toast.error(t("errorTitle"), { description: t("errorDesc") });
      return;
    }

    toast.success(t("successTitle"), { description: t("successDesc") });
    form.reset();
  };

  return (
    <div className="rounded-2xl border border-[#DAEEF8] bg-white p-6 shadow-sm md:p-8">
      <h3 className="mb-1 font-display text-xl tracking-wide text-[#1A2940]">{t("heading")}</h3>
      <p className="mb-6 text-sm text-[#4A6580]">{t("description")}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField form={form} name="contactName" label={t("nameLabel")} placeholder={t("namePlaceholder")} required />
            <TextField form={form} name="contactRole" label={t("roleLabel")} placeholder={t("rolePlaceholder")} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField form={form} name="company" label={t("companyLabel")} placeholder={t("companyPlaceholder")} required />
            <TextField form={form} name="siren" label={t("sirenLabel")} placeholder={t("sirenPlaceholder")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField form={form} name="sector" label={t("sectorLabel")} options={sectorOpts} />
            <SelectField form={form} name="employees" label={t("employeesLabel")} options={empOpts} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField form={form} name="email" label={t("emailLabel")} placeholder={t("emailPlaceholder")} required type="email" />
            <TextField form={form} name="phone" label={t("phoneLabel")} placeholder={t("phonePlaceholder")} />
          </div>
          <SelectField form={form} name="evaluationType" label={t("evaluationTypeLabel")} options={evalOpts} />
          <TextField form={form} name="sites" label={t("sitesLabel")} placeholder={t("sitesPlaceholder")} />
          <TextareaField form={form} name="details" label={t("detailsLabel")} placeholder={t("detailsPlaceholder")} />
          <FormField control={form.control} name="acceptCgu" render={({ field }) => (
            // min-h-11 : la case fait 16px mais le FormLabel lui est lié
            // (htmlFor), donc c'est la rangée qui porte la cible tactile.
            <FormItem className="flex min-h-11 flex-row items-start space-x-3 space-y-0 sm:min-h-0">
              <FormControl>
                <input type="checkbox" checked={field.value} onChange={field.onChange} className="mt-1 h-4 w-4 rounded border-[#DAEEF8]" />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="flex min-h-11 items-center text-sm font-normal sm:min-h-0">{t("acceptCgu")} *</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )} />
          {/* Pot de miel. Masqué à l'écran, retiré de l'arbre d'accessibilité et
              du parcours clavier : seul un robot qui lit le HTML le remplira. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="evaluation-website">Site web</label>
            <input id="evaluation-website" type="text" tabIndex={-1} autoComplete="off" {...form.register("website")} />
          </div>
          <Button type="submit" className="w-full bg-[#E8630A] text-white hover:bg-[#B84D08] font-semibold py-6 text-base rounded-xl group" disabled={isSubmitting}>
            {isSubmitting ? t("sending") : <>{t("submit")}<Send className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></>}
          </Button>
        </form>
      </Form>
    </div>
  );
}
