"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface SubjectOption {
  value: string;
  label: string;
}

interface ContactFormFieldsProps {
  form: UseFormReturn<{
    name: string;
    company: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    acceptCgu: boolean;
    /** Pot de miel, rendu par ContactForm — jamais affiché ici. */
    website?: string;
  }>;
  t: (key: string) => string;
  subjectOptions: SubjectOption[];
}

// Style commun des champs texte/email/tel — cf. fiche §06. Passé en className
// car Input est un composant shadcn générique partagé avec l'admin/le portail
// client, qui ont leurs propres thèmes.
const fieldClass =
  "h-auto rounded-[11px] border-[rgba(77,166,217,0.35)] bg-[#FBFDFF] px-[15px] py-[13px] text-body-sm text-[#1A2940] shadow-none placeholder:text-[#9DB2C6] focus-visible:border-[#4DA6D9] focus-visible:ring-[3px] focus-visible:ring-[rgba(77,166,217,0.18)]";
const labelClass = "text-[0.8125rem] font-semibold text-[#1A2940]";
const errorClass = "text-caption text-[#B91C1C]";

export function ContactFormFields({ form, t, subjectOptions }: ContactFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>{t("nameLabel")} *</FormLabel>
            <FormControl>
              <Input placeholder={t("namePlaceholder")} className={fieldClass} {...field} />
            </FormControl>
            <FormMessage className={errorClass} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>{t("companyLabel")} *</FormLabel>
            <FormControl>
              <Input placeholder={t("companyPlaceholder")} className={fieldClass} {...field} />
            </FormControl>
            <FormMessage className={errorClass} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>{t("emailLabel")} *</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                className={fieldClass}
                {...field}
              />
            </FormControl>
            <FormMessage className={errorClass} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>{t("phoneLabel")}</FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder={t("phonePlaceholder")}
                className={fieldClass}
                {...field}
              />
            </FormControl>
            <FormMessage className={errorClass} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>{t("subjectLabel")} *</FormLabel>
            <FormControl>
              <select
                {...field}
                // text-base sous md : en dessous de 16px, Safari iOS zoome à l'ouverture
                // du picker et décale la page.
                className="flex h-auto w-full min-w-0 rounded-[11px] border border-[rgba(77,166,217,0.35)] bg-[#FBFDFF] px-[15px] py-[13px] text-base text-[#1A2940] transition-colors md:text-body-sm focus-visible:border-[#4DA6D9] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(77,166,217,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {subjectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage className={errorClass} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>{t("messageLabel")} *</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("messagePlaceholder")}
                rows={5}
                className={`${fieldClass} leading-[1.6] resize-y`}
                {...field}
              />
            </FormControl>
            <FormMessage className={errorClass} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="acceptCgu"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="mt-1 h-[18px] w-[18px] accent-[#E8630A] rounded border-[rgba(77,166,217,0.35)]"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-normal text-[#4A6580]">
                {t("acceptCgu")} *
              </FormLabel>
              <FormMessage className={errorClass} />
            </div>
          </FormItem>
        )}
      />
    </>
  );
}
