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

const SECTOR_OPTIONS = [
  { value: "", label: "Sélectionnez un secteur…" },
  { value: "energie", label: "Énergie & Utilities" },
  { value: "btp", label: "BTP & Génie électrique" },
  { value: "industrie", label: "Industrie" },
  { value: "transport", label: "Transport & Ferroviaire" },
  { value: "tertiaire", label: "Tertiaire" },
  { value: "collectivite", label: "Collectivités territoriales" },
  { value: "autre", label: "Autre" },
] as const;

const EVALUATION_OPTIONS = [
  { value: "", label: "Sélectionnez une prestation…" },
  { value: "dps", label: "DPS — Diagnostic Performance Sécurité" },
  { value: "save", label: "SAVE — Analyse de Vulnérabilité des Événements" },
  { value: "campus", label: "Campus CPF — Coaching, Performance, Formation" },
  { value: "pass-vip", label: "PASS-Sérénité VIP" },
  { value: "vigi-score", label: "Vigi-Score — Notation indépendante" },
  { value: "multiple", label: "Plusieurs prestations (préciser ci-dessous)" },
] as const;

const EMPLOYEE_OPTIONS = [
  { value: "", label: "Sélectionnez une tranche…" },
  { value: "1-10", label: "1 à 10 salariés" },
  { value: "11-50", label: "11 à 50 salariés" },
  { value: "51-250", label: "51 à 250 salariés" },
  { value: "251-1000", label: "251 à 1 000 salariés" },
  { value: "1000+", label: "Plus de 1 000 salariés" },
] as const;

const evaluationSchema = z.object({
  contactName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  contactRole: z.string().min(2, "La fonction est requise"),
  company: z.string().min(2, "Le nom de l'entreprise est requis"),
  siren: z.string().optional(),
  sector: z.string().min(1, "Veuillez sélectionner un secteur"),
  employees: z.string().min(1, "Veuillez sélectionner une tranche"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  evaluationType: z.string().min(1, "Veuillez sélectionner un type d'évaluation"),
  sites: z.string().optional(),
  details: z.string().optional(),
  acceptCgu: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les CGU",
  }),
});

type EvaluationFormData = z.infer<typeof evaluationSchema>;

export function EvaluationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      contactName: "",
      contactRole: "",
      company: "",
      siren: "",
      sector: "",
      employees: "",
      email: "",
      phone: "",
      evaluationType: "",
      sites: "",
      details: "",
      acceptCgu: false,
    },
  });

  const onSubmit = async (_data: EvaluationFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    toast.success("Demande d'évaluation envoyée !", {
      description: "Nous vous recontacterons dans les meilleurs délais pour organiser un entretien.",
    });

    form.reset();
  };

  return (
    <div className="rounded-2xl border border-[#DAEEF8] bg-white p-6 shadow-sm md:p-8">
      <h3 className="mb-1 font-display text-xl tracking-wide text-[#1A2940]">
        DEMANDER UNE ÉVALUATION
      </h3>
      <p className="mb-6 text-sm text-[#4A6580]">
        Renseignez votre organisation pour recevoir une proposition adaptée.
        Champs marqués * obligatoires.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactName"
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
              name="contactRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonction *</FormLabel>
                  <FormControl>
                    <Input placeholder="Responsable QSE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Company info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="siren"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SIREN</FormLabel>
                  <FormControl>
                    <Input placeholder="123 456 789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secteur d&apos;activité *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {SECTOR_OPTIONS.map((opt) => (
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
            <FormField
              control={form.control}
              name="employees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effectif *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {EMPLOYEE_OPTIONS.map((opt) => (
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
          </div>

          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email professionnel *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jean.dupont@entreprise.fr" {...field} />
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
                    <Input type="tel" placeholder="+33 1 XX XX XX XX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Evaluation specifics */}
          <FormField
            control={form.control}
            name="evaluationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type d&apos;évaluation souhaitée *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {EVALUATION_OPTIONS.map((opt) => (
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

          <FormField
            control={form.control}
            name="sites"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre et localisation des sites</FormLabel>
                <FormControl>
                  <Input placeholder="Ex : 3 sites — Lyon, Grenoble, Paris" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Précisions complémentaires</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contexte, contraintes de calendrier, objectifs particuliers…"
                    rows={3}
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
                Envoyer la demande d&apos;évaluation
                <Send className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
