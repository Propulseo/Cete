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
}

// La hauteur tactile était déjà traitée ; restait la taille de police : sous 16px,
// Safari iOS zoome à l'ouverture du picker et décale toute la page.
const selectClass =
  "flex h-11 sm:h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

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
          <FormLabel>{label} *</FormLabel>
          <FormControl>
            <select {...field} value={field.value as string} className={selectClass}>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormControl>
          <FormMessage />
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
          <FormLabel>{label}{required ? " *" : ""}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} value={field.value as string} />
          </FormControl>
          <FormMessage />
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
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} rows={rows} {...field} value={field.value as string} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { SelectField, TextField, TextareaField };
export type { EvaluationFormData, SelectOption };
