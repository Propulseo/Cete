import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Tests de la Server Action d'inscription newsletter (schéma + garde-fous),
 * sans base ni Brevo : le client admin Supabase et le client Brevo sont mockés.
 */

const { upsertMock, updateMock, brevoUpsertMock } = vi.hoisted(() => ({
  upsertMock: vi.fn(),
  updateMock: vi.fn(),
  brevoUpsertMock: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      upsert: upsertMock,
      update: updateMock,
    }),
  }),
}));

vi.mock("@/lib/email/brevo", () => ({
  upsertNewsletterContact: brevoUpsertMock,
}));

import { subscribeNewsletterAction, type NewsletterSubmission } from "./newsletter";

const validInput: NewsletterSubmission = {
  email: "prospect@acme.fr",
  consent: true,
};

beforeEach(() => {
  upsertMock.mockReset();
  updateMock.mockReset();
  brevoUpsertMock.mockReset();
  upsertMock.mockReturnValue({
    select: () => ({
      single: async () => ({ data: { id: "generated-id" }, error: null }),
    }),
  });
  updateMock.mockReturnValue({ eq: async () => ({ error: null }) });
  brevoUpsertMock.mockResolvedValue({ ok: true });
  process.env.BREVO_NEWSLETTER_LIST_ID = "42";
});

describe("subscribeNewsletterAction", () => {
  it("refuse un email invalide sans rien écrire", async () => {
    const result = await subscribeNewsletterAction({ ...validInput, email: "pas-un-email" });
    expect(result).toEqual({ ok: false, reason: "invalid" });
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("refuse une inscription sans consentement", async () => {
    const result = await subscribeNewsletterAction({ ...validInput, consent: false });
    expect(result).toEqual({ ok: false, reason: "invalid" });
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("accepte le pot de miel rempli mais n'écrit rien", async () => {
    const result = await subscribeNewsletterAction({ ...validInput, website: "http://spam.tld" });
    expect(result).toEqual({ ok: true });
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("écrit l'email en base, normalisé en minuscules", async () => {
    const result = await subscribeNewsletterAction({ ...validInput, email: "Prospect@ACME.fr" });
    expect(result).toEqual({ ok: true });
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ email: "prospect@acme.fr" }),
      { onConflict: "email" }
    );
  });

  it("synchronise avec Brevo et marque la ligne comme synchronisée", async () => {
    const result = await subscribeNewsletterAction(validInput);
    expect(result).toEqual({ ok: true });
    expect(brevoUpsertMock).toHaveBeenCalledWith({ email: "prospect@acme.fr", listId: 42 });
    expect(updateMock).toHaveBeenCalledWith({ brevo_synced: true });
  });

  it("trace l'échec de synchronisation sans faire échouer l'inscription", async () => {
    brevoUpsertMock.mockResolvedValue({ ok: false, error: "HTTP 401 IP non autorisée" });
    const result = await subscribeNewsletterAction(validInput);
    expect(result).toEqual({ ok: true });
    expect(updateMock).toHaveBeenCalledWith({ brevo_error: "HTTP 401 IP non autorisée" });
  });

  it("signale une perte d'écriture au lieu de mentir", async () => {
    upsertMock.mockReturnValue({
      select: () => ({
        single: async () => ({ data: null, error: { message: "connection refused" } }),
      }),
    });
    const result = await subscribeNewsletterAction(validInput);
    expect(result).toEqual({ ok: false, reason: "storage" });
    expect(brevoUpsertMock).not.toHaveBeenCalled();
  });
});
