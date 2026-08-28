"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ContactFormFields } from "@/components/sections/contact/ContactFormFields";
import { submitContactRequestAction } from "@/app/actions/contact";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SUBJECT_OPTIONS = [
    { value: "", label: `${t("subjectLabel")}…` },
    { value: "dps", label: t("subjectOptions.dps") },
    { value: "save", label: t("subjectOptions.save") },
    { value: "campus", label: t("subjectOptions.campus") },
    { value: "pass-vip", label: t("subjectOptions.pass") },
    { value: "autre", label: t("subjectOptions.other") },
  ];

  const contactSchema = z.object({
    name: z.string().min(2, t("validation.nameMin")),
    company: z.string().min(2, t("validation.companyMin")),
    email: z.string().email(t("validation.emailInvalid")),
    phone: z.string().optional(),
    subject: z.string().min(1, t("validation.subjectRequired")),
    message: z.string().min(10, t("validation.messageMin")),
    acceptCgu: z.boolean().refine((val) => val === true, {
      message: t("validation.cguRequired"),
    }),
    // Pot de miel : jamais affiché, donc jamais rempli par un humain.
    website: z.string().optional(),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      acceptCgu: false,
      website: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    const result = await submitContactRequestAction({ kind: "contact", locale, ...data });
    setIsSubmitting(false);

    // Le succès n'est plus affiché que si la demande est réellement enregistrée.
    if (!result.ok) {
      toast.error(t("errorTitle"), { description: t("errorDesc") });
      return;
    }

    toast.success(t("successTitle"), {
      description: t("successDesc"),
    });

    form.reset();
  };

  return (
    <div className="rounded-[22px] border border-subtle bg-white p-[clamp(24px,3vw,34px)] shadow-cete-xl">
      <h3 className="mb-[10px] font-display text-[clamp(20px,2.2vw,26px)] font-black text-[#1A2940]">
        {t("heading")}
      </h3>
      <p className="mb-[28px] text-body-sm leading-[1.65] text-[#4A6580]">
        {t("requiredFields")}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[18px]">
          <ContactFormFields
            form={form}
            t={t}
            subjectOptions={SUBJECT_OPTIONS}
          />

          {/* Pot de miel. Masqué à l'écran, retiré de l'arbre d'accessibilité et
              du parcours clavier : seul un robot qui lit le HTML le remplira. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-website">Site web</label>
            <input
              id="contact-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("website")}
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl bg-[#E8630A] py-6 text-base font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-[#B84D08] group"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              t("sending")
            ) : (
              <>
                {t("submit")}
                <Send className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
