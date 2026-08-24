import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Tests de la Server Action de captation (schéma + garde-fous), sans base ni
 * Next : next/headers et le client admin Supabase sont mockés. On observe ce
 * qui serait écrit via le spy d'insert.
 */

const { insertMock } = vi.hoisted(() => ({ insertMock: vi.fn() }));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers({ "x-forwarded-for": "203.0.113.7" })),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          gte: async () => ({ count: 0, error: null }),
        }),
      }),
      insert: insertMock,
    }),
  }),
}));

import { submitContactRequestAction, type ContactSubmission } from "./contact";

const validContact: ContactSubmission = {
  kind: "contact",
  name: "Jean Martin",
  email: "jean.martin@acme.fr",
  company: "ACME Industrie",
  subject: "Demande d'information",
  message: "Bonjour, je souhaite des informations sur votre offre.",
  acceptCgu: true,
};

const validEvaluation: ContactSubmission = {
  kind: "evaluation",
  name: "Marie Durand",
  email: "marie.durand@societe.fr",
  company: "Société Générale du Bâtiment",
  contactRole: "Responsable QSE",
  sector: "BTP",
  employees: "51-250",
  evaluationType: "initiale",
  acceptCgu: true,
};

beforeEach(() => {
  insertMock.mockReset();
  insertMock.mockResolvedValue({ error: null });
});

describe("submitContactRequestAction", () => {
  it("refuse un email invalide sans rien écrire", async () => {
    const result = await submitContactRequestAction({ ...validContact, email: "pas-un-email" });
    expect(result).toEqual({ ok: false, reason: "invalid" });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("refuse un message de 6 000 caractères sans rien écrire", async () => {
    const result = await submitContactRequestAction({
      ...validContact,
      message: "a".repeat(6000),
    });
    expect(result).toEqual({ ok: false, reason: "invalid" });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("accepte le pot de miel rempli mais n'écrit rien", async () => {
    const result = await submitContactRequestAction({ ...validContact, website: "http://spam.tld" });
    expect(result).toEqual({ ok: true });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("fait retomber une locale inconnue sur fr", async () => {
    const result = await submitContactRequestAction({ ...validContact, locale: "de" });
    expect(result).toEqual({ ok: true });
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock.mock.calls[0][0]).toMatchObject({ locale: "fr" });
  });

  it("écrit un message de contact avec ses champs propres", async () => {
    const result = await submitContactRequestAction(validContact);
    expect(result).toEqual({ ok: true });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "contact",
        email: "jean.martin@acme.fr",
        subject: "Demande d'information",
        ip: "203.0.113.7",
      })
    );
  });

  it("écrit une demande d'évaluation avec son payload jsonb", async () => {
    const result = await submitContactRequestAction(validEvaluation);
    expect(result).toEqual({ ok: true });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "evaluation",
        payload: expect.objectContaining({
          contactRole: "Responsable QSE",
          siren: null,
          employees: "51-250",
        }),
      })
    );
  });

  it("signale une perte d'écriture au lieu de mentir", async () => {
    insertMock.mockResolvedValue({ error: { message: "connection refused" } });
    const result = await submitContactRequestAction(validContact);
    expect(result).toEqual({ ok: false, reason: "storage" });
  });
});
