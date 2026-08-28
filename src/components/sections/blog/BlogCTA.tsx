"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { subscribeNewsletterAction } from "@/app/actions/newsletter";

export function BlogCTA() {
  const t = useTranslations("blog.cta");
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newsletterSchema = z.object({
    email: z.string().email(t("validation.emailInvalid")),
    consent: z.boolean().refine((v) => v, { message: t("validation.consentRequired") }),
    // Pot de miel : jamais affiché, donc jamais rempli par un humain.
    website: z.string().optional(),
  });
  type NewsletterFormData = z.infer<typeof newsletterSchema>;

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", consent: false, website: "" },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    const result = await subscribeNewsletterAction({ locale, ...data });
    setIsSubmitting(false);

    if (!result.ok) {
      toast.error(t("errorTitle"), { description: t("errorDesc") });
      return;
    }
    toast.success(t("successTitle"), { description: t("successDesc") });
    form.reset();
  };

  return (
    <section className="bg-grad-ink relative overflow-hidden py-[clamp(56px,7vw,96px)]">
      <div className="glow-blob absolute right-[12%] top-[-60px] h-[300px] w-[300px]" />
      <div className="absolute bottom-[-80px] left-[8%] h-[300px] w-[300px] rounded-full bg-[#E8630A]/10 blur-[80px]" />

      <div className="container-reading relative z-10 text-center">
        <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4DA6D9]/20 text-[#87C4E8]">
          <Mail className="h-6 w-6" />
        </span>
        <h2 className="mb-[18px] font-display text-[clamp(26px,3.6vw,44px)] font-black uppercase leading-[1.1] text-white">
          {t("heading")}
        </h2>
        <p className="mx-auto mb-9 max-w-[560px] text-lead leading-[1.7] text-[#8AA5BE]">
          {t("description")}
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto max-w-[440px] space-y-4 text-left"
          >
            {/* Pot de miel, masqué à l'écran et hors du parcours clavier. */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="newsletter-website">Site web</label>
              <input
                id="newsletter-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...form.register("website")}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="h-12 rounded-xl border-white/20 bg-white/10 px-4 text-body text-white shadow-none placeholder:text-[#8AA5BE] focus-visible:border-[#4DA6D9] focus-visible:ring-[3px] focus-visible:ring-[rgba(77,166,217,0.25)]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-caption text-[#F59542]" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="shadow-cta h-12 shrink-0 rounded-xl bg-[#E8630A] px-[26px] text-body font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B84D08]"
              >
                {isSubmitting ? (
                  t("sending")
                ) : (
                  <>
                    {t("submit")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>

            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2.5 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1 h-[16px] w-[16px] shrink-0 rounded border-white/30 accent-[#E8630A]"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-snug">
                    <label className="text-[0.8125rem] font-normal text-[#8AA5BE]">
                      {t("consent")}{" "}
                      <Link href="/privacy" className="underline hover:text-white">
                        {t("privacyLink")}
                      </Link>
                      .
                    </label>
                    <FormMessage className="text-caption text-[#F59542]" />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </section>
  );
}
