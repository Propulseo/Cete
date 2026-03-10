"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  company: z.string().min(2, "Le nom de l'entreprise est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  acceptCgu: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les CGU",
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
      acceptCgu: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    toast.success("Message envoyé !", {
      description: "Nous vous répondrons dans les 24 heures.",
    });

    form.reset();
  };

  return (
    <div className="rounded-2xl border border-[#DAEEF8] bg-white p-6 shadow-sm md:p-8">
      <h3 className="mb-1 font-display text-xl tracking-wide text-[#1A2940]">
        ENVOYEZ-NOUS UN MESSAGE
      </h3>
      <p className="mb-6 text-sm text-[#4A6580]">
        Tous les champs marqués * sont obligatoires
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet *</FormLabel>
                <FormControl>
                  <Input placeholder="Jean Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entreprise *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre entreprise" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jean.dupont@entreprise.fr"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+33 1 XX XX XX XX"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez votre besoin..."
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                    className="mt-1 h-4 w-4 rounded border-[#DAEEF8]"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    J&apos;accepte les{" "}
                    <a href="/cgu" className="text-primary underline">
                      conditions générales d&apos;utilisation
                    </a>{" "}
                    *
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#E8630A] text-white hover:bg-[#B84D08] font-semibold py-6 text-base rounded-xl group"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Envoi en cours..."
            ) : (
              <>
                Envoyer le message
                <Send className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
