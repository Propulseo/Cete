"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ContactFormFields } from "@/components/sections/contact/ContactFormFields";

export function ContactForm() {
  const t = useTranslations("contact.form");
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
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    toast.success(t("successTitle"), {
      description: t("successDesc"),
    });

    form.reset();
  };

  return (
    <div className="rounded-2xl border border-[#DAEEF8] bg-white p-6 shadow-sm md:p-8">
      <h3 className="mb-1 font-display text-xl tracking-wide text-[#1A2940]">
        {t("heading")}
      </h3>
      <p className="mb-6 text-sm text-[#4A6580]">
        {t("requiredFields")}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ContactFormFields
            form={form}
            t={t}
            subjectOptions={SUBJECT_OPTIONS}
          />

          <Button
            type="submit"
            className="w-full bg-[#E8630A] text-white hover:bg-[#B84D08] font-semibold py-6 text-base rounded-xl group"
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
