"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";

type SelectOption = { value: string; label: string };

interface EvaluationFormData {
  contactName: string;
  contactRole: string;
  company: string;
  siren?: string;
  sector: string;
  employees: string;
  email: string;
  phone?: string;
  evaluationType: string;
  sites?: string;
  details?: string;
  acceptCgu: boolean;
  /** Pot de miel, rendu par EvaluationForm — aucun champ visible ne s'y rattache. */
  website?: string;
}

// La hauteur tactile était déjà traitée ; restait la taille de police : sous 16px,
// Safari iOS zoome à l'ouverture du picker et décale toute la page.
const selectClass =
  "flex h-auto w-full min-w-0 rounded-[11px] border border-[rgba(77,166,217,0.35)] bg-[#FBFDFF] px-[15px] py-[13px] text-base text-[#1A2940] transition-colors md:text-[14.5px] focus-visible:border-[#4DA6D9] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(77,166,217,0.18)]";
// Style commun des champs texte — cf. fiche §06. Passé en className car Input/
// Textarea sont des composants shadcn génériques partagés avec l'admin/le
// portail client, qui ont leurs propres thèmes.
const fieldClass =
  "h-auto rounded-[11px] border-[rgba(77,166,217,0.35)] bg-[#FBFDFF] px-[15px] py-[13px] text-[14.5px] text-[#1A2940] shadow-none placeholder:text-[#9DB2C6] focus-visible:border-[#4DA6D9] focus-visible:ring-[3px] focus-visible:ring-[rgba(77,166,217,0.18)]";
const labelClass = "text-[13px] font-semibold text-[#1A2940]";
const errorClass = "text-[12.5px] text-[#B91C1C]";

function SelectField({
  form,
  name,
  label,
  options,
}: {
  form: UseFormReturn<EvaluationFormData>;
  name: keyof EvaluationFormData;
  label: string;
  options: SelectOption[];
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClass}>{label} *</FormLabel>
          <FormControl>
            <select {...field} value={field.value as string} className={selectClass}>
              {options.map((opt) => (
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
  );
}

function TextField({
  form,
  name,
  label,
  placeholder,
  required,
  type = "text",
}: {
  form: UseFormReturn<EvaluationFormData>;
  name: keyof EvaluationFormData;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClass}>{label}{required ? " *" : ""}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} className={fieldClass} {...field} value={field.value as string} />
          </FormControl>
          <FormMessage className={errorClass} />
        </FormItem>
      )}
    />
  );
}

function TextareaField({
  form,
  name,
  label,
  placeholder,
  rows = 3,
}: {
  form: UseFormReturn<EvaluationFormData>;
  name: keyof EvaluationFormData;
  label: string;
  placeholder: string;
  rows?: number;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClass}>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              className={`${fieldClass} leading-[1.6] resize-y`}
              {...field}
              value={field.value as string}
            />
          </FormControl>
          <FormMessage className={errorClass} />
        </FormItem>
      )}
    />
  );
}

export { SelectField, TextField, TextareaField };
export type { EvaluationFormData, SelectOption };
