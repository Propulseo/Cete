"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectField, TextField, TextareaField } from "./EvaluationFormFields";
import type { EvaluationFormData, SelectOption } from "./EvaluationFormFields";

export function EvaluationForm() {
  const t = useTranslations("contact.evaluationForm");
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
  });

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      contactName: "", contactRole: "", company: "", siren: "",
      sector: "", employees: "", email: "", phone: "",
      evaluationType: "", sites: "", details: "", acceptCgu: false,
    },
  });

  const onSubmit = async (_data: EvaluationFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
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
          <Button type="submit" className="w-full bg-[#E8630A] text-white hover:bg-[#B84D08] font-semibold py-6 text-base rounded-xl group" disabled={isSubmitting}>
            {isSubmitting ? t("sending") : <>{t("submit")}<Send className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></>}
          </Button>
        </form>
      </Form>
    </div>
  );
}
